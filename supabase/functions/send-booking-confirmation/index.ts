import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Rate limiting configuration
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 5; // 5 requests per minute per client

// In-memory rate limit store (resets on function cold start)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Bookings can be made by guests (no session), so we rate-limit by client IP
// rather than requiring an authenticated user.
const checkRateLimit = (clientKey: string): { allowed: boolean; retryAfter?: number } => {
  const now = Date.now();
  const clientLimit = rateLimitStore.get(clientKey);

  // Clean up expired entries
  if (clientLimit && now > clientLimit.resetTime) {
    rateLimitStore.delete(clientKey);
  }

  const currentLimit = rateLimitStore.get(clientKey);

  if (!currentLimit) {
    rateLimitStore.set(clientKey, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true };
  }

  if (currentLimit.count >= MAX_REQUESTS_PER_WINDOW) {
    const retryAfter = Math.ceil((currentLimit.resetTime - now) / 1000);
    return { allowed: false, retryAfter };
  }

  currentLimit.count++;
  return { allowed: true };
};

// Simple validation functions
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return typeof email === 'string' && emailRegex.test(email) && email.length <= 255;
};

const sanitizeString = (str: string, maxLength: number = 200): string => {
  if (typeof str !== 'string') return '';
  return str
    .replace(/[<>]/g, '') // Remove angle brackets to prevent HTML injection
    .trim()
    .slice(0, maxLength);
};

const isValidDate = (date: string): boolean => {
  return typeof date === 'string' && !isNaN(Date.parse(date));
};

const isValidNumber = (num: unknown): num is number => {
  return typeof num === 'number' && !isNaN(num) && num >= 0;
};

interface BookingEmailRequest {
  email: string;
  rentalTitle: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  driveOption?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Rate-limit by client IP (bookings can come from guests with no session)
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';
    const { allowed, retryAfter } = checkRateLimit(clientIp);
    if (!allowed) {
      return new Response(
        JSON.stringify({ error: "Too many requests. Please try again later." }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": String(retryAfter),
            ...corsHeaders
          }
        }
      );
    }

    const body = await req.json();
    const { email, rentalTitle, startDate, endDate, totalPrice, driveOption }: BookingEmailRequest = body;

    // Validate inputs
    if (!isValidEmail(email)) {
      return new Response(
        JSON.stringify({ error: "Invalid email address" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (!rentalTitle || typeof rentalTitle !== 'string') {
      return new Response(
        JSON.stringify({ error: "Invalid rental title" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (!isValidDate(startDate) || !isValidDate(endDate)) {
      return new Response(
        JSON.stringify({ error: "Invalid date format" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (!isValidNumber(totalPrice)) {
      return new Response(
        JSON.stringify({ error: "Invalid total price" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Sanitize inputs for email content
    const sanitizedTitle = sanitizeString(rentalTitle, 200);
    const sanitizedStartDate = sanitizeString(startDate, 50);
    const sanitizedEndDate = sanitizeString(endDate, 50);
    const sanitizedDriveOption = driveOption ? sanitizeString(driveOption, 50) : '';

    const emailResponse = await resend.emails.send({
      from: "Top Reasons <enquiries@topreasonsco.com>",
      reply_to: "enquiries@topreasonsco.com",
      to: [email],
      subject: "Booking Received - " + sanitizedTitle,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0b0f17; color: #e2e8f0; border-radius: 12px; overflow: hidden; border: 1px solid #1f293d;">
          <div style="height: 4px; background: linear-gradient(90deg, #996515 0%, #d4af37 50%, #f6e27a 100%);"></div>
          <div style="padding: 28px 32px 20px 32px; text-align: center; border-bottom: 1px solid #161d2b;">
            <a href="https://topreasonsco.com" target="_blank" style="text-decoration: none; display: inline-block;">
              <img src="https://topreasonsco.com/assets/logo.png" alt="Top Reasons" width="150" style="display: block; margin: 0 auto 6px auto;" />
            </a>
            <span style="font-size: 10px; font-weight: 700; letter-spacing: 2px; color: #d4af37; text-transform: uppercase;">
              Premier Fleet &bull; Ghana
            </span>
          </div>
          <div style="padding: 32px;">
            <div style="text-align: center; margin-bottom: 24px;">
              <span style="font-size: 28px; line-height: 1;">🎉</span>
              <h1 style="color: #ffffff; font-size: 22px; font-weight: 700; margin: 12px 0 6px 0;">Booking Received!</h1>
              <p style="color: #94a3b8; font-size: 14px; margin: 0;">Thank you for booking with Top Reasons. We are reviewing your reservation.</p>
            </div>
            <div style="background-color: #111722; padding: 20px; border-radius: 8px; border: 1px solid #1f2a3e; margin: 24px 0;">
              <h2 style="margin-top: 0; color: #d4af37; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Reservation Details</h2>
              <table style="width: 100%; font-size: 13px; color: #cbd5e1; border-collapse: collapse;">
                <tr><td style="padding: 6px 0; color: #94a3b8;">Vehicle / Service:</td><td style="padding: 6px 0; text-align: right; font-weight: 600; color: #ffffff;">${sanitizedTitle}</td></tr>
                <tr><td style="padding: 6px 0; color: #94a3b8;">Check-in:</td><td style="padding: 6px 0; text-align: right;">${sanitizedStartDate}</td></tr>
                <tr><td style="padding: 6px 0; color: #94a3b8;">Check-out:</td><td style="padding: 6px 0; text-align: right;">${sanitizedEndDate}</td></tr>
                ${sanitizedDriveOption ? `<tr><td style="padding: 6px 0; color: #94a3b8;">Drive Option:</td><td style="padding: 6px 0; text-align: right;">${sanitizedDriveOption}</td></tr>` : ''}
                <tr><td style="padding: 6px 0; color: #94a3b8;">Total:</td><td style="padding: 6px 0; text-align: right; font-weight: 700; color: #d4af37;">GHS ${totalPrice.toFixed(2)}</td></tr>
              </table>
            </div>
            <p style="font-size: 13px; color: #94a3b8; line-height: 20px;">
              Our concierge team is at your disposal. If you have questions or special requirements, email us at <a href="mailto:enquiries@topreasonsco.com" style="color: #d4af37; text-decoration: none;">enquiries@topreasonsco.com</a>.
            </p>
          </div>
          <div style="padding: 20px; background-color: #070a10; text-align: center; border-top: 1px solid #141b27; font-size: 11px; color: #64748b;">
            Top Reasons Car Rentals &bull; Accra, Ghana &bull; enquiries@topreasonsco.com
          </div>
        </div>
      `,
    });

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("send-booking-confirmation error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
