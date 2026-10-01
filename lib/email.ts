import { Resend } from "resend";

export const EMAIL_CONFIG = {
  from: "Top Reasons <enquiries@topreasonsco.com>",
  replyTo: "enquiries@topreasonsco.com",
  supportEmail: "enquiries@topreasonsco.com",
  supportPhone: "+233 55 929 7448",
  companyName: "Top Reasons Car Rentals",
  companyLocation: "Accra, Greater Accra Region, Ghana",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://topreasonsco.com",
  logoUrl: "https://topreasonsco.com/assets/logo.png",
};

export const getResendClient = (): Resend | null => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
};

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
  from?: string;
}

export async function sendEmail({
  to,
  subject,
  html,
  text,
  replyTo = EMAIL_CONFIG.replyTo,
  from = EMAIL_CONFIG.from,
}: SendEmailOptions) {
  const resend = getResendClient();
  if (!resend) {
    console.warn("RESEND_API_KEY not configured. Skipping email send to:", to);
    return { success: false, error: "RESEND_API_KEY not configured" };
  }

  try {
    const data = await resend.emails.send({
      from,
      to: Array.isArray(to) ? to : [to],
      replyTo,
      subject,
      html,
      text,
    });
    return { success: true, data };
  } catch (error: any) {
    console.error("Failed to send email via Resend:", error);
    return { success: false, error: error.message || "Failed to send email" };
  }
}

/**
 * Generates the HTML template for Sign-up Verification Email
 */
export function generateVerificationEmailHtml({
  confirmationUrl,
  token,
  fullName,
}: {
  confirmationUrl: string;
  token?: string;
  fullName?: string;
}) {
  const greeting = fullName ? `Hello ${fullName},` : "Hello,";

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
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
                    <a href="${EMAIL_CONFIG.siteUrl}" target="_blank" style="text-decoration: none; display: inline-block;">
                      <img src="${EMAIL_CONFIG.logoUrl}" alt="Top Reasons" width="160" height="auto" style="display: block; max-width: 160px; height: auto; margin-bottom: 8px;" />
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
                      ${greeting} Thank you for creating an account with <strong>Top Reasons</strong>.
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
                          <a href="${confirmationUrl}" target="_blank" class="btn-gold cta-button" style="font-size: 15px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-weight: 700; color: #0b0f17; text-decoration: none; padding: 15px 36px; border-radius: 8px; display: inline-block; letter-spacing: 0.5px; text-transform: uppercase;">
                            Verify Email Address &rarr;
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                ${
                  token
                    ? `<tr>
                  <td align="center" style="padding-bottom: 28px;">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #0b0f17; border-radius: 10px; border: 1px solid #1f293d; padding: 18px;">
                      <tr>
                        <td align="center">
                          <p style="margin: 0 0 8px 0; font-size: 12px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px;">
                            Or enter this 6-digit verification code:
                          </p>
                          <div style="font-size: 30px; font-weight: 800; letter-spacing: 6px; color: #d4af37; font-family: 'Courier New', Courier, monospace; padding: 8px 16px; display: inline-block;">
                            ${token}
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>`
                    : ""
                }

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
                      <a href="${confirmationUrl}" target="_blank" style="font-size: 11px; color: #94a3b8; text-decoration: none; font-family: 'Courier New', Courier, monospace; line-height: 16px;">
                        ${confirmationUrl}
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
                      <a href="mailto:${EMAIL_CONFIG.supportEmail}" style="color: #d4af37; text-decoration: none; font-weight: 600;">
                        ${EMAIL_CONFIG.supportEmail}
                      </a>
                      &bull;
                      <a href="tel:${EMAIL_CONFIG.supportPhone.replace(/\s+/g, "")}" style="color: #cbd5e1; text-decoration: none;">
                        ${EMAIL_CONFIG.supportPhone}
                      </a>
                    </p>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-bottom: 14px;">
                    <p style="margin: 0; font-size: 11px; color: #64748b; line-height: 16px;">
                      ${EMAIL_CONFIG.companyName} &bull; ${EMAIL_CONFIG.companyLocation}
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
}

