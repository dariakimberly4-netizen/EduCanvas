import "server-only";

import type { SchoolContent } from "@/features/school/domain/types";
import { deleteAssetFromGoogleDrive } from "@/features/storage/server/google-drive-storage";

function collectStoredAssetIds(content: SchoolContent) {
  return new Set([
    ...content.heroSlides.map((slide) => slide.storageFileId),
    ...content.faculty.map((member) => member.imageStorageFileId),
    ...content.documents.map((document) => document.storageFileId),
  ].filter((fileId): fileId is string => Boolean(fileId)));
}

async function deleteWithRetry(fileId: string, attempts = 3) {
  let lastError: unknown;

  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      await deleteAssetFromGoogleDrive(fileId);
      return;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError;
}

export async function deleteUnreferencedContentAssets(
  previous: SchoolContent,
  next: SchoolContent,
) {
  if (process.env.E2E_CONTENT_STORE === "memory") return;

  const previousIds = collectStoredAssetIds(previous);
  const nextIds = collectStoredAssetIds(next);
  const removedIds = [...previousIds].filter((fileId) => !nextIds.has(fileId));
  const results = await Promise.allSettled(
    removedIds.map((fileId) => deleteWithRetry(fileId)),
  );

  results.forEach((result, index) => {
    if (result.status === "rejected") {
      console.error(
        `Google Drive cleanup failed for ${removedIds[index]}:`,
        result.reason instanceof Error ? result.reason.message : "Unknown error",
      );
    }
  });
}
