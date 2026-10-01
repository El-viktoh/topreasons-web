import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { generatePaymentReceiptEmailHtml, EMAIL_CONFIG, sendEmail } from '@/lib/email';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SECRET_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req: Request) {
  try {
    const signature = req.headers.get('verif-hash');
    const secretHash = process.env.FLUTTERWAVE_SECRET_HASH;

    // Fail closed: without a configured secret there is no way to tell a real
    // Flutterwave call from a forged one, so refuse the request rather than
    // silently accepting it.
    if (!secretHash) {
      console.error('Webhook rejected: FLUTTERWAVE_SECRET_HASH is not configured.');
      return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 });
    }

    if (signature !== secretHash) {
      console.warn('Webhook verification failed: invalid verif-hash signature.');
      return NextResponse.json({ error: 'Unauthorized webhook call' }, { status: 401 });
    }

    const payload = await req.json();
    const { event, data } = payload;

    if (event === 'charge.completed' && data?.status === 'successful') {
      const transactionId = data.id;
      const txRef = data.tx_ref;
      const amount = data.amount;
      const currency = data.currency;

      // Extract booking ID from tx_ref (format: booking-<uuid>-<timestamp>).
      // The booking UUID itself contains hyphens, so this can't be a simple
      // split on "-" — match everything between the "booking-" prefix and the
      // trailing numeric timestamp instead.
      let bookingId: string | null = null;
      if (txRef && typeof txRef === 'string') {
        const match = txRef.match(/^booking-(.+)-\d+$/);
        if (match) {
          bookingId = match[1];
        }
      }

      if (!bookingId && data.meta?.booking_id) {
        bookingId = data.meta.booking_id;
      }

      if (bookingId) {
        // Fetch booking record
        const { data: booking } = await supabase
          .from('bookings')
          .select('*, rental:rentals(title, type)')
          .eq('id', bookingId)
          .maybeSingle();

        if (booking && booking.payment_status !== 'paid') {
          // Update status to paid & confirmed
          await supabase
            .from('bookings')
            .update({
              payment_status: 'paid',
              status: 'confirmed'
            })
            .eq('id', booking.id);

          // Dispatch email receipt
          const customerEmail = data.customer?.email || booking.guest_email;
          const customerName = data.customer?.name || booking.guest_name;

          if (customerEmail) {
            const rentalTitle = booking.rental?.title || 'Luxury Fleet Service';
            const emailHtml = generatePaymentReceiptEmailHtml({
              customerName,
              rentalTitle,
              rentalType: booking.rental?.type,
              startDate: booking.start_date,
              endDate: booking.end_date,
              driveOption: booking.drive_option,
              currency: currency || 'GHS',
              amount,
              transactionId,
              bookingId: booking.id,
              paymentMethod: data.payment_type || 'Card / Mobile Money',
            });

            // 1. Send receipt to customer
            await sendEmail({
              from: EMAIL_CONFIG.from,
              replyTo: EMAIL_CONFIG.replyTo,
              to: customerEmail,
              subject: `Payment Confirmed & Receipt - ${rentalTitle}`,
              html: emailHtml,
            });

            // 2. Alert operations desk
            try {
              await sendEmail({
                from: EMAIL_CONFIG.from,
                replyTo: customerEmail,
                to: EMAIL_CONFIG.supportEmail,
                subject: `🚨 [PAID WEBHOOK] ${rentalTitle} - ${currency} ${amount}`,
                html: emailHtml,
              });
            } catch (adminErr) {
              console.warn('Webhook admin notification failed:', adminErr);
            }
          }
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Flutterwave webhook processing error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
