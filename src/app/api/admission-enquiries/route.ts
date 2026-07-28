import { timingSafeEqual } from "node:crypto";

import { NextResponse } from "next/server";

import { parseAdmissionEnquiry } from "@/features/admissions/domain/admission-enquiry";
import {
  createAdmissionEnquiry,
  listAdmissionEnquiries,
  updateAdmissionDeliveryStatus,
} from "@/features/admissions/server/admission-enquiry-repository";
import {
  AdmissionEmailConfigurationError,
  sendAdmissionEnquiry,
} from "@/features/admissions/server/send-admission-enquiry";
import { requireAdmin } from "@/features/auth/server/require-admin";
import { getSchoolContent } from "@/features/school/server/site-content-repository";
import { MongoConfigurationError } from "@/lib/mongodb";
import { getErrorMessage } from "@/lib/utils";

export const runtime = "nodejs";

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json(
      { ok: false, message: "Administrator access is required." },
      { status: 401 },
    );
  }

  try {
    return NextResponse.json({
      ok: true,
      enquiries: await listAdmissionEnquiries(),
    });
  } catch (error) {
    console.error("Admission enquiries could not be loaded:", getErrorMessage(error));
    return NextResponse.json(
      { ok: false, message: "Admission enquiries are temporarily unavailable." },
      { status: error instanceof MongoConfigurationError ? 503 : 500 },
    );
  }
}

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

  const schoolContent = await getSchoolContent();
  const parsed = parseAdmissionEnquiry(
    body,
    schoolContent.landing.classLevels,
  );

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

  let enquiryRecord;

  try {
    enquiryRecord = await createAdmissionEnquiry(parsed.data);
  } catch (error) {
    console.error("Admission enquiry could not be stored:", getErrorMessage(error));
    return NextResponse.json(
      {
        ok: false,
        message:
          "We could not save your enquiry right now. Please call the school office.",
      },
      { status: error instanceof MongoConfigurationError ? 503 : 500 },
    );
  }

  try {
    await sendAdmissionEnquiry(parsed.data, {
      skipDelivery: isE2eDeliveryBypassed(request),
    });
    await updateAdmissionDeliveryStatus(enquiryRecord.id, "delivered");
    return NextResponse.json({ ok: true });
  } catch (error) {
    await updateAdmissionDeliveryStatus(
      enquiryRecord.id,
      "failed",
    ).catch((statusError) => {
      console.error(
        "Admission delivery status could not be updated:",
        getErrorMessage(statusError),
      );
    });

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
      getErrorMessage(error),
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
