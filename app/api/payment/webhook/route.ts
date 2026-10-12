import { NextResponse } from 'next/server';
import { timingSafeEqual } from 'crypto';
import {
  fetchVerifiedTransaction,
  getBookingForPayment,
  checkTransactionMatchesBooking,
  confirmBookingPayment,
} from '@/lib/payments';

const safeEqual = (a: string, b: string) => {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
};

export async function POST(req: Request) {
  try {
    const secretHash = process.env.FLUTTERWAVE_SECRET_HASH;

    // Fail closed: without a configured secret there is no way to tell a real
    // Flutterwave call from a forged one, so refuse the request.
    if (!secretHash) {
      console.error('Webhook rejected: FLUTTERWAVE_SECRET_HASH is not configured.');
      return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 });
    }

    const signature = req.headers.get('verif-hash') ?? '';
    if (!safeEqual(signature, secretHash)) {
      console.warn('Webhook verification failed: invalid verif-hash signature.');
      return NextResponse.json({ error: 'Unauthorized webhook call' }, { status: 401 });
    }

    const payload = await req.json();
    const { event, data } = payload;

    if (event !== 'charge.completed' || data?.status !== 'successful' || !data?.id) {
      return NextResponse.json({ received: true });
    }

    // Never trust amounts or references in the webhook body: re-verify with Flutterwave.
    const tx = await fetchVerifiedTransaction(data.id);
    if (!tx) {
      console.warn('Webhook ignored: transaction could not be verified', { id: data.id });
      return NextResponse.json({ received: true });
    }

    // Reference format is booking-<booking uuid>-<timestamp>
    const match = tx.txRef.match(/^booking-([0-9a-f-]{36})-\d+$/i);
    if (!match) {
      console.warn('Webhook ignored: unrecognised payment reference', { txRef: tx.txRef });
      return NextResponse.json({ received: true });
    }

    const booking = await getBookingForPayment(match[1]);
    if (!booking) {
      console.warn('Webhook ignored: booking not found', { bookingId: match[1] });
      return NextResponse.json({ received: true });
    }

    const check = checkTransactionMatchesBooking(booking, tx);
    if (!check.ok) {
      console.warn('Webhook ignored:', check.reason, { bookingId: booking.id, txRef: tx.txRef });
      return NextResponse.json({ received: true });
    }

    await confirmBookingPayment(booking, tx);
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Flutterwave webhook processing error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
