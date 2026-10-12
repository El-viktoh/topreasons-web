import { NextResponse } from 'next/server';
import {
  UUID_REGEX,
  fetchVerifiedTransaction,
  getBookingForPayment,
  checkTransactionMatchesBooking,
  confirmBookingPayment,
} from '@/lib/payments';

export async function POST(req: Request) {
  try {
    const { transaction_id, booking_id } = await req.json();

    if (!transaction_id || !booking_id) {
      return NextResponse.json(
        { error: 'Transaction ID and Booking ID are required' },
        { status: 400 }
      );
    }

    if (!/^\d+$/.test(String(transaction_id)) || !UUID_REGEX.test(String(booking_id))) {
      return NextResponse.json({ error: 'Invalid transaction or booking id' }, { status: 400 });
    }

    // Ask Flutterwave directly; amounts and references below come from its answer only.
    const tx = await fetchVerifiedTransaction(transaction_id);
    if (!tx) {
      return NextResponse.json(
        { error: 'Payment verification failed or transaction not successful' },
        { status: 400 }
      );
    }

    const booking = await getBookingForPayment(String(booking_id));
    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    const check = checkTransactionMatchesBooking(booking, tx);
    if (!check.ok) {
      console.warn('Payment verify rejected:', check.reason, { booking_id, txRef: tx.txRef });
      return NextResponse.json({ error: 'Payment does not match this booking' }, { status: 400 });
    }

    const { confirmed } = await confirmBookingPayment(booking, tx);

    return NextResponse.json({
      success: true,
      message: confirmed ? 'Payment verified and booking updated.' : 'Booking already confirmed.',
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
