import { NextResponse } from "next/server";

import {
  downloadAssetFromGoogleDrive,
  GoogleDriveAssetNotFoundError,
} from "@/features/storage/server/google-drive-storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DRIVE_FILE_ID = /^[a-zA-Z0-9_-]{10,200}$/;

function contentDisposition(fileName: string, download: boolean) {
  const disposition = download ? "attachment" : "inline";
  const encodedName = encodeURIComponent(fileName);
  return `${disposition}; filename*=UTF-8''${encodedName}`;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ fileId: string }> },
) {
  const { fileId } = await params;

  if (!DRIVE_FILE_ID.test(fileId)) {
    return NextResponse.json(
      { ok: false, message: "The asset ID is invalid." },
      { status: 400 },
    );
  }

  if (
    process.env.E2E_CONTENT_STORE === "memory" &&
    fileId.startsWith("e2e-")
  ) {
    const download =
      new URL(request.url).searchParams.get("download") === "1";
    const fixture = download
      ? Buffer.from("%PDF-1.4 EduCanvas E2E fixture")
      : Buffer.from(
          "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
          "base64",
        );
    const body = Uint8Array.from(fixture).buffer;

    return new NextResponse(body, {
      headers: {
        "Content-Disposition": download
          ? "attachment; filename=educanvas-e2e.pdf"
          : "inline",
        "Content-Type": download ? "application/pdf" : "image/png",
      },
    });
  }

  try {
    const asset = await downloadAssetFromGoogleDrive(fileId);
    const download = new URL(request.url).searchParams.get("download") === "1";
    const body = Uint8Array.from(asset.buffer).buffer;

    return new NextResponse(body, {
      headers: {
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
        "Content-Disposition": contentDisposition(asset.fileName, download),
        "Content-Length": String(body.byteLength),
        "Content-Type": asset.mimeType,
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    if (error instanceof GoogleDriveAssetNotFoundError) {
      return NextResponse.json(
        { ok: false, message: "The requested asset was not found." },
        { status: 404 },
      );
    }

    console.error(
      "Google Drive asset delivery failed:",
      error instanceof Error ? error.message : "Unknown error",
    );
    return NextResponse.json(
      { ok: false, message: "The requested asset is temporarily unavailable." },
      { status: 502 },
    );
  }
}