export interface PaymentReceiptEmailData {
  customerName?: string;
  rentalTitle: string;
  rentalType?: string;
  startDate: string;
  endDate: string;
  driveOption?: string;
  currency: string;
  amount: number | string;
  transactionId: string | number;
  bookingId: string;
  paymentMethod?: string;
  paymentDate?: string;
}

/**
 * Generates the HTML template for Payment Confirmation & Receipt Email
 */
export function generatePaymentReceiptEmailHtml(data: PaymentReceiptEmailData) {
  const greeting = data.customerName ? `Dear ${data.customerName},` : "Hello,";
  const numAmount = typeof data.amount === "number" ? data.amount : parseFloat(String(data.amount)) || 0;
  const formattedAmount = numAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const refCode = `TR-${String(data.bookingId).slice(0, 8).toUpperCase()}`;
  const displayDate = data.paymentDate || new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  const viewBookingUrl = `${EMAIL_CONFIG.siteUrl}/my-bookings`;

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="x-apple-disable-message-reformatting" />
  <meta name="color-scheme" content="dark light" />
  <title>Payment Receipt - Top Reasons</title>
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
      .headline { font-size: 22px !important; line-height: 28px !important; }
      .cta-button { width: 100% !important; box-sizing: border-box !important; text-align: center !important; }
      .receipt-row-label { width: 40% !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #06080d; color: #e2e8f0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <div style="display: none; font-size: 1px; color: #06080d; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
    Payment received for ${data.rentalTitle}. Amount: ${data.currency} ${formattedAmount}. Your Top Reasons reservation is confirmed.
    &#847; &zwnj; &nbsp; &#8199; &shy; &#847; &zwnj; &nbsp; &#8199; &shy;
  </div>

  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #06080d; min-height: 100vh;">
    <tr>
      <td align="center" style="padding: 40px 16px;">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" class="email-container" style="max-width: 600px; background-color: #0f141f; border-radius: 14px; overflow: hidden; border: 1px solid #232d3f; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6);">
          
          <!-- Top Accent Gold Line -->
          <tr>
            <td height="4" style="background: linear-gradient(90deg, #996515 0%, #d4af37 50%, #f6e27a 100%); line-height: 4px; font-size: 4px;">&nbsp;</td>
          </tr>

          <!-- Header Section -->
          <tr>
            <td align="center" class="header-padding" style="padding: 32px 36px 20px 36px; border-bottom: 1px solid #1a2232; background-color: #0b0f17;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="${EMAIL_CONFIG.siteUrl}" target="_blank" style="text-decoration: none; display: inline-block;">
                      <img src="${EMAIL_CONFIG.logoUrl}" alt="Top Reasons" width="150" height="auto" style="display: block; max-width: 150px; height: auto; margin-bottom: 8px;" />
                    </a>
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <span style="display: inline-block; font-size: 10px; font-weight: 700; letter-spacing: 3px; color: #d4af37; text-transform: uppercase; background-color: rgba(212, 175, 55, 0.12); padding: 4px 12px; border-radius: 999px; border: 1px solid rgba(212, 175, 55, 0.25);">
                      Official Payment Receipt
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Hero & Success Banner -->
          <tr>
            <td class="content-padding" style="padding: 36px 40px 24px 40px;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                
                <!-- Success Checkmark -->
                <tr>
                  <td align="center" style="padding-bottom: 16px;">
                    <div style="width: 58px; height: 58px; border-radius: 50%; background: radial-gradient(circle, rgba(34, 197, 94, 0.2) 0%, rgba(34, 197, 94, 0.05) 100%); border: 1px solid rgba(34, 197, 94, 0.4); text-align: center; line-height: 58px; display: inline-block;">
                      <span style="font-size: 28px; line-height: 58px;">✅</span>
                    </div>
                  </td>
                </tr>

                <!-- Title & Amount -->
                <tr>
                  <td align="center" style="padding-bottom: 6px;">
                    <h1 class="headline" style="margin: 0; font-size: 24px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px;">
                      Payment Confirmed!
                    </h1>
                  </td>
                </tr>

                <tr>
                  <td align="center" style="padding-bottom: 20px;">
                    <div style="font-size: 32px; font-weight: 800; color: #d4af37; letter-spacing: -0.5px; margin-top: 4px;">
                      ${data.currency} ${formattedAmount}
                    </div>
                    <span style="display: inline-block; margin-top: 6px; font-size: 11px; font-weight: 700; color: #4ade80; background-color: rgba(34, 197, 94, 0.12); border: 1px solid rgba(34, 197, 94, 0.3); padding: 3px 10px; border-radius: 999px; text-transform: uppercase; letter-spacing: 1px;">
                      Paid &bull; Verified
                    </span>
                  </td>
                </tr>

                <!-- Salutation -->
                <tr>
                  <td style="padding-bottom: 24px; text-align: center;">
                    <p style="margin: 0 0 10px 0; font-size: 15px; color: #cbd5e1; line-height: 22px;">
                      ${greeting}
                    </p>
                    <p style="margin: 0; font-size: 14px; color: #94a3b8; line-height: 22px;">
                      Thank you for your payment. Your booking with <strong>Top Reasons</strong> has been confirmed and locked into our scheduling schedule.
                    </p>
                  </td>
                </tr>

                <!-- Receipt Breakdown Box -->
                <tr>
                  <td style="padding-bottom: 24px;">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #0b1018; border: 1px solid #1f2a3e; border-radius: 10px; padding: 20px; box-sizing: border-box;">
                      <tr>
                        <td colspan="2" style="padding-bottom: 12px; border-bottom: 1px solid #192233;">
                          <span style="font-size: 11px; font-weight: 700; color: #d4af37; text-transform: uppercase; letter-spacing: 1px;">
                            Transaction Summary
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td class="receipt-row-label" style="padding: 10px 0 6px 0; font-size: 13px; color: #94a3b8;">Receipt Reference:</td>
                        <td align="right" style="padding: 10px 0 6px 0; font-size: 13px; font-weight: 600; color: #ffffff; font-family: 'Courier New', Courier, monospace;">
                          ${refCode}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; font-size: 13px; color: #94a3b8;">Transaction ID:</td>
                        <td align="right" style="padding: 6px 0; font-size: 13px; color: #cbd5e1; font-family: 'Courier New', Courier, monospace;">
                          ${data.transactionId}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; font-size: 13px; color: #94a3b8;">Payment Date:</td>
                        <td align="right" style="padding: 6px 0; font-size: 13px; color: #cbd5e1;">
                          ${displayDate}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; font-size: 13px; color: #94a3b8;">Payment Channel:</td>
                        <td align="right" style="padding: 6px 0; font-size: 13px; color: #cbd5e1;">
                          ${data.paymentMethod || "Flutterwave (Card / Mobile Money)"}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 10px 0 4px 0; font-size: 14px; font-weight: 700; color: #ffffff; border-top: 1px solid #192233;">Total Paid:</td>
                        <td align="right" style="padding: 10px 0 4px 0; font-size: 15px; font-weight: 800; color: #d4af37; border-top: 1px solid #192233;">
                          ${data.currency} ${formattedAmount}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Reservation Details Card -->
                <tr>
                  <td style="padding-bottom: 28px;">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #121824; border: 1px solid #233148; border-radius: 10px; padding: 20px;">
                      <tr>
                        <td colspan="2" style="padding-bottom: 12px; border-bottom: 1px solid #1d293d;">
                          <span style="font-size: 11px; font-weight: 700; color: #d4af37; text-transform: uppercase; letter-spacing: 1px;">
                            Vehicle &amp; Itinerary
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 10px 0 6px 0; font-size: 13px; color: #94a3b8;">Vehicle / Service:</td>
                        <td align="right" style="padding: 10px 0 6px 0; font-size: 13px; font-weight: 700; color: #ffffff;">
                          ${data.rentalTitle}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; font-size: 13px; color: #94a3b8;">Start Date:</td>
                        <td align="right" style="padding: 6px 0; font-size: 13px; color: #cbd5e1;">
                          ${data.startDate}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; font-size: 13px; color: #94a3b8;">End Date:</td>
                        <td align="right" style="padding: 6px 0; font-size: 13px; color: #cbd5e1;">
                          ${data.endDate}
                        </td>
                      </tr>
                      ${
                        data.driveOption
                          ? `<tr>
                        <td style="padding: 6px 0; font-size: 13px; color: #94a3b8;">Drive Mode:</td>
                        <td align="right" style="padding: 6px 0; font-size: 13px; font-weight: 600; color: #d4af37;">
                          ${data.driveOption === "self" ? "Self Drive" : data.driveOption === "chauffeur" ? "With Professional Chauffeur" : data.driveOption}
                        </td>
                      </tr>`
                          : ""
                      }
                    </table>
                  </td>
                </tr>

                <!-- Action CTA Button -->
                <tr>
                  <td align="center" style="padding-bottom: 24px;">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center" style="border-radius: 8px; background: linear-gradient(135deg, #d4af37 0%, #e6c86e 100%);">
                          <a href="${viewBookingUrl}" target="_blank" class="btn-gold cta-button" style="font-size: 14px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-weight: 700; color: #0b0f17; text-decoration: none; padding: 14px 34px; border-radius: 8px; display: inline-block; letter-spacing: 0.5px; text-transform: uppercase;">
                            View My Bookings &rarr;
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Concierge / What to Expect Advisory -->
                <tr>
                  <td style="padding: 16px 20px; background-color: rgba(212, 175, 55, 0.05); border-left: 3px solid #d4af37; border-radius: 0 8px 8px 0; margin-bottom: 20px;">
                    <p style="margin: 0 0 6px 0; font-size: 13px; font-weight: 600; color: #ffffff;">
                      Next Steps for Your Trip:
                    </p>
                    <ul style="margin: 0; padding-left: 18px; font-size: 12px; line-height: 20px; color: #cbd5e1;">
                      <li>Our operations team will reach out to confirm your exact handover location or flight details.</li>
                      <li>For self-drive hires, please ensure you have your valid driver's license and national ID/passport ready.</li>
                      <li>Need 24/7 assistance? Reach out to our concierge hotline at <strong>${EMAIL_CONFIG.supportPhone}</strong>.</li>
                    </ul>
                  </td>
                </tr>

              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding: 28px 36px; background-color: #070a10; border-top: 1px solid #161d2b;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center" style="padding-bottom: 12px;">
                    <p style="margin: 0; font-size: 12px; color: #94a3b8; line-height: 18px;">
                      Need assistance or special arrangements? Contact us at
                      <br />
                      <a href="mailto:${EMAIL_CONFIG.supportEmail}" style="color: #d4af37; text-decoration: none; font-weight: 600;">
                        ${EMAIL_CONFIG.supportEmail}
                      </a>
                      &bull;
                      <a href="tel:${EMAIL_CONFIG.supportPhone.replace(/\s+/g, "")}" style="color: #cbd5e1; text-decoration: none;">
                        ${EMAIL_CONFIG.supportPhone}
                      </a>
                    </p>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-bottom: 14px;">
                    <p style="margin: 0; font-size: 11px; color: #64748b; line-height: 16px;">
                      ${EMAIL_CONFIG.companyName} &bull; ${EMAIL_CONFIG.companyLocation}
                    </p>
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <p style="margin: 0; font-size: 10px; color: #475569;">
                      &copy; 2026 Top Reasons. All rights reserved. Ghana.
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
}

