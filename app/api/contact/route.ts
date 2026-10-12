import { NextResponse } from 'next/server';
import { validateContactMessage } from '@/lib/contact';
import { generateContactNotificationEmailHtml, EMAIL_CONFIG, sendEmail } from '@/lib/email';
import { createRateLimiter } from '@/lib/rate-limit';

// 5 messages per IP every 10 minutes is plenty for a real person.
const perIp = createRateLimiter(5, 10 * 60_000);

// Emails the website contact form to the ops desk. The recipient is always the fixed support
// address, so this can't be used to email anyone else. The visitor's address is only set as
// "reply-to" so staff can answer with one click.
export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';
    if (!perIp(ip)) {
      return NextResponse.json(
        { error: 'You have sent several messages recently. Please try again in a few minutes.' },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => null);

    // Hidden field real people never fill in. Bots do, so pretend it worked and drop it.
    if (body && typeof body.website === 'string' && body.website.trim() !== '') {
      return NextResponse.json({ success: true });
    }

    const result = validateContactMessage(body);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    const { name, email, subject, message } = result.value;

    const sent = await sendEmail({
      from: EMAIL_CONFIG.from,
      replyTo: email,
      to: EMAIL_CONFIG.supportEmail,
      subject: `[Website contact] ${subject}`,
      html: generateContactNotificationEmailHtml({ name, email, subject, message }),
    });

    if (!sent.success) {
      console.error('Contact form email failed:', sent.error);
      return NextResponse.json(
        { error: `We couldn't send your message right now. Please email us directly at ${EMAIL_CONFIG.supportEmail}.` },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: `Something went wrong. Please email us directly at ${EMAIL_CONFIG.supportEmail}.` },
      { status: 500 }
    );
  }
}
