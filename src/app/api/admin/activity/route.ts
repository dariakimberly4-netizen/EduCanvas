import { NextResponse } from "next/server";

import { requireAdmin } from "@/features/auth/server/require-admin";
import { recordAuthenticationActivity } from "@/features/school/server/activity-repository";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const admin = await requireAdmin();

  if (!admin) {
    return NextResponse.json(
      { ok: false, message: "Administrator access is required." },
      { status: 401 },
    );
  }

  const body = await request.json().catch(() => null) as {
    event?: unknown;
  } | null;

  if (body?.event !== "sign-out") {
    return NextResponse.json(
      { ok: false, message: "The activity type is invalid." },
      { status: 422 },
    );
  }

  try {
    await recordAuthenticationActivity({
      action: "Administrator signed out",
      email: admin.email,
      name: admin.name,
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(
      "Sign-out activity could not be recorded:",
      error instanceof Error ? error.message : "Unknown error",
    );
    return NextResponse.json(
      { ok: false, message: "The sign-out activity could not be recorded." },
      { status: 500 },
    );
  }
}
