import { NextResponse } from "next/server";

import { resetE2eAdmissionEnquiries } from "@/features/admissions/server/admission-enquiry-repository";
import { requireAdmin } from "@/features/auth/server/require-admin";
import { resetE2eSchoolContent } from "@/features/school/server/site-content-repository";

export const runtime = "nodejs";

export async function POST() {
  if (process.env.E2E_CONTENT_STORE !== "memory") {
    return new NextResponse(null, { status: 404 });
  }

  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  resetE2eAdmissionEnquiries();

  return NextResponse.json({
    ok: true,
    content: await resetE2eSchoolContent(),
  });
}
