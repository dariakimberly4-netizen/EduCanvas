export const ADMISSION_CLASS_LEVELS = [
  "Playgroup–KG",
  "Classes I–V",
  "Classes VI–X",
  "Classes XI–XII",
] as const;

export type AdmissionClassLevel = (typeof ADMISSION_CLASS_LEVELS)[number];

export interface AdmissionEnquiry {
  guardianName: string;
  phone: string;
  classLevel: string;
}

export type AdmissionDeliveryStatus = "pending" | "delivered" | "failed";

export interface AdmissionEnquiryRecord extends AdmissionEnquiry {
  id: string;
  submittedAt: string;
  deliveryStatus: AdmissionDeliveryStatus;
}

export interface AdmissionEnquiryFieldErrors {
  guardianName?: string;
  phone?: string;
  classLevel?: string;
}

type AdmissionEnquiryParseResult =
  | {
      success: true;
      data: AdmissionEnquiry;
      isSpam: boolean;
    }
  | {
      success: false;
      fieldErrors: AdmissionEnquiryFieldErrors;
    };

function readString(
  record: Record<string, unknown>,
  key: string,
): string {
  return typeof record[key] === "string" ? record[key].trim() : "";
}

export function parseAdmissionEnquiry(
  input: unknown,
  allowedClassLevels: readonly string[] = ADMISSION_CLASS_LEVELS,
): AdmissionEnquiryParseResult {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return {
      success: false,
      fieldErrors: {
        guardianName: "Enter a parent or guardian name.",
        phone: "Enter a phone number.",
        classLevel: "Select a class level.",
      },
    };
  }

  const record = input as Record<string, unknown>;
  const guardianName = readString(record, "guardianName");
  const phone = readString(record, "phone").replace(/\s+/g, " ");
  const classLevel = readString(record, "classLevel");
  const website = readString(record, "website");
  const fieldErrors: AdmissionEnquiryFieldErrors = {};

  if (guardianName.length < 2 || guardianName.length > 80) {
    fieldErrors.guardianName =
      "Enter a parent or guardian name between 2 and 80 characters.";
  }

  if (
    phone.length > 25 ||
    !/^\+?[0-9][0-9\s()-]{7,24}$/.test(phone)
  ) {
    fieldErrors.phone = "Enter a valid phone number.";
  }

  if (!allowedClassLevels.includes(classLevel)) {
    fieldErrors.classLevel = "Select a valid class level.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { success: false, fieldErrors };
  }

  return {
    success: true,
    data: {
      guardianName,
      phone,
      classLevel,
    },
    isSpam: website.length > 0,
  };
}
