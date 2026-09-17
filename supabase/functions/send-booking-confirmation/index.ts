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
      to: [email],
      subject: "Booking Confirmation - " + sanitizedTitle,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%); padding: 30px; border-radius: 12px; margin-bottom: 20px;">
            <h1 style="color: #d4af37; margin: 0;">Top Reasons</h1>
          </div>
          <h2 style="color: #333;">Booking Received!</h2>
          <p>Thank you for your booking with Top Reasons. We're processing your payment and will confirm shortly.</p>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #333;">Booking Details</h3>
            <p><strong>Rental:</strong> ${sanitizedTitle}</p>
            <p><strong>Check-in:</strong> ${sanitizedStartDate}</p>
            <p><strong>Check-out:</strong> ${sanitizedEndDate}</p>
            ${sanitizedDriveOption ? `<p><strong>Drive Option:</strong> ${sanitizedDriveOption}</p>` : ''}
            <p><strong>Total:</strong> GHS ${totalPrice.toFixed(2)}</p>
          </div>
          <p>We look forward to serving you!</p>
          <p style="color: #666; font-size: 14px;">- The Top Reasons Team</p>
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
