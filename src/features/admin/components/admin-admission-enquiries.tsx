"use client";

import { useEffect, useMemo, useState } from "react";

import { Input } from "@/components/ui/input";
import type {
  AdmissionDeliveryStatus,
  AdmissionEnquiryRecord,
} from "@/features/admissions/domain/admission-enquiry";
import { formatDateTime } from "@/lib/format";
import { getErrorMessage } from "@/lib/utils";

type DeliveryFilter = "all" | AdmissionDeliveryStatus;

interface AdmissionEnquiriesResponse {
  ok: boolean;
  message?: string;
  enquiries?: AdmissionEnquiryRecord[];
}

const statusLabels: Record<AdmissionDeliveryStatus, string> = {
  pending: "Sending",
  delivered: "Email sent",
  failed: "Email failed",
};

export function AdminAdmissionEnquiries() {
  const [enquiries, setEnquiries] = useState<AdmissionEnquiryRecord[]>([]);
  const [query, setQuery] = useState("");
  const [deliveryFilter, setDeliveryFilter] =
    useState<DeliveryFilter>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadEnquiries() {
      try {
        const response = await fetch("/api/admission-enquiries");
        const result = (await response.json()) as AdmissionEnquiriesResponse;

        if (!response.ok || !result.ok || !result.enquiries) {
          throw new Error(
            result.message ?? "Admission enquiries could not be loaded.",
          );
        }

        if (active) setEnquiries(result.enquiries);
      } catch (error) {
        if (active) {
          setErrorMessage(
            getErrorMessage(
              error,
              "Admission enquiries could not be loaded.",
            ),
          );
        }
      } finally {
        if (active) setIsLoading(false);
      }
    }

    void loadEnquiries();
    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return enquiries.filter((enquiry) => {
      const matchesQuery =
        !normalizedQuery ||
        `${enquiry.guardianName} ${enquiry.phone} ${enquiry.classLevel}`
          .toLowerCase()
          .includes(normalizedQuery);
      const matchesDelivery =
        deliveryFilter === "all" ||
        enquiry.deliveryStatus === deliveryFilter;
      return matchesQuery && matchesDelivery;
    });
  }, [deliveryFilter, enquiries, query]);

  return (
    <>
      <div className="workspace-heading">
        <div>
          <p className="overline">Admissions</p>
          <h2 id="enquiries-title">Admission enquiries</h2>
          <p>
            Review families who requested admission information through the
            public website.
          </p>
        </div>
        <span className="publish-badge">
          <i />
          {enquiries.length} total requests
        </span>
      </div>

      <div className="manager-toolbar">
        <label className="manager-search">
          <span>⌕</span>
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            type="search"
            placeholder="Search by parent, phone, or class"
          />
        </label>
        <label>
          Email status
          <select
            value={deliveryFilter}
            onChange={(event) =>
              setDeliveryFilter(event.target.value as DeliveryFilter)
            }
          >
            <option value="all">All requests</option>
            <option value="delivered">Email sent</option>
            <option value="failed">Email failed</option>
            <option value="pending">Sending</option>
          </select>
        </label>
        <p><strong>{filtered.length}</strong> requests shown</p>
      </div>

      <div className="data-panel">
        <div className="enquiry-manager-head">
          <span>Parent or guardian</span>
          <span>Phone</span>
          <span>Interested class</span>
          <span>Submitted</span>
          <span>Email status</span>
        </div>
        <div>
          {filtered.map((enquiry) => (
            <article className="enquiry-manager-row" key={enquiry.id}>
              <strong>{enquiry.guardianName}</strong>
              <a href={`tel:${enquiry.phone.replace(/[^+\d]/g, "")}`}>
                {enquiry.phone}
              </a>
              <span>{enquiry.classLevel}</span>
              <time dateTime={enquiry.submittedAt}>
                {formatDateTime(new Date(enquiry.submittedAt))}
              </time>
              <span>
                <i
                  className={`status-chip enquiry-${enquiry.deliveryStatus}`}
                >
                  {statusLabels[enquiry.deliveryStatus]}
                </i>
              </span>
            </article>
          ))}
        </div>
      </div>

      {isLoading && (
        <div className="empty-state">
          <span>↻</span>
          <h3>Loading admission enquiries</h3>
        </div>
      )}
      {!isLoading && errorMessage && (
        <div className="empty-state">
          <span>!</span>
          <h3>Enquiries unavailable</h3>
          <p>{errorMessage}</p>
        </div>
      )}
      {!isLoading && !errorMessage && !filtered.length && (
        <div className="empty-state">
          <span>□</span>
          <h3>No admission enquiries found</h3>
          <p>New requests from the public form will appear here.</p>
        </div>
      )}
    </>
  );
}
