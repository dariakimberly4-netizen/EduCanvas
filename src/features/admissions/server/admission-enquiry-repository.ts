import "server-only";

import { randomUUID } from "node:crypto";

import type { Collection } from "mongodb";

import type {
  AdmissionDeliveryStatus,
  AdmissionEnquiry,
  AdmissionEnquiryRecord,
} from "@/features/admissions/domain/admission-enquiry";
import { getMongoDatabase } from "@/lib/mongodb";

interface AdmissionEnquiryDocument extends Omit<AdmissionEnquiryRecord, "id"> {
  _id: string;
}

declare global {
  var educanvasE2eAdmissionEnquiries:
    | AdmissionEnquiryRecord[]
    | undefined;
}

function isE2eStoreEnabled() {
  return process.env.E2E_CONTENT_STORE === "memory";
}

function e2eStore() {
  globalThis.educanvasE2eAdmissionEnquiries ??= [];
  return globalThis.educanvasE2eAdmissionEnquiries;
}

async function getCollection(): Promise<Collection<AdmissionEnquiryDocument>> {
  const database = await getMongoDatabase();
  return database.collection<AdmissionEnquiryDocument>(
    "admission_enquiries",
  );
}

export async function createAdmissionEnquiry(
  enquiry: AdmissionEnquiry,
): Promise<AdmissionEnquiryRecord> {
  const record: AdmissionEnquiryRecord = {
    ...enquiry,
    id: randomUUID(),
    submittedAt: new Date().toISOString(),
    deliveryStatus: "pending",
  };

  if (isE2eStoreEnabled()) {
    e2eStore().unshift(record);
    return record;
  }

  const { id, ...document } = record;
  await (await getCollection()).insertOne({ _id: id, ...document });
  return record;
}

export async function updateAdmissionDeliveryStatus(
  id: string,
  deliveryStatus: AdmissionDeliveryStatus,
) {
  if (isE2eStoreEnabled()) {
    const record = e2eStore().find((item) => item.id === id);
    if (record) record.deliveryStatus = deliveryStatus;
    return;
  }

  await (await getCollection()).updateOne(
    { _id: id },
    { $set: { deliveryStatus } },
  );
}

export async function listAdmissionEnquiries(limit = 250) {
  if (isE2eStoreEnabled()) {
    return structuredClone(e2eStore().slice(0, limit));
  }

  const documents = await (await getCollection())
    .find()
    .sort({ submittedAt: -1 })
    .limit(limit)
    .toArray();

  return documents.map(({ _id, ...document }) => ({
    id: _id,
    ...document,
  }));
}

export function resetE2eAdmissionEnquiries() {
  if (isE2eStoreEnabled()) {
    globalThis.educanvasE2eAdmissionEnquiries = [];
  }
}
