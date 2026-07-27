import { randomUUID } from "node:crypto";

import { Resend } from "resend";

import type { AdmissionEnquiry } from "@/features/admissions/domain/admission-enquiry";
import { AdmissionEnquiryEmail } from "@/features/admissions/emails/admission-enquiry-email";

interface SendAdmissionEnquiryOptions {
  skipDelivery?: boolean;
}

export class AdmissionEmailConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AdmissionEmailConfigurationError";
  }
}

function getEmailConfiguration() {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.RESEND_FROM_EMAIL?.trim();
  const adminEmail = process.env.ADMISSION_ADMIN_EMAIL?.trim();

  if (!apiKey || !from || !adminEmail) {
    throw new AdmissionEmailConfigurationError(
      "RESEND_API_KEY, RESEND_FROM_EMAIL, and ADMISSION_ADMIN_EMAIL must be configured.",
    );
  }

  return { apiKey, from, adminEmail };
}

function createPlainTextEmail(
  enquiry: AdmissionEnquiry,
  submittedAt: Date,
) {
  return [
    "New admission enquiry",
    "",
    `Parent or guardian: ${enquiry.guardianName}`,
    `Phone number: ${enquiry.phone}`,
    `Interested class: ${enquiry.classLevel}`,
    `Submitted at: ${submittedAt.toISOString()}`,
    "",
    "Please contact the family within one school day.",
  ].join("\n");
}

export async function sendAdmissionEnquiry(
  enquiry: AdmissionEnquiry,
  options: SendAdmissionEnquiryOptions = {},
) {
  if (options.skipDelivery) {
    return { id: "e2e-delivery-bypassed" };
  }

  const { apiKey, from, adminEmail } = getEmailConfiguration();
  const submittedAt = new Date();
  const resend = new Resend(apiKey);
  const { data, error } = await resend.emails.send(
    {
      from,
      to: [adminEmail],
      subject: `Admission enquiry: ${enquiry.guardianName} · ${enquiry.classLevel}`,
      react: (
        <AdmissionEnquiryEmail
          enquiry={enquiry}
          submittedAt={submittedAt}
        />
      ),
      text: createPlainTextEmail(enquiry, submittedAt),
      tags: [{ name: "category", value: "admission-enquiry" }],
    },
    {
      idempotencyKey: `admission-enquiry/${randomUUID()}`,
    },
  );

  if (error) {
    throw new Error(`Resend rejected the email: ${error.message}`);
  }

  return data;
}
