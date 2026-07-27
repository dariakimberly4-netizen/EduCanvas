import { timingSafeEqual } from "node:crypto";

import { NextResponse } from "next/server";

import { parseAdmissionEnquiry } from "@/features/admissions/domain/admission-enquiry";
import {
  AdmissionEmailConfigurationError,
  sendAdmissionEnquiry,
} from "@/features/admissions/server/send-admission-enquiry";

export const runtime = "nodejs";

function isE2eDeliveryBypassed(request: Request) {
  const expected = process.env.E2E_EMAIL_BYPASS_TOKEN;
  const supplied = request.headers.get("x-e2e-email-token");

  if (!expected || expected.length < 32 || !supplied) {
    return false;
  }

  const expectedBuffer = Buffer.from(expected);
  const suppliedBuffer = Buffer.from(supplied);

  return (
    expectedBuffer.length === suppliedBuffer.length &&
    timingSafeEqual(expectedBuffer, suppliedBuffer)
  );
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: "The submitted form could not be read." },
      { status: 400 },
    );
  }

  const parsed = parseAdmissionEnquiry(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        message: "Check the highlighted information and try again.",
        fieldErrors: parsed.fieldErrors,
      },
      { status: 422 },
    );
  }

  if (parsed.isSpam) {
    return NextResponse.json({ ok: true });
  }

  try {
    await sendAdmissionEnquiry(parsed.data, {
      skipDelivery: isE2eDeliveryBypassed(request),
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof AdmissionEmailConfigurationError) {
      console.error("Admission email is not configured:", error.message);
      return NextResponse.json(
        {
          ok: false,
          message:
            "Admissions email is temporarily unavailable. Please call the school office.",
        },
        { status: 503 },
      );
    }

    console.error(
      "Admission email delivery failed:",
      error instanceof Error ? error.message : "Unknown error",
    );
    return NextResponse.json(
      {
        ok: false,
        message:
          "We could not send your enquiry right now. Please try again shortly.",
      },
      { status: 502 },
    );
  }
}
