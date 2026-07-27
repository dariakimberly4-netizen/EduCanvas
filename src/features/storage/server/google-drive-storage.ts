import "server-only";

import { Readable } from "node:stream";

import { google } from "googleapis";

const DRIVE_SCOPE = "https://www.googleapis.com/auth/drive";

export interface StoredAsset {
  fileId: string;
}

export interface DownloadedAsset {
  buffer: Buffer;
  fileName: string;
  mimeType: string;
}

export class GoogleDriveAssetNotFoundError extends Error {
  constructor() {
    super("The requested Google Drive asset was not found.");
    this.name = "GoogleDriveAssetNotFoundError";
  }
}

export class GoogleDriveConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GoogleDriveConfigurationError";
  }
}

function getDriveConfiguration() {
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL?.trim();
  const privateKey = process.env.GOOGLE_PRIVATE_KEY
    ?.replace(/\\n/g, "\n")
    .trim();
  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID?.trim();

  if (!clientEmail || !privateKey || !folderId) {
    throw new GoogleDriveConfigurationError(
      "GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY, and GOOGLE_DRIVE_FOLDER_ID must be configured.",
    );
  }

  return { clientEmail, privateKey, folderId };
}

function createDriveClient(clientEmail: string, privateKey: string) {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: clientEmail,
      private_key: privateKey,
    },
    scopes: [DRIVE_SCOPE],
  });

  return google.drive({ version: "v3", auth });
}

function sanitizeFileName(fileName: string) {
  return fileName
    .normalize("NFKC")
    .replace(/[^\p{L}\p{N}._ -]/gu, "-")
    .slice(0, 160);
}

export async function uploadAssetToGoogleDrive(
  file: File,
): Promise<StoredAsset> {
  const { clientEmail, privateKey, folderId } = getDriveConfiguration();
  const drive = createDriveClient(clientEmail, privateKey);
  const buffer = Buffer.from(await file.arrayBuffer());
  const response = await drive.files.create({
    requestBody: {
      name: `${Date.now()}-${sanitizeFileName(file.name)}`,
      mimeType: file.type,
      parents: [folderId],
    },
    media: {
      mimeType: file.type,
      body: Readable.from(buffer),
    },
    fields: "id",
    supportsAllDrives: true,
  });
  const fileId = response.data.id;

  if (!fileId) {
    throw new Error("Google Drive did not return a file ID.");
  }

  return { fileId };
}

export async function deleteAssetFromGoogleDrive(fileId: string) {
  const { clientEmail, privateKey, folderId } = getDriveConfiguration();
  const drive = createDriveClient(clientEmail, privateKey);

  try {
    const metadata = await drive.files.get({
      fileId,
      fields: "id,parents,trashed",
      supportsAllDrives: true,
    });

    if (!metadata.data.parents?.includes(folderId)) {
      throw new GoogleDriveAssetNotFoundError();
    }
  } catch (error) {
    const status = (
      error as { response?: { status?: number }; code?: number }
    )?.response?.status ?? (
      error as { response?: { status?: number }; code?: number }
    )?.code;

    if (status === 404) return;
    throw error;
  }

  await drive.files.delete({
    fileId,
    supportsAllDrives: true,
  });
}

export async function downloadAssetFromGoogleDrive(
  fileId: string,
): Promise<DownloadedAsset> {
  const { clientEmail, privateKey, folderId } = getDriveConfiguration();
  const drive = createDriveClient(clientEmail, privateKey);
  const metadata = await drive.files.get({
    fileId,
    fields: "id,name,mimeType,parents,trashed",
    supportsAllDrives: true,
  });

  if (
    metadata.data.trashed ||
    !metadata.data.parents?.includes(folderId)
  ) {
    throw new GoogleDriveAssetNotFoundError();
  }

  const response = await drive.files.get(
    {
      fileId,
      alt: "media",
      supportsAllDrives: true,
    },
    { responseType: "arraybuffer" },
  );

  return {
    buffer: Buffer.from(response.data as ArrayBuffer),
    fileName: metadata.data.name ?? "educanvas-asset",
    mimeType: metadata.data.mimeType ?? "application/octet-stream",
  };
}
