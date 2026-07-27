"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface FilePreview {
  fileName: string;
  mimeType: string;
  url: string;
}

export function useFilePreview() {
  const [preview, setPreview] = useState<FilePreview | null>(null);
  const objectUrlRef = useRef<string | null>(null);

  const clearPreview = useCallback(() => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    setPreview(null);
  }, []);

  const selectFile = useCallback(
    (file: File | null) => {
      clearPreview();

      if (!file) {
        return;
      }

      const url = URL.createObjectURL(file);
      objectUrlRef.current = url;
      setPreview({
        fileName: file.name,
        mimeType: file.type,
        url,
      });
    },
    [clearPreview],
  );

  useEffect(() => clearPreview, [clearPreview]);

  return { preview, selectFile, clearPreview };
}
