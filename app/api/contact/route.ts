import { NextResponse } from 'next/server';
import { validateContactMessage } from '@/lib/contact';
import { generateContactNotificationEmailHtml, EMAIL_CONFIG, sendEmail } from '@/lib/email';
import { createRateLimiter } from '@/lib/rate-limit';

// Typos and validation errors must never block a real visitor, so only messages that pass
// validation count toward the "sent" limits. Many mobile users share one IP address, so the
// per-IP limits are generous; the real brake on repeats is per sender email.
const attemptsPerIp = createRateLimiter(60, 60 * 60_000);
const messagesPerIp = createRateLimiter(15, 60 * 60_000);
const messagesPerEmail = createRateLimiter(5, 24 * 60 * 60_000);

// Emails the website contact form to the ops desk. The recipient is always the fixed support
// address, so this can't be used to email anyone else. The visitor's address is only set as
// "reply-to" so staff can answer with one click.
export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';
    if (!attemptsPerIp(ip)) {
      return NextResponse.json(
        { error: 'Too many requests from your connection. Please try again in a little while.' },
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

    if (!messagesPerEmail(email) || !messagesPerIp(ip)) {
      return NextResponse.json(
        { error: `You have sent several messages recently. Please wait a while, or email us directly at ${EMAIL_CONFIG.supportEmail}.` },
        { status: 429 }
      );
    }

    const sent = await sendEmail({
      from: EMAIL_CONFIG.from,
      replyTo: email,
      to: EMAIL_CONFIG.supportEmail,
      subject: `[Website contact] ${subject}`,
      html: generateContactNotificationEmailHtml({ name, email, subject, message }),
    });

    if (!sent.success) {
      // Our side failed, so don't count this against the visitor's allowance
      messagesPerEmail.refund(email);
      messagesPerIp.refund(ip);
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
