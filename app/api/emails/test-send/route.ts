import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import {
  sendEmail,
  generateVerificationEmailHtml,
  generatePaymentReceiptEmailHtml,
  EMAIL_CONFIG,
} from "@/lib/email";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(req: Request) {
  try {
    // This endpoint sends real emails via the site's own domain, so it must
    // only be reachable by a signed-in admin — otherwise it's an open relay
    // anyone on the internet can use to spam arbitrary addresses.
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Missing authorization header" }, { status: 401 });
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: isAdmin } = await supabase.rpc("has_role", {
      _user_id: user.id,
      _role: "admin",
    });
    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const body = await req.json();
    const { to, template = "verification", fullName = "VIP Guest" } = body;

    if (!to || typeof to !== "string") {
      return NextResponse.json({ error: "Missing or invalid recipient email" }, { status: 400 });
    }

    let subject = "Confirm Your Top Reasons Account";
    let html = "";

    if (template === "verification") {
      const dummyConfirmationUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "https://topreasonsco.com"}/auth/confirm?token_hash=test_token_preview&type=signup`;
      subject = "Confirm Your Top Reasons Account";
      html = generateVerificationEmailHtml({
        confirmationUrl: dummyConfirmationUrl,
        token: "849201",
        fullName,
      });
    } else if (template === "payment") {
      subject = "Payment Receipt & Confirmation - Mercedes-Benz S-Class";
      html = generatePaymentReceiptEmailHtml({
        customerName: fullName,
        rentalTitle: "Mercedes-Benz S-Class (2024)",
        rentalType: "Executive Sedan",
        startDate: "Oct 15, 2026",
        endDate: "Oct 18, 2026",
        driveOption: "chauffeur",
        currency: "GHS",
        amount: 3200,
        transactionId: "FLW-TEST-94829104",
        bookingId: "b84e18d2-4e12-46a2-9218-19e918491c10",
        paymentMethod: "Mobile Money (MTN)",
      });
    } else {
      return NextResponse.json({ error: "Unknown template" }, { status: 400 });
    }

    const result = await sendEmail({
      to,
      subject,
      html,
      from: EMAIL_CONFIG.from,
      replyTo: EMAIL_CONFIG.replyTo,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to send email via Resend" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Test email sent to ${to} from ${EMAIL_CONFIG.from}`,
      data: result.data,
    });
  } catch (error: any) {
    console.error("Test send error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
