// Server-only: uses the Supabase service-role key. Never import this from a client component.
import { createClient } from "@supabase/supabase-js";
import { generatePaymentReceiptEmailHtml, EMAIL_CONFIG, sendEmail } from "@/lib/email";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
);

export const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const EXPECTED_CURRENCY = "GHS";
const DAY_MS = 24 * 60 * 60 * 1000;

export interface VerifiedTransaction {
  id: string | number;
  amount: number;
  currency: string;
  txRef: string;
  customerEmail?: string;
  customerName?: string;
  paymentType?: string;
}

export interface BookingForPayment {
  id: string;
  rental_id: string;
  start_date: string;
  end_date: string;
  payment_status: string | null;
  user_id: string | null;
  guest_email: string | null;
  guest_name: string | null;
  drive_option?: string | null;
  rental: { title: string | null; type: string | null; price_per_day: number | string | null } | null;
}

// Asks Flutterwave directly whether a transaction really succeeded. Every amount,
// currency and reference used afterwards comes from this response, never from
// anything the browser (or a webhook body) claims.
export async function fetchVerifiedTransaction(
  transactionId: string | number
): Promise<VerifiedTransaction | null> {
  const secretKey = process.env.FLUTTERWAVE_SECRET_KEY;
  if (!secretKey) throw new Error("FLUTTERWAVE_SECRET_KEY is not configured");

  // Flutterwave transaction ids are numeric; reject anything else so it can't alter the URL path.
  const id = String(transactionId);
  if (!/^\d+$/.test(id)) return null;

  const response = await fetch(`https://api.flutterwave.com/v3/transactions/${id}/verify`, {
    method: "GET",
    headers: { Authorization: `Bearer ${secretKey}`, "Content-Type": "application/json" },
  });
  const body = await response.json().catch(() => null);
  if (!body || body.status !== "success" || body.data?.status !== "successful") return null;

  return {
    id: body.data.id ?? id,
    amount: Number(body.data.amount),
    currency: String(body.data.currency ?? ""),
    txRef: String(body.data.tx_ref ?? ""),
    customerEmail: body.data.customer?.email || undefined,
    customerName: body.data.customer?.name || undefined,
    paymentType: body.data.payment_type || undefined,
  };
}

export async function getBookingForPayment(bookingId: string): Promise<BookingForPayment | null> {
  if (!UUID_REGEX.test(bookingId)) return null;
  const { data } = await supabaseAdmin
    .from("bookings")
    .select("*, rental:rentals(title, type, price_per_day)")
    .eq("id", bookingId)
    .maybeSingle();
  return (data as BookingForPayment | null) ?? null;
}

// The price is recomputed here from the rental's own rate and the booked dates.
// The bookings table's total_price is written by the browser, so it can't be trusted.
export function expectedBookingAmount(booking: BookingForPayment): number {
  const pricePerDay = Number(booking.rental?.price_per_day);
  const days = Math.round((Date.parse(booking.end_date) - Date.parse(booking.start_date)) / DAY_MS);
  if (!Number.isFinite(pricePerDay) || !Number.isFinite(days) || days <= 0) return 0;
  return pricePerDay * days;
}

export function checkTransactionMatchesBooking(
  booking: BookingForPayment,
  tx: VerifiedTransaction
): { ok: true } | { ok: false; reason: string } {
  if (tx.currency !== EXPECTED_CURRENCY) {
    return { ok: false, reason: `unexpected currency ${tx.currency}` };
  }
  // The payment reference is created per booking, so a payment can't be reused for another one.
  if (!tx.txRef.startsWith(`booking-${booking.id}-`)) {
    return { ok: false, reason: "payment reference does not belong to this booking" };
  }
  const expected = expectedBookingAmount(booking);
  if (!(expected > 0)) {
    return { ok: false, reason: "booking has no valid price" };
  }
  if (!Number.isFinite(tx.amount) || tx.amount < expected - 0.01) {
    return { ok: false, reason: `paid ${tx.amount} but the booking costs ${expected}` };
  }
  return { ok: true };
}

// Marks the booking paid and sends the receipt. The browser callback and the Flutterwave
// webhook both fire for the same payment, so the paid transition is claimed atomically:
// only the first caller gets confirmed = true and sends emails.
export async function confirmBookingPayment(
  booking: BookingForPayment,
  tx: VerifiedTransaction
): Promise<{ confirmed: boolean }> {
  const { data: claimed, error } = await supabaseAdmin
    .from("bookings")
    .update({ payment_status: "paid", status: "confirmed" })
    .eq("id", booking.id)
    .or("payment_status.is.null,payment_status.neq.paid")
    .select("id");

  if (error) throw error;
  if (!claimed || claimed.length === 0) return { confirmed: false };

  await sendReceiptEmails(booking, tx);
  return { confirmed: true };
}

async function sendReceiptEmails(booking: BookingForPayment, tx: VerifiedTransaction) {
  try {
    let customerEmail = tx.customerEmail || booking.guest_email || undefined;
    let customerName = tx.customerName || booking.guest_name || undefined;

    if ((!customerEmail || !customerName) && booking.user_id) {
      const { data: profile } = await supabaseAdmin
        .from("profiles")
        .select("email, full_name")
        .eq("id", booking.user_id)
        .maybeSingle();
      if (!customerEmail && profile?.email) customerEmail = profile.email;
      if (!customerName && profile?.full_name) customerName = profile.full_name;
    }

    if (!customerEmail) {
      console.warn("Receipt not sent: no customer email for booking", booking.id);
      return;
    }

    const rentalTitle = booking.rental?.title || "Luxury Fleet Service";
    const html = generatePaymentReceiptEmailHtml({
      customerName,
      rentalTitle,
      rentalType: booking.rental?.type || undefined,
      startDate: booking.start_date,
      endDate: booking.end_date,
      driveOption: booking.drive_option || undefined,
      currency: tx.currency,
      amount: tx.amount,
      transactionId: tx.id,
      bookingId: booking.id,
      paymentMethod: tx.paymentType || "Card / Mobile Money",
    });

    const receipt = await sendEmail({
      from: EMAIL_CONFIG.from,
      replyTo: EMAIL_CONFIG.replyTo,
      to: customerEmail,
      subject: `Payment Confirmed & Receipt - ${rentalTitle}`,
      html,
    });
    if (!receipt.success) console.error("Receipt email failed for booking", booking.id, receipt.error);

    const opsAlert = await sendEmail({
      from: EMAIL_CONFIG.from,
      replyTo: customerEmail,
      to: EMAIL_CONFIG.supportEmail,
      subject: `[PAID RESERVATION] ${rentalTitle} - ${tx.currency} ${tx.amount}`,
      html,
    });
    if (!opsAlert.success) console.warn("Ops desk alert failed for booking", booking.id, opsAlert.error);
  } catch (emailError) {
    // The payment itself is already recorded, so an email failure must not fail the request.
    console.error("Failed to send payment emails:", emailError);
  }
}
