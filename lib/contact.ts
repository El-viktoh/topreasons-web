export const CONTACT_LIMITS = {
  name: 100,
  email: 254,
  subject: 150,
  messageMin: 10,
  messageMax: 5000,
} as const;

export interface ContactMessage {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export type ContactValidation =
  | { ok: true; value: ContactMessage }
  | { ok: false; error: string };

const EMAIL_PATTERN = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[^\s@<>()[\]\\,;:"]+$/;

// One line only: names and subjects end up in email headers and subject lines.
const singleLine = (value: unknown) =>
  typeof value === "string" ? value.replace(/[\r\n\t]+/g, " ").replace(/\s{2,}/g, " ").trim() : "";

export function validateContactMessage(input: unknown): ContactValidation {
  const raw = (input && typeof input === "object" ? input : {}) as Record<string, unknown>;

  const name = singleLine(raw.name);
  const email = singleLine(raw.email).toLowerCase();
  const subject = singleLine(raw.subject);
  const message = typeof raw.message === "string" ? raw.message.replace(/\r\n/g, "\n").trim() : "";

  if (!name) return { ok: false, error: "Please enter your name." };
  if (name.length > CONTACT_LIMITS.name) return { ok: false, error: "That name is too long." };

  if (!email || email.length > CONTACT_LIMITS.email || !EMAIL_PATTERN.test(email)) {
    return { ok: false, error: "Please enter a valid email address." };
  }

  if (!subject) return { ok: false, error: "Please enter a subject." };
  if (subject.length > CONTACT_LIMITS.subject) return { ok: false, error: "That subject is too long." };

  if (message.length < CONTACT_LIMITS.messageMin) {
    return { ok: false, error: "Please write a little more in your message." };
  }
  if (message.length > CONTACT_LIMITS.messageMax) {
    return { ok: false, error: `Your message is too long (maximum ${CONTACT_LIMITS.messageMax} characters).` };
  }

  return { ok: true, value: { name, email, subject, message } };
}
