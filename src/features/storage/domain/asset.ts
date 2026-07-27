export type AssetKind = "image" | "document";

export interface UploadedAsset {
  fileId: string;
  previewUrl: string;
  directUrl: string;
  fileName: string;
  fileSize: string;
}

export function formatFileSize(bytes: number) {
  if (bytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
