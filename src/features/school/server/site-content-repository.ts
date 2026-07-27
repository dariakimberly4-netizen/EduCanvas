import "server-only";

import type { Collection } from "mongodb";
import { cookies } from "next/headers";

import { activeSiteTheme, type SiteThemeId } from "@/config/site-theme";
import {
  cloneSchoolContent,
  defaultSchoolContent,
  normalizeSchoolContent,
} from "@/features/school/data/default-content";
import type { SchoolContent } from "@/features/school/domain/types";
import {
  getMongoDatabase,
  MongoConfigurationError,
} from "@/lib/mongodb";

interface SiteContentDocument {
  _id: SiteThemeId;
  content: SchoolContent;
  version: number;
  updatedAt: Date;
  updatedBy: string;
}

declare global {
  var educanvasE2eContent:
    | Map<string, SchoolContent>
    | undefined;
}

function e2eStore() {
  globalThis.educanvasE2eContent ??= new Map<string, SchoolContent>();
  return globalThis.educanvasE2eContent;
}

async function getE2eNamespace() {
  if (process.env.E2E_CONTENT_STORE !== "memory") {
    return null;
  }

  const cookieStore = await cookies();
  const expectedToken = process.env.E2E_AUTH_BYPASS_TOKEN;
  const suppliedToken = cookieStore.get("e2e-admin-session")?.value;
  const isAdminFixture =
    Boolean(expectedToken) &&
    expectedToken === suppliedToken;

  return isAdminFixture ? "admin-fixture" : "public-fixture";
}

async function getCollection(): Promise<Collection<SiteContentDocument>> {
  const database = await getMongoDatabase();
  return database.collection<SiteContentDocument>("site_content");
}

export async function getSchoolContent(): Promise<SchoolContent> {
  const namespace = await getE2eNamespace();

  if (namespace) {
    return cloneSchoolContent(normalizeSchoolContent(
      e2eStore().get(namespace) ?? defaultSchoolContent,
    ));
  }

  try {
    const document = await (await getCollection()).findOne({
      _id: activeSiteTheme,
    });
    return cloneSchoolContent(normalizeSchoolContent(
      document?.content ?? defaultSchoolContent,
    ));
  } catch (error) {
    if (error instanceof MongoConfigurationError) {
      return cloneSchoolContent(defaultSchoolContent);
    }
    throw error;
  }
}

export async function saveSchoolContent(
  content: SchoolContent,
  updatedBy: string,
): Promise<SchoolContent> {
  const normalized = cloneSchoolContent(normalizeSchoolContent(content));
  const namespace = await getE2eNamespace();

  if (namespace) {
    e2eStore().set(namespace, normalized);
    return cloneSchoolContent(normalized);
  }

  await (await getCollection()).updateOne(
    { _id: activeSiteTheme },
    {
      $set: {
        content: normalized,
        updatedAt: new Date(),
        updatedBy,
      },
      $inc: { version: 1 },
    },
    { upsert: true },
  );

  return normalized;
}

export async function resetE2eSchoolContent() {
  const namespace = await getE2eNamespace();

  if (!namespace) {
    throw new Error("The E2E content store is not enabled.");
  }

  const content = cloneSchoolContent(defaultSchoolContent);
  e2eStore().set(namespace, content);
  return content;
}
