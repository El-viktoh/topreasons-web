"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Smartphone,
  Monitor,
  Copy,
  Check,
  Send,
  Loader2,
  ShieldCheck,
  ArrowLeft,
  Mail,
  CreditCard,
  Key,
  Settings,
} from "lucide-react";
import { toast } from "sonner";
import { generateVerificationEmailHtml, generatePaymentReceiptEmailHtml } from "@/lib/email";
import { supabase } from "@/lib/supabase/client";

// Raw Go template for Supabase Auth Confirm Signup
const SUPABASE_RAW_TEMPLATE = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="x-apple-disable-message-reformatting" />
  <meta name="color-scheme" content="dark light" />
  <title>Confirm Your Top Reasons Account</title>
  <style type="text/css">
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
    body { margin: 0; padding: 0; width: 100% !important; background-color: #06080d; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
    .btn-gold:hover { background-color: #e5c05d !important; box-shadow: 0 4px 20px rgba(212, 175, 55, 0.45) !important; }
    @media only screen and (max-width: 620px) {
      .email-container { width: 100% !important; max-width: 100% !important; }
      .content-padding { padding: 28px 20px !important; }
      .header-padding { padding: 24px 20px 20px 20px !important; }
      .headline { font-size: 24px !important; line-height: 32px !important; }
      .cta-button { width: 100% !important; box-sizing: border-box !important; text-align: center !important; }
      .perk-col { display: block !important; width: 100% !important; margin-bottom: 12px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #06080d; color: #e2e8f0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <div style="display: none; font-size: 1px; color: #06080d; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
    Welcome to Top Reasons. Confirm your email address to activate your account and start your luxury travel experience.
    &#847; &zwnj; &nbsp; &#8199; &shy; &#847; &zwnj; &nbsp; &#8199; &shy;
  </div>

  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #06080d; min-height: 100vh;">
    <tr>
      <td align="center" style="padding: 40px 16px;">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" class="email-container" style="max-width: 580px; background-color: #0f141f; border-radius: 14px; overflow: hidden; border: 1px solid #232d3f; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6);">
          <tr>
            <td height="4" style="background: linear-gradient(90deg, #996515 0%, #d4af37 50%, #f6e27a 100%); line-height: 4px; font-size: 4px;">&nbsp;</td>
          </tr>

          <tr>
            <td align="center" class="header-padding" style="padding: 36px 36px 24px 36px; border-bottom: 1px solid #1a2232; background-color: #0b0f17;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="{{ .SiteURL }}" target="_blank" style="text-decoration: none; display: inline-block;">
                      <img src="https://topreasonsco.com/assets/logo.png" alt="Top Reasons" width="160" height="auto" style="display: block; max-width: 160px; height: auto; margin-bottom: 8px;" />
                    </a>
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <span style="display: inline-block; font-size: 10px; font-weight: 700; letter-spacing: 3px; color: #d4af37; text-transform: uppercase; background-color: rgba(212, 175, 55, 0.12); padding: 4px 12px; border-radius: 999px; border: 1px solid rgba(212, 175, 55, 0.25);">
                      Premier Fleet &bull; Ghana
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td class="content-padding" style="padding: 36px 40px 32px 40px;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center" style="padding-bottom: 20px;">
                    <div style="width: 56px; height: 56px; border-radius: 50%; background: radial-gradient(circle, rgba(212, 175, 55, 0.2) 0%, rgba(212, 175, 55, 0.05) 100%); border: 1px solid rgba(212, 175, 55, 0.35); text-align: center; line-height: 56px; display: inline-block;">
                      <span style="font-size: 26px; line-height: 56px;">✉️</span>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td align="center" style="padding-bottom: 12px;">
                    <h1 class="headline" style="margin: 0; font-size: 26px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px; line-height: 34px;">
                      Confirm Your Email Address
                    </h1>
                  </td>
                </tr>

                <tr>
                  <td style="padding-bottom: 28px; text-align: center;">
                    <p style="margin: 0 0 14px 0; font-size: 15px; line-height: 24px; color: #cbd5e1;">
                      Thank you for creating an account with <strong>Top Reasons</strong>.
                    </p>
                    <p style="margin: 0; font-size: 14px; line-height: 22px; color: #94a3b8;">
                      To ensure the security of your account and activate access to our luxury fleet, chauffeur bookings, and tailored services, please verify your email address.
                    </p>
                  </td>
                </tr>

                <tr>
                  <td align="center" style="padding-bottom: 28px;">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center" style="border-radius: 8px; background: linear-gradient(135deg, #d4af37 0%, #e6c86e 100%);">
                          <a href="{{ .ConfirmationURL }}" target="_blank" class="btn-gold cta-button" style="font-size: 15px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-weight: 700; color: #0b0f17; text-decoration: none; padding: 15px 36px; border-radius: 8px; display: inline-block; letter-spacing: 0.5px; text-transform: uppercase;">
                            Verify Email Address &rarr;
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                {{ if .Token }}
                <tr>
                  <td align="center" style="padding-bottom: 28px;">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #0b0f17; border-radius: 10px; border: 1px solid #1f293d; padding: 18px;">
                      <tr>
                        <td align="center">
                          <p style="margin: 0 0 8px 0; font-size: 12px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px;">
                            Or enter this 6-digit verification code:
                          </p>
                          <div style="font-size: 30px; font-weight: 800; letter-spacing: 6px; color: #d4af37; font-family: 'Courier New', Courier, monospace; padding: 8px 16px; display: inline-block;">
                            {{ .Token }}
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                {{ end }}

                <tr>
                  <td style="padding: 18px 20px; background-color: rgba(212, 175, 55, 0.05); border-left: 3px solid #d4af37; border-radius: 0 8px 8px 0; margin-bottom: 24px;">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td style="font-size: 13px; line-height: 20px; color: #cbd5e1;">
                          <strong style="color: #d4af37;">Important:</strong> This verification link is valid for <strong>24 hours</strong>. If you did not sign up for a Top Reasons account, you can safely ignore this email.
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td style="padding-top: 24px; padding-bottom: 8px;">
                    <p style="margin: 0 0 8px 0; font-size: 12px; color: #64748b; line-height: 18px;">
                      Having trouble with the button above? Copy and paste this URL into your web browser:
                    </p>
                    <div style="background-color: #090d14; border: 1px solid #1a2232; border-radius: 6px; padding: 10px 14px; word-break: break-all;">
                      <a href="{{ .ConfirmationURL }}" target="_blank" style="font-size: 11px; color: #94a3b8; text-decoration: none; font-family: 'Courier New', Courier, monospace; line-height: 16px;">
                        {{ .ConfirmationURL }}
                      </a>
                    </div>
                  </td>
                </tr>

              </table>
            </td>
          </tr>

          <tr>
            <td style="padding: 0 36px;">
              <div style="height: 1px; background-color: #1a2232;"></div>
            </td>
          </tr>

          <tr>
            <td style="padding: 24px 36px; background-color: #0a0e16;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td class="perk-col" width="33%" align="center" style="padding: 8px;">
                    <div style="font-size: 18px; margin-bottom: 4px;">🚗</div>
                    <div style="font-size: 11px; font-weight: 600; color: #cbd5e1; text-transform: uppercase; letter-spacing: 0.5px;">Luxury Fleet</div>
                    <div style="font-size: 10px; color: #64748b; margin-top: 2px;">SUVs &bull; Sedans &bull; Vans</div>
                  </td>
                  <td class="perk-col" width="33%" align="center" style="padding: 8px;">
                    <div style="font-size: 18px; margin-bottom: 4px;">🛡️</div>
                    <div style="font-size: 11px; font-weight: 600; color: #cbd5e1; text-transform: uppercase; letter-spacing: 0.5px;">Chauffeur &amp; Self</div>
                    <div style="font-size: 10px; color: #64748b; margin-top: 2px;">Vetted Drivers</div>
                  </td>
                  <td class="perk-col" width="33%" align="center" style="padding: 8px;">
                    <div style="font-size: 18px; margin-bottom: 4px;">✈️</div>
                    <div style="font-size: 11px; font-weight: 600; color: #cbd5e1; text-transform: uppercase; letter-spacing: 0.5px;">Airport Transfer</div>
                    <div style="font-size: 10px; color: #64748b; margin-top: 2px;">Kotoka International</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding: 28px 36px; background-color: #070a10; border-top: 1px solid #161d2b;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center" style="padding-bottom: 12px;">
                    <p style="margin: 0; font-size: 12px; color: #94a3b8; line-height: 18px;">
                      Questions or assistance? Contact our concierge desk at
                      <br />
                      <a href="mailto:enquiries@topreasonsco.com" style="color: #d4af37; text-decoration: none; font-weight: 600;">
                        enquiries@topreasonsco.com
                      </a>
                      &bull;
                      <a href="tel:+233559297448" style="color: #cbd5e1; text-decoration: none;">
                        +233 55 929 7448
                      </a>
                    </p>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-bottom: 14px;">
                    <p style="margin: 0; font-size: 11px; color: #64748b; line-height: 16px;">
                      Top Reasons Car Rentals &bull; Accra, Greater Accra Region, Ghana
                    </p>
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <p style="margin: 0; font-size: 10px; color: #475569;">
                      &copy; 2026 Top Reasons. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

export default function EmailPreviewPage() {
  const [activeTemplate, setActiveTemplate] = useState<"verification" | "payment">("payment");
  const [deviceView, setDeviceView] = useState<"desktop" | "mobile">("desktop");
  const [copied, setCopied] = useState(false);
  const [testEmail, setTestEmail] = useState("");
  const [isSending, setIsSending] = useState(false);

  // Generate payment receipt HTML with realistic dummy data
  const paymentReceiptHtml = generatePaymentReceiptEmailHtml({
    customerName: "Kofi Mensah",
    rentalTitle: "Mercedes-Benz S-Class (2024)",
    rentalType: "Executive Sedan",
    startDate: "Oct 15, 2026",
    endDate: "Oct 18, 2026",
    driveOption: "chauffeur",
    currency: "GHS",
    amount: 3200,
    transactionId: "FLW-TXN-8492019",
    bookingId: "b84e18d2-4e12-46a2-9218-19e918491c10",
    paymentMethod: "Mobile Money (MTN MoMo)",
    paymentDate: "Today",
  });

  // Simulated verification preview replacing Go template placeholders
  const verificationPreviewHtml = SUPABASE_RAW_TEMPLATE
    .replace(/\{\{\s*\.ConfirmationURL\s*\}\}/g, "https://topreasonsco.com/auth/confirm?token_hash=sample_preview_hash&type=signup")
    .replace(/\{\{\s*\.SiteURL\s*\}\}/g, "https://topreasonsco.com")
    .replace(/\{\{\s*if\s*\.Token\s*\}\}/g, "")
    .replace(/\{\{\s*end\s*\}\}/g, "")
    .replace(/\{\{\s*\.Token\s*\}\}/g, "739214");

  const currentPreviewHtml = activeTemplate === "payment" ? paymentReceiptHtml : verificationPreviewHtml;

  const handleCopy = () => {
    const content = activeTemplate === "payment" ? paymentReceiptHtml : SUPABASE_RAW_TEMPLATE;
    navigator.clipboard.writeText(content);
    setCopied(true);
    toast.success("HTML template copied to clipboard!");
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSendTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testEmail) {
      toast.error("Please enter an email address to send the test");
      return;
    }
    setIsSending(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("You must be signed in as an admin to send test emails");
        setIsSending(false);
        return;
      }

      const res = await fetch("/api/emails/test-send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          to: testEmail,
          template: activeTemplate,
          fullName: activeTemplate === "payment" ? "Kofi Mensah" : "VIP Client",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send test email");

      toast.success(`Test email sent to ${testEmail} from enquiries@topreasonsco.com!`);
      setTestEmail("");
    } catch (err: any) {
      toast.error(err.message || "Failed to send test email");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Top Header Bar */}
      <header className="border-b border-border bg-card/70 backdrop-blur sticky top-0 z-30 px-4 py-3">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="sm">
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-1.5" />
                Back to Site
              </Link>
            </Button>
            <div className="h-4 w-px bg-border hidden sm:block" />
            <h1 className="text-xs font-semibold tracking-wider uppercase text-primary flex items-center gap-1.5">
              Email Studio &bull; Top Reasons
            </h1>
          </div>

          {/* Template Selector */}
          <div className="flex items-center bg-secondary/80 p-0.5 rounded-lg border border-border">
            <button
              onClick={() => setActiveTemplate("payment")}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeTemplate === "payment"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              Payment Receipt
            </button>
            <button
              onClick={() => setActiveTemplate("verification")}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeTemplate === "verification"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              Sign-up Verification
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Viewport Toggles */}
            <div className="flex items-center bg-secondary/80 p-0.5 rounded-md border border-border">
              <Button
                variant={deviceView === "desktop" ? "default" : "ghost"}
                size="sm"
                className="h-7 px-2.5 text-xs"
                onClick={() => setDeviceView("desktop")}
              >
                <Monitor className="w-3.5 h-3.5 mr-1" />
                Desktop
              </Button>
              <Button
                variant={deviceView === "mobile" ? "default" : "ghost"}
                size="sm"
                className="h-7 px-2.5 text-xs"
                onClick={() => setDeviceView("mobile")}
              >
                <Smartphone className="w-3.5 h-3.5 mr-1" />
                Mobile
              </Button>
            </div>

            <Button
              onClick={handleCopy}
              size="sm"
              className="h-8 gap-1.5 bg-primary text-primary-foreground font-medium hover:bg-primary/90"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copied!" : "Copy HTML"}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Studio Frame */}
      <div className="flex-1 container mx-auto p-4 md:p-6 grid lg:grid-cols-12 gap-6">
        
        {/* Left Column: Live Rendered View */}
        <div className="lg:col-span-8 flex flex-col items-center">
          <div className="w-full mb-3 flex items-center justify-between text-xs text-muted-foreground px-1">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Sender: <strong className="text-foreground">enquiries@topreasonsco.com</strong>
            </span>
            <span className="truncate max-w-[280px]">
              Subject:{" "}
              {activeTemplate === "payment"
                ? "Payment Confirmed & Receipt - Mercedes-Benz S-Class"
                : "Confirm Your Top Reasons Account"}
            </span>
          </div>

          {/* Device Frame */}
          <div
            className={`w-full transition-all duration-300 rounded-xl overflow-hidden border border-border shadow-2xl bg-[#06080d] flex justify-center ${
              deviceView === "mobile" ? "max-w-[390px]" : "max-w-[680px]"
            }`}
          >
            <iframe
              key={activeTemplate + deviceView}
              title="Email Template Preview"
              srcDoc={currentPreviewHtml}
              className="w-full h-[760px] border-0"
              sandbox="allow-same-origin allow-popups"
            />
          </div>
        </div>

        {/* Right Column: Controls & Test Dispatch */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* Send Test Email Card */}
          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 text-primary font-semibold text-sm uppercase tracking-wider">
                <Send className="w-4 h-4" />
                Dispatch Test Email
              </div>
              <CardDescription className="text-xs">
                Send a real test of the{" "}
                <strong>
                  {activeTemplate === "payment" ? "Payment Receipt" : "Sign-up Verification"}
                </strong>{" "}
                email to your inbox from <span className="text-primary">enquiries@topreasonsco.com</span>.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSendTest} className="space-y-3">
                <div className="space-y-1">
                  <Input
                    type="email"
                    placeholder="your-email@example.com"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                    className="text-xs h-9 bg-background"
                    required
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Sent via Resend from <strong className="text-primary">enquiries@topreasonsco.com</strong>
                  </p>
                </div>
                <Button type="submit" size="sm" className="w-full text-xs font-semibold" disabled={isSending}>
                  {isSending ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                      Dispatching to inbox...
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5 mr-2" />
                      Send Live Test Email
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Workflow & Setup Guide */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="overview" className="text-xs">How It Works</TabsTrigger>
              <TabsTrigger value="raw" className="text-xs">Raw HTML</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-3 pt-2">
              <Card className="border-border bg-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-bold uppercase tracking-wider text-primary">
                    Automated Payment Flow
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-xs space-y-3 text-muted-foreground leading-relaxed">
                  <div className="p-2.5 rounded-lg bg-secondary/50 border border-border">
                    <strong className="text-foreground block mb-1">1. User Completes Payment</strong>
                    Customer pays via Mobile Money (MTN / Vodafone) or Visa / Mastercard through Flutterwave on the website.
                  </div>
                  <div className="p-2.5 rounded-lg bg-secondary/50 border border-border">
                    <strong className="text-foreground block mb-1">2. Verification & Status Update</strong>
                    The backend verifies the transaction with Flutterwave API and marks the booking as <code className="text-green-400">paid</code> and <code className="text-green-400">confirmed</code>.
                  </div>
                  <div className="p-2.5 rounded-lg bg-secondary/50 border border-border">
                    <strong className="text-foreground block mb-1">3. Instant Receipt & Admin Alert</strong>
                    The customer receives the luxury HTML receipt with booking reference, dates, and amount. Simultaneously, an alert is dispatched to <code className="text-primary">enquiries@topreasonsco.com</code> so your operations desk can prepare the vehicle.
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="raw" className="pt-2">
              <Card className="border-border bg-card">
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <CardTitle className="text-xs font-mono">
                    {activeTemplate === "payment" ? "payment_receipt.html" : "confirm_signup.html"}
                  </CardTitle>
                  <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={handleCopy}>
                    {copied ? <Check className="w-3 h-3 text-green-500 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
                    {copied ? "Copied" : "Copy"}
                  </Button>
                </CardHeader>
                <CardContent>
                  <pre className="text-[11px] bg-background p-3 rounded border border-border overflow-x-auto max-h-[350px] font-mono text-muted-foreground">
                    {activeTemplate === "payment" ? paymentReceiptHtml : SUPABASE_RAW_TEMPLATE}
                  </pre>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

        </div>

      </div>
    </div>
  );
}
