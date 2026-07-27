import { NextResponse } from "next/server";

import { requireAdmin } from "@/features/auth/server/require-admin";
import {
  GoogleDriveConfigurationError,
  deleteAssetFromGoogleDrive,
} from "@/features/storage/server/google-drive-storage";
import { getErrorMessage } from "@/lib/utils";

export const runtime = "nodejs";

const DRIVE_FILE_ID = /^[a-zA-Z0-9_-]{10,200}$/;

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ fileId: string }> },
) {
  if (!(await requireAdmin())) {
    return NextResponse.json(
      { ok: false, message: "Administrator access is required." },
      { status: 401 },
    );
  }

  const { fileId } = await params;

  if (!DRIVE_FILE_ID.test(fileId)) {
    return NextResponse.json(
      { ok: false, message: "The Google Drive file ID is invalid." },
      { status: 400 },
    );
  }

  if (process.env.E2E_CONTENT_STORE === "memory") {
    return NextResponse.json({ ok: true });
  }

  try {
    await deleteAssetFromGoogleDrive(fileId);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(
      "Google Drive deletion failed:",
      getErrorMessage(error),
    );
    return NextResponse.json(
      {
        ok: false,
        message:
          error instanceof GoogleDriveConfigurationError
            ? "Google Drive storage is not configured."
            : "The stored file could not be deleted.",
      },
      { status: 502 },
    );
  }
}
