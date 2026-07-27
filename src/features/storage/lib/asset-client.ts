"use client";

import type {
  AssetKind,
  UploadedAsset,
} from "@/features/storage/domain/asset";

interface AssetApiResponse {
  ok: boolean;
  message?: string;
  asset?: UploadedAsset;
}

export async function uploadAsset(file: File, kind: AssetKind) {
  const formData = new FormData();
  formData.set("file", file);
  formData.set("kind", kind);

  const response = await fetch("/api/admin/files", {
    method: "POST",
    body: formData,
  });
  const result = (await response.json()) as AssetApiResponse;

  if (!response.ok || !result.ok || !result.asset) {
    throw new Error(result.message ?? "The file could not be uploaded.");
  }

  return result.asset;
}

export async function deleteAsset(fileId: string) {
  const response = await fetch(
    `/api/admin/files/${encodeURIComponent(fileId)}`,
    { method: "DELETE" },
  );

  if (!response.ok) {
    const result = (await response.json()) as AssetApiResponse;
    throw new Error(result.message ?? "The stored file could not be deleted.");
  }
}
