import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Rate limiting configuration
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 5; // 5 requests per minute per user

// In-memory rate limit store (resets on function cold start)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

const checkRateLimit = (userId: string): { allowed: boolean; retryAfter?: number } => {
  const now = Date.now();
  const userLimit = rateLimitStore.get(userId);

  // Clean up expired entries
  if (userLimit && now > userLimit.resetTime) {
    rateLimitStore.delete(userId);
  }

  const currentLimit = rateLimitStore.get(userId);

  if (!currentLimit) {
    rateLimitStore.set(userId, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
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
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Check rate limit
    const { allowed, retryAfter } = checkRateLimit(user.id);
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
    const { email, rentalTitle, startDate, endDate, totalPrice }: BookingEmailRequest = body;

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

    // TODO: When Resend API key is added, uncomment this:
    // const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    // if (!RESEND_API_KEY) {
    //   throw new Error("RESEND_API_KEY not configured");
    // }

    // const res = await fetch("https://api.resend.com/emails", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${RESEND_API_KEY}`,
    //   },
    //   body: JSON.stringify({
    //     from: "Top Reasons <onboarding@resend.dev>",
    //     to: [email],
    //     subject: "Booking Confirmation - " + sanitizedTitle,
    //     html: `
    //       <h1>Booking Confirmed!</h1>
    //       <p>Thank you for your booking with Top Reasons.</p>
    //       <h2>Booking Details:</h2>
    //       <ul>
    //         <li><strong>Rental:</strong> ${sanitizedTitle}</li>
    //         <li><strong>Check-in:</strong> ${sanitizedStartDate}</li>
    //         <li><strong>Check-out:</strong> ${sanitizedEndDate}</li>
    //         <li><strong>Total:</strong> $${totalPrice.toFixed(2)}</li>
    //       </ul>
    //       <p>We look forward to serving you!</p>
    //     `,
    //   }),
    // });

    // const data = await res.json();

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Email functionality ready. Add RESEND_API_KEY secret to enable." 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
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
