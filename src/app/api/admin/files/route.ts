import { randomUUID } from "node:crypto";

import { NextResponse } from "next/server";

import { requireAdmin } from "@/features/auth/server/require-admin";
import {
  formatFileSize,
  type AssetKind,
} from "@/features/storage/domain/asset";
import {
  GoogleDriveConfigurationError,
  uploadAssetToGoogleDrive,
} from "@/features/storage/server/google-drive-storage";

export const runtime = "nodejs";

const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);
const IMAGE_LIMIT = 8 * 1024 * 1024;
const DOCUMENT_LIMIT = 10 * 1024 * 1024;

function validateFile(file: File, kind: AssetKind) {
  if (kind === "image") {
    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      return "Choose a JPG, PNG, or WebP image.";
    }
    if (file.size > IMAGE_LIMIT) {
      return "Images must be no larger than 8 MB.";
    }
    return null;
  }

  if (file.type !== "application/pdf") {
    return "Choose a PDF document.";
  }
  if (file.size > DOCUMENT_LIMIT) {
    return "PDF documents must be no larger than 10 MB.";
  }
  return null;
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json(
      { ok: false, message: "Administrator access is required." },
      { status: 401 },
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const kind = formData.get("kind");

  if (
    !(file instanceof File) ||
    (kind !== "image" && kind !== "document")
  ) {
    return NextResponse.json(
      { ok: false, message: "A valid file and asset type are required." },
      { status: 400 },
    );
  }

  const validationError = validateFile(file, kind);

  if (validationError) {
    return NextResponse.json(
      { ok: false, message: validationError },
      { status: 422 },
    );
  }

  if (process.env.E2E_CONTENT_STORE === "memory") {
    const fileId = `e2e-${randomUUID()}`;
    const directUrl = `/api/assets/${fileId}`;
    return NextResponse.json({
      ok: true,
      asset: {
        fileId,
        previewUrl: directUrl,
        directUrl:
          kind === "document" ? `${directUrl}?download=1` : directUrl,
        fileName: file.name,
        fileSize: formatFileSize(file.size),
      },
    });
  }

  try {
    const uploaded = await uploadAssetToGoogleDrive(file);
    const directUrl = `/api/assets/${uploaded.fileId}`;
    return NextResponse.json({
      ok: true,
      asset: {
        fileId: uploaded.fileId,
        previewUrl: directUrl,
        directUrl:
          kind === "document" ? `${directUrl}?download=1` : directUrl,
        fileName: file.name,
        fileSize: formatFileSize(file.size),
      },
    });
  } catch (error) {
    const message =
      error instanceof GoogleDriveConfigurationError
        ? "Google Drive storage is not configured."
        : "The file could not be uploaded to Google Drive.";
    console.error(
      "Google Drive upload failed:",
      error instanceof Error ? error.message : "Unknown error",
    );
    return NextResponse.json(
      { ok: false, message },
      { status: error instanceof GoogleDriveConfigurationError ? 503 : 502 },
    );
  }
}
