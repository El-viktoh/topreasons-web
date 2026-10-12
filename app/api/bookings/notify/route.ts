import { NextResponse } from 'next/server';
import {
  UUID_REGEX,
  getBookingForPayment,
  expectedBookingAmount,
  resolveCustomerContact,
  isEligibleForBookingNotice,
} from '@/lib/payments';
import { generateBookingReceivedEmailHtml, EMAIL_CONFIG, sendEmail } from '@/lib/email';
import { createRateLimiter } from '@/lib/rate-limit';

const perIp = createRateLimiter(10, 60_000);
const perBooking = createRateLimiter(1, 60_000);

// Sends the "Booking Received" email for a freshly created booking.
// The caller only supplies a booking id. The recipient, vehicle, dates and price are all read
// from the database, so this endpoint can't be used to email an arbitrary address or text.
export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';
    if (!perIp(ip)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const body = await req.json().catch(() => null);
    const bookingId = body?.booking_id;
    if (typeof bookingId !== 'string' || !UUID_REGEX.test(bookingId)) {
      return NextResponse.json({ error: 'Invalid booking id' }, { status: 400 });
    }

    // Same answer whether or not an email went out, so this can't be used to find out
    // which booking ids exist.
    const quiet = NextResponse.json({ success: true });

    if (!perBooking(bookingId)) return quiet;

    const booking = await getBookingForPayment(bookingId);
    if (!booking || !isEligibleForBookingNotice(booking)) return quiet;

    const contact = await resolveCustomerContact(booking);
    if (!contact.email) return quiet;

    const rentalTitle = booking.rental?.title || 'Your rental';
    const html = generateBookingReceivedEmailHtml({
      customerName: contact.name,
      rentalTitle,
      startDate: booking.start_date,
      endDate: booking.end_date,
      driveOption: booking.drive_option || undefined,
      currency: 'GHS',
      amount: expectedBookingAmount(booking),
      bookingId: booking.id,
    });

    const result = await sendEmail({
      from: EMAIL_CONFIG.from,
      replyTo: EMAIL_CONFIG.replyTo,
      to: contact.email,
      subject: `Booking Received - ${rentalTitle}`,
      html,
    });
    if (!result.success) console.error('Booking received email failed for', booking.id, result.error);

    return quiet;
  } catch (error) {
    console.error('Booking notify error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
