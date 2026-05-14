import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Rate limiting configuration (stricter for admin actions)
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 10; // 10 requests per minute per admin

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

// Validation functions
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return typeof email === 'string' && emailRegex.test(email) && email.length <= 255;
};

const sanitizeHtml = (str: string, maxLength: number = 200): string => {
  if (typeof str !== 'string') return '';
  // Escape HTML entities to prevent HTML injection
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim()
    .slice(0, maxLength);
};

const isValidStatus = (status: string): status is "approved" | "rejected" => {
  return status === "approved" || status === "rejected";
};

interface NotificationRequest {
  email: string;
  companyName: string;
  status: "approved" | "rejected";
  rejectionReason?: string;
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

    // Verify user is admin
    const { data: isAdmin } = await supabase.rpc('has_role', { 
      _user_id: user.id, 
      _role: 'admin' 
    });

    if (!isAdmin) {
      return new Response(
        JSON.stringify({ error: "Forbidden: Admin access required" }),
        { status: 403, headers: { "Content-Type": "application/json", ...corsHeaders } }
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
    const { email, companyName, status, rejectionReason } = body;

    // Validate inputs
    if (!isValidEmail(email)) {
      return new Response(
        JSON.stringify({ error: "Invalid email address" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (!companyName || typeof companyName !== 'string' || companyName.length > 200) {
      return new Response(
        JSON.stringify({ error: "Invalid company name" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (!isValidStatus(status)) {
      return new Response(
        JSON.stringify({ error: "Invalid status. Must be 'approved' or 'rejected'" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (rejectionReason && (typeof rejectionReason !== 'string' || rejectionReason.length > 500)) {
      return new Response(
        JSON.stringify({ error: "Invalid rejection reason" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Sanitize inputs for email content
    const sanitizedCompanyName = sanitizeHtml(companyName, 200);
    const sanitizedRejectionReason = rejectionReason ? sanitizeHtml(rejectionReason, 500) : '';

    const isApproved = status === "approved";

    const subject = isApproved
      ? `Congratulations! Your rental agent application has been approved`
      : `Update on your rental agent application`;

    const html = isApproved
      ? `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%); padding: 30px; border-radius: 12px; margin-bottom: 20px;">
            <h1 style="color: #d4af37; margin: 0;">Top Reasons</h1>
          </div>
          
          <h2 style="color: #333;">Application Approved!</h2>
          
          <p>Dear <strong>${sanitizedCompanyName}</strong>,</p>
          
          <p>Great news! Your rental agent application has been <strong style="color: #22c55e;">approved</strong>.</p>
          
          <p>You can now:</p>
          <ul>
            <li>Add your cars and apartments to our platform</li>
            <li>Manage your listings from your dashboard</li>
            <li>Start receiving bookings from customers</li>
          </ul>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Next Steps:</strong></p>
            <ol style="margin: 10px 0 0 0; padding-left: 20px;">
              <li>Log in to your account</li>
              <li>Go to your Renter Dashboard</li>
              <li>Click "Add Listing" to add your first rental</li>
            </ol>
          </div>
          
          <p>Thank you for joining Top Reasons!</p>
          
          <p style="color: #666; font-size: 14px;">Best regards,<br>The Top Reasons Team</p>
        </div>
      `
      : `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%); padding: 30px; border-radius: 12px; margin-bottom: 20px;">
            <h1 style="color: #d4af37; margin: 0;">Top Reasons</h1>
          </div>
          
          <h2 style="color: #333;">Application Update</h2>
          
          <p>Dear <strong>${sanitizedCompanyName}</strong>,</p>
          
          <p>Thank you for your interest in becoming a rental agent on Top Reasons.</p>
          
          <p>After reviewing your application, we regret to inform you that it has not been approved at this time.</p>
          
          ${sanitizedRejectionReason ? `
            <div style="background: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0;">
              <p style="margin: 0; color: #991b1b;"><strong>Reason:</strong></p>
              <p style="margin: 5px 0 0 0; color: #7f1d1d;">${sanitizedRejectionReason}</p>
            </div>
          ` : ''}
          
          <p>If you believe this was a mistake or would like to provide additional information, please contact our support team.</p>
          
          <p style="color: #666; font-size: 14px;">Best regards,<br>The Top Reasons Team</p>
        </div>
      `;

    const emailResponse = await resend.emails.send({
      from: "Top Reasons <onboarding@resend.dev>",
      to: [email],
      subject,
      html,
    });

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
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
