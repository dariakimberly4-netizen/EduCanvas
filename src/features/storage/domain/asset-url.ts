export function resolveStoredAssetUrl(
  fileId: string | undefined,
  fallbackUrl: string,
  options: { download?: boolean } = {},
) {
  if (!fileId) {
    return fallbackUrl;
  }

  const path = `/api/assets/${encodeURIComponent(fileId)}`;
  return options.download ? `${path}?download=1` : path;
}
