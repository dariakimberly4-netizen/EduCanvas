"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { SchoolContent } from "@/features/school/domain/types";

interface ContentApiResponse {
  ok: boolean;
  message?: string;
  content?: SchoolContent;
}

interface SchoolContentContextValue {
  content: SchoolContent;
  isSaving: boolean;
  updateContent: (next: SchoolContent) => Promise<void>;
}

const SchoolContentContext =
  createContext<SchoolContentContextValue | null>(null);

export function SchoolContentProvider({
  children,
  initialContent,
}: {
  children: ReactNode;
  initialContent: SchoolContent;
}) {
  const [content, setContent] = useState(initialContent);
  const [isSaving, setIsSaving] = useState(false);

  const updateContent = useCallback(async (next: SchoolContent) => {
    setIsSaving(true);

    try {
      const response = await fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(next),
      });
      const result = (await response.json()) as ContentApiResponse;

      if (!response.ok || !result.ok || !result.content) {
        throw new Error(
          result.message ?? "The website changes could not be saved.",
        );
      }

      setContent(result.content);
    } finally {
      setIsSaving(false);
    }
  }, []);

  const value = useMemo(
    () => ({ content, isSaving, updateContent }),
    [content, isSaving, updateContent],
  );

  return (
    <SchoolContentContext.Provider value={value}>
      {children}
    </SchoolContentContext.Provider>
  );
}

export function useSchoolContent() {
  const context = useContext(SchoolContentContext);

  if (!context) {
    throw new Error(
      "useSchoolContent must be used within SchoolContentProvider.",
    );
  }

  return context;
}
