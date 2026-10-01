import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { generatePaymentReceiptEmailHtml, EMAIL_CONFIG, sendEmail } from '@/lib/email';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SECRET_KEY!;

// Initialize Supabase with the service role key to bypass RLS for payment updates
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req: Request) {
  try {
    const { transaction_id, booking_id } = await req.json();

    if (!transaction_id || !booking_id) {
      return NextResponse.json(
        { error: 'Transaction ID and Booking ID are required' },
        { status: 400 }
      );
    }

    const flutterwaveSecretKey = process.env.FLUTTERWAVE_SECRET_KEY;

    if (!flutterwaveSecretKey) {
      console.error('Flutterwave secret key is not set.');
      return NextResponse.json(
        { error: 'Payment gateway configuration error' },
        { status: 500 }
      );
    }

    // Verify transaction with Flutterwave API
    const response = await fetch(
      `https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${flutterwaveSecretKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const flutterwaveData = await response.json();

    if (flutterwaveData.status === 'success' && flutterwaveData.data.status === 'successful') {
      // Fetch the booking first so we can verify this transaction actually
      // belongs to it, before trusting it enough to mark anything paid.
      const { data: booking, error: fetchError } = await supabase
        .from('bookings')
        .select('*, rental:rentals(title, type)')
        .eq('id', booking_id)
        .single();

      if (fetchError || !booking) {
        return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
      }

      // A verified Flutterwave transaction only proves *some* payment went
      // through — not that it was for this booking, or for the right amount.
      // Without this check, a real transaction_id for a cheap/unrelated
      // booking could be replayed here to mark an expensive booking as paid.
      const expectedTxRefPrefix = `booking-${booking_id}-`;
      if (typeof flutterwaveData.data.tx_ref !== 'string' || !flutterwaveData.data.tx_ref.startsWith(expectedTxRefPrefix)) {
        console.warn('Payment verify rejected: tx_ref does not match booking', { booking_id, tx_ref: flutterwaveData.data.tx_ref });
        return NextResponse.json({ error: 'Transaction does not match this booking' }, { status: 400 });
      }

      const paidAmount = Number(flutterwaveData.data.amount);
      const expectedAmount = Number(booking.total_price);
      if (!Number.isFinite(paidAmount) || Math.abs(paidAmount - expectedAmount) > 0.01) {
        console.warn('Payment verify rejected: amount mismatch', { booking_id, paidAmount, expectedAmount });
        return NextResponse.json({ error: 'Paid amount does not match booking price' }, { status: 400 });
      }

      // Idempotency: avoid re-processing (and re-emailing) a booking that's
      // already been marked paid, e.g. if the client calls this twice.
      if (booking.payment_status === 'paid') {
        return NextResponse.json({ success: true, message: 'Booking already confirmed.' });
      }

      const { error: updateError } = await supabase
        .from('bookings')
        .update({
          payment_status: 'paid',
          status: 'confirmed'
        })
        .eq('id', booking_id);

      if (updateError) {
        console.error('Error updating booking status:', updateError);
        return NextResponse.json(
          { error: 'Failed to update booking status' },
          { status: 500 }
        );
      }

      // Dispatch payment confirmation email
      if (booking) {
        try {
          let customerEmail = flutterwaveData.data.customer?.email || booking.guest_email;
          let customerName = flutterwaveData.data.customer?.name || booking.guest_name;

          // If booking was placed by a registered user, fetch their profile email/name if missing
          if ((!customerEmail || !customerName) && booking.user_id) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('email, full_name')
              .eq('id', booking.user_id)
              .maybeSingle();

            if (!customerEmail && profile?.email) customerEmail = profile.email;
            if (!customerName && profile?.full_name) customerName = profile.full_name;
          }

          if (customerEmail) {
            const rentalTitle = booking.rental?.title || 'Luxury Fleet Service';
            const emailHtml = generatePaymentReceiptEmailHtml({
              customerName,
              rentalTitle,
              rentalType: booking.rental?.type,
              startDate: booking.start_date,
              endDate: booking.end_date,
              driveOption: booking.drive_option,
              currency: flutterwaveData.data.currency || 'GHS',
              amount: flutterwaveData.data.amount,
              transactionId: flutterwaveData.data.id || transaction_id,
              bookingId: booking_id,
              paymentMethod: flutterwaveData.data.payment_type || 'Card / Mobile Money',
            });

            // 1. Send receipt to the customer
            await sendEmail({
              from: EMAIL_CONFIG.from,
              replyTo: EMAIL_CONFIG.replyTo,
              to: customerEmail,
              subject: `Payment Confirmed & Receipt - ${rentalTitle}`,
              html: emailHtml,
            });

            // 2. Also notify the Top Reasons operations desk at enquiries@topreasonsco.com
            try {
              await sendEmail({
                from: EMAIL_CONFIG.from,
                replyTo: customerEmail,
                to: EMAIL_CONFIG.supportEmail,
                subject: `🚨 [PAID RESERVATION] ${rentalTitle} - ${flutterwaveData.data.currency} ${flutterwaveData.data.amount}`,
                html: emailHtml,
              });
            } catch (adminErr) {
              console.warn('Failed to send admin notification email:', adminErr);
            }
          }
        } catch (emailError) {
          console.error('Failed to send payment confirmation email:', emailError);
          // Non-blocking: we don't fail the verification response if the mail provider errors
        }
      }

      return NextResponse.json({ success: true, message: 'Payment verified and booking updated.' });
    } else {
      return NextResponse.json(
        { error: 'Payment verification failed or transaction not successful' },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
