import { NextResponse } from 'next/server';
import { validateDriverApplication, VEHICLE_TYPES } from '@/lib/driver-application';
import { generateDriverApplicationEmailHtml, EMAIL_CONFIG, sendEmail } from '@/lib/email';
import { createRateLimiter } from '@/lib/rate-limit';

// An honest applicant sends one. 3 per IP per hour leaves room for typos and retries.
const perIp = createRateLimiter(3, 60 * 60_000);

// Emails a driver application to the ops desk. Open to anyone (no account needed), but the
// recipient is always the fixed support address, the applicant's address is only set as
// "reply-to", and every field is validated, length-limited and escaped.
export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';
    if (!perIp(ip)) {
      return NextResponse.json(
        { error: 'You have submitted several applications recently. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => null);

    // Hidden field real people never fill in. Bots do, so pretend it worked and drop it.
    if (body && typeof body.website === 'string' && body.website.trim() !== '') {
      return NextResponse.json({ success: true });
    }

    const result = validateDriverApplication(body);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    const application = result.value;

    const sent = await sendEmail({
      from: EMAIL_CONFIG.from,
      replyTo: application.email,
      to: EMAIL_CONFIG.supportEmail,
      subject: `[Driver application] ${application.firstName} ${application.lastName} - ${VEHICLE_TYPES[application.vehicleType]}`,
      html: generateDriverApplicationEmailHtml({
        ...application,
        vehicleType: VEHICLE_TYPES[application.vehicleType],
      }),
    });

    if (!sent.success) {
      console.error('Driver application email failed:', sent.error);
      return NextResponse.json(
        { error: `We couldn't submit your application right now. Please email us directly at ${EMAIL_CONFIG.supportEmail}.` },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Driver application error:', error);
    return NextResponse.json(
      { error: `Something went wrong. Please email us directly at ${EMAIL_CONFIG.supportEmail}.` },
      { status: 500 }
    );
  }
}
