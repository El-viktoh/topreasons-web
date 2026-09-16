import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

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

    // Verify transaction with Flutterwave
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
      // Payment was successful, update booking status
      const { error } = await supabase
        .from('bookings')
        .update({ 
          payment_status: 'paid',
          // Optional: change status to confirmed if that aligns with business logic
          status: 'confirmed' 
        })
        .eq('id', booking_id);

      if (error) {
        console.error('Error updating booking status:', error);
        return NextResponse.json(
          { error: 'Failed to update booking status' },
          { status: 500 }
        );
      }

      // Fetch booking details for the email
      const { data: booking } = await supabase
        .from('bookings')
        .select('*, rental:rentals(title)')
        .eq('id', booking_id)
        .single();

      // Send email if we have the Resend API key and booking details
      if (process.env.RESEND_API_KEY && booking && resend) {
        try {
          const customerEmail = flutterwaveData.data.customer.email;
          const rentalTitle = booking.rental?.title || 'Rental';
          
          await resend.emails.send({
            from: 'Top Reasons <enquiries@topreasonsco.com>',
            to: customerEmail,
            subject: `Payment Confirmed - ${rentalTitle}`,
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #1a1a1a;">Payment Successful!</h1>
                <p>Thank you for your payment. Your booking has been confirmed.</p>
                <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <h2 style="margin-top: 0; color: #333;">Booking Details</h2>
                  <p><strong>Service:</strong> ${rentalTitle}</p>
                  <p><strong>Check-in:</strong> ${booking.start_date}</p>
                  <p><strong>Check-out:</strong> ${booking.end_date}</p>
                  <p><strong>Amount Paid:</strong> ${flutterwaveData.data.currency} ${flutterwaveData.data.amount}</p>
                </div>
                <p>We look forward to serving you!</p>
                <p style="color: #666; font-size: 14px;">- The Top Reasons Team</p>
              </div>
            `
          });
        } catch (emailError) {
          console.error('Failed to send confirmation email:', emailError);
          // We don't fail the transaction if the email fails
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
