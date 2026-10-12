import { EMAIL_PATTERN, singleLine } from "@/lib/contact";

export const VEHICLE_TYPES = {
  saloon: "Executive Saloon",
  suv: "Spacious SUV",
  courier: "Courier Van",
  other: "Other",
} as const;

export type VehicleTypeKey = keyof typeof VEHICLE_TYPES;

export interface DriverApplication {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  vehicleType: VehicleTypeKey;
  vehicleMake: string;
  vehicleYear: string;
  licenseNumber: string;
  experience: string;
}

export type DriverApplicationValidation =
  | { ok: true; value: DriverApplication }
  | { ok: false; error: string };

const MIN_VEHICLE_YEAR = 1990;
const EXPERIENCE_MIN = 20;
const EXPERIENCE_MAX = 3000;

export function validateDriverApplication(
  input: unknown,
  now: Date = new Date()
): DriverApplicationValidation {
  const raw = (input && typeof input === "object" ? input : {}) as Record<string, unknown>;

  const firstName = singleLine(raw.firstName);
  const lastName = singleLine(raw.lastName);
  const email = singleLine(raw.email).toLowerCase();
  const phone = singleLine(raw.phone);
  const vehicleType = singleLine(raw.vehicleType);
  const vehicleMake = singleLine(raw.vehicleMake);
  const vehicleYear = singleLine(raw.vehicleYear);
  const licenseNumber = singleLine(raw.licenseNumber);
  const experience = typeof raw.experience === "string" ? raw.experience.replace(/\r\n/g, "\n").trim() : "";

  if (!firstName) return { ok: false, error: "Please enter your first name." };
  if (firstName.length > 60) return { ok: false, error: "That first name is too long." };
  if (!lastName) return { ok: false, error: "Please enter your last name." };
  if (lastName.length > 60) return { ok: false, error: "That last name is too long." };

  if (!email || email.length > 254 || !EMAIL_PATTERN.test(email)) {
    return { ok: false, error: "Please enter a valid email address." };
  }

  // Digits with optional + ( ) - and spaces; 7 to 15 digits covers Ghanaian and international numbers.
  const phoneDigits = phone.replace(/\D/g, "");
  if (!/^[+\d][\d\s()-]*$/.test(phone) || phoneDigits.length < 7 || phoneDigits.length > 15) {
    return { ok: false, error: "Please enter a valid phone number." };
  }

  if (!Object.prototype.hasOwnProperty.call(VEHICLE_TYPES, vehicleType)) {
    return { ok: false, error: "Please select your vehicle type." };
  }

  if (!vehicleMake) return { ok: false, error: "Please enter your vehicle make and model." };
  if (vehicleMake.length > 100) return { ok: false, error: "That vehicle make and model is too long." };

  const yearNumber = Number(vehicleYear);
  if (!/^\d{4}$/.test(vehicleYear) || yearNumber < MIN_VEHICLE_YEAR || yearNumber > now.getFullYear() + 1) {
    return { ok: false, error: `Please enter a valid year of manufacture (${MIN_VEHICLE_YEAR} or later).` };
  }

  if (!licenseNumber) return { ok: false, error: "Please enter your driver's license number." };
  if (licenseNumber.length > 40) return { ok: false, error: "That license number is too long." };

  if (experience.length < EXPERIENCE_MIN) {
    return { ok: false, error: "Please tell us a little more about your driving experience." };
  }
  if (experience.length > EXPERIENCE_MAX) {
    return { ok: false, error: `Your experience summary is too long (maximum ${EXPERIENCE_MAX} characters).` };
  }

  return {
    ok: true,
    value: {
      firstName,
      lastName,
      email,
      phone,
      vehicleType: vehicleType as VehicleTypeKey,
      vehicleMake,
      vehicleYear,
      licenseNumber,
      experience,
    },
  };
}
