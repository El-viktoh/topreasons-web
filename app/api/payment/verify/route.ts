import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

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
