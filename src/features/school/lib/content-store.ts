"use client";

import { useCallback, useSyncExternalStore } from "react";

import { cloneSchoolContent, defaultSchoolContent } from "@/features/school/data/default-content";
import type { SchoolContent } from "@/features/school/domain/types";

const STORAGE_KEY = "shaplaGrovePrototype";
const CONTENT_UPDATED_EVENT = "shapla-grove-content-updated";
let cachedStorageValue: string | null | undefined;
let cachedContent = defaultSchoolContent;

function isSchoolContent(value: unknown): value is SchoolContent {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<SchoolContent>;
  return Boolean(candidate.landing && Array.isArray(candidate.faculty) && Array.isArray(candidate.documents));
}

export function readSchoolContent(): SchoolContent {
  if (typeof window === "undefined") return defaultSchoolContent;

  try {
    const storageValue = window.localStorage.getItem(STORAGE_KEY);
    if (storageValue === cachedStorageValue) return cachedContent;
    const saved = JSON.parse(storageValue ?? "null");
    cachedStorageValue = storageValue;
    if (!isSchoolContent(saved)) {
      cachedContent = defaultSchoolContent;
      return cachedContent;
    }
    cachedContent = {
      ...cloneSchoolContent(defaultSchoolContent),
      ...saved,
      heroSlides: saved.heroSlides?.length ? saved.heroSlides : cloneSchoolContent(defaultSchoolContent).heroSlides,
    };
    return cachedContent;
  } catch {
    cachedContent = defaultSchoolContent;
    return cachedContent;
  }
}

export function writeSchoolContent(content: SchoolContent) {
  const serialized = JSON.stringify(content);
  window.localStorage.setItem(STORAGE_KEY, serialized);
  cachedStorageValue = serialized;
  cachedContent = content;
  window.dispatchEvent(new CustomEvent(CONTENT_UPDATED_EVENT));
}

export function resetSchoolContent() {
  window.localStorage.removeItem(STORAGE_KEY);
  cachedStorageValue = null;
  cachedContent = defaultSchoolContent;
  window.dispatchEvent(new CustomEvent(CONTENT_UPDATED_EVENT));
}

function subscribeToSchoolContent(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(CONTENT_UPDATED_EVENT, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(CONTENT_UPDATED_EVENT, onStoreChange);
  };
}

export function useSchoolContent() {
  const content = useSyncExternalStore(subscribeToSchoolContent, readSchoolContent, () => defaultSchoolContent);

  const updateContent = useCallback((next: SchoolContent) => {
    writeSchoolContent(next);
  }, []);

  return { content, updateContent, refresh: () => window.dispatchEvent(new CustomEvent(CONTENT_UPDATED_EVENT)) };
}
