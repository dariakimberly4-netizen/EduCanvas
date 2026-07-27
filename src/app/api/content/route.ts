import { NextResponse } from "next/server";

import { requireAdmin } from "@/features/auth/server/require-admin";
import { withDerivedActivity } from "@/features/school/server/content-activity";
import { isSchoolContent } from "@/features/school/server/content-validation";
import {
  getSchoolContent,
  saveSchoolContent,
} from "@/features/school/server/site-content-repository";
import { deleteUnreferencedContentAssets } from "@/features/storage/server/content-asset-cleanup";
import { MongoConfigurationError } from "@/lib/mongodb";
import { getErrorMessage } from "@/lib/utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return NextResponse.json({
      ok: true,
      content: await getSchoolContent(),
    });
  } catch {
    return NextResponse.json(
      { ok: false, message: "Website content is temporarily unavailable." },
      { status: 503 },
    );
  }
}

export async function PUT(request: Request) {
  const admin = await requireAdmin();

  if (!admin) {
    return NextResponse.json(
      { ok: false, message: "Administrator access is required." },
      { status: 401 },
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: "The content payload could not be read." },
      { status: 400 },
    );
  }

  if (!isSchoolContent(body)) {
    return NextResponse.json(
      { ok: false, message: "The website content is invalid." },
      { status: 422 },
    );
  }

  try {
    const previousContent = await getSchoolContent();
    const content = await saveSchoolContent(
      withDerivedActivity(previousContent, body),
      admin.email,
    );
    await deleteUnreferencedContentAssets(previousContent, content);
    return NextResponse.json({ ok: true, content });
  } catch (error) {
    if (error instanceof MongoConfigurationError) {
      return NextResponse.json(
        {
          ok: false,
          message:
            "MongoDB is not configured. Add MONGODB_URI before publishing.",
        },
        { status: 503 },
      );
    }

    console.error(
      "Website content persistence failed:",
      getErrorMessage(error),
    );
    return NextResponse.json(
      { ok: false, message: "The website changes could not be saved." },
      { status: 500 },
    );
  }
}
