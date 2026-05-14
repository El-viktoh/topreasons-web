import { z } from "zod";

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character");

export const emailSchema = z
  .string()
  .email("Please enter a valid email address")
  .max(255, "Email must be less than 255 characters");

export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

export const signUpSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  fullName: z
    .string()
    .min(1, "Full name is required")
    .max(100, "Full name must be less than 100 characters")
    .trim(),
});

export const resetEmailSchema = z.object({
  email: emailSchema,
});

export const newPasswordSchema = z.object({
  password: passwordSchema,
});

export const renterAccountSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  fullName: z
    .string()
    .min(1, "Full name is required")
    .max(100, "Full name must be less than 100 characters")
    .trim(),
});

export const renterBusinessSchema = z.object({
  companyName: z
    .string()
    .min(1, "Company name is required")
    .max(200, "Company name must be less than 200 characters")
    .trim(),
  businessLicense: z.string().max(100, "Business license must be less than 100 characters").optional(),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .max(20, "Phone number must be less than 20 characters"),
  address: z
    .string()
    .min(1, "Address is required")
    .max(300, "Address must be less than 300 characters"),
});

export const renterBankingSchema = z.object({
  bankName: z
    .string()
    .min(1, "Bank name is required")
    .max(100, "Bank name must be less than 100 characters"),
  bankAccountName: z
    .string()
    .min(1, "Account holder name is required")
    .max(100, "Account holder name must be less than 100 characters"),
  bankAccountNumber: z
    .string()
    .min(1, "Account number is required")
    .max(30, "Account number must be less than 30 characters"),
});

export const getPasswordRequirements = () => [
  "At least 8 characters",
  "One uppercase letter (A-Z)",
  "One lowercase letter (a-z)",
  "One number (0-9)",
  "One special character (!@#$%^&*)",
];

export const validateField = <T>(
  schema: z.ZodSchema<T>,
  value: unknown
): { success: boolean; error?: string } => {
  const result = schema.safeParse(value);
  if (result.success) {
    return { success: true };
  }
  return { success: false, error: result.error.errors[0]?.message };
};
