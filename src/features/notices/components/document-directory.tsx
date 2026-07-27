"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import type { DocumentType, SchoolDocument } from "@/features/school/domain/types";
import { useSchoolContent } from "@/features/school/lib/content-store";
import { resolveStoredAssetUrl } from "@/features/storage/domain/asset-url";
import { getIsoDateParts } from "@/lib/format";

const academicYears = [
  { value: "all", label: "All years" },
  { value: "2026", label: "2026–27" },
  { value: "2025", label: "2025–26" },
];

function DocumentRow({ document, featured = false }: { document: SchoolDocument; featured?: boolean }) {
  const date = getIsoDateParts(document.date);
  return (
    <article className={`document${featured ? " featured" : ""}`}>
      <time dateTime={document.date}><strong>{date.day}</strong>{date.month} {date.year}</time>
      <div>
        <span className={`doc-tag${document.type === "Result" ? " result-tag" : ""}`}>{document.category === "Academic result" ? "Result" : document.category}</span>
        <h3>{document.title}</h3>
        <p>{document.type === "Result" ? `Academic year ${document.academicYear ?? "2026–27"}` : `Published by ${document.publisher ?? "Academic Office"}`} · PDF · {document.fileSize ?? document.fileName}</p>
      </div>
      <Link
        href={
          document.fileUrl
            ? resolveStoredAssetUrl(
                document.storageFileId,
                document.fileUrl,
                { download: true },
              )
            : "#"
        }
        onClick={document.fileUrl ? undefined : (event) => event.preventDefault()}
        target={document.fileUrl ? "_blank" : undefined}
        rel={document.fileUrl ? "noopener noreferrer" : undefined}
        aria-label={`Download ${document.title}`}
      >
        <span>PDF</span>↓
      </Link>
    </article>
  );
}

export function DocumentDirectory() {
  const { content } = useSchoolContent();
  const [query, setQuery] = useState("");
  const [year, setYear] = useState("all");
  const [activeTab, setActiveTab] = useState<DocumentType>("Notice");

  const published = useMemo(() => content.documents.filter((document) => document.status === "Published"), [content.documents]);
  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return published.filter((document) => {
      const matchesQuery = !normalizedQuery || `${document.title} ${document.category}`.toLowerCase().includes(normalizedQuery);
      const itemYear = document.academicYear?.slice(0, 4) ?? document.date.slice(0, 4);
      const matchesYear = year === "all" || itemYear === year;
      return matchesQuery && matchesYear;
    });
  }, [published, query, year]);

  const notices = filtered.filter((document) => document.type === "Notice");
  const results = filtered.filter((document) => document.type === "Result");
  const empty = filtered.length === 0;

  function clearFilters() {
    setQuery("");
    setYear("all");
  }

  return (
    <section className="documents-section">
      <div className="doc-tabs">
        {(["Notice", "Result"] as const).map((type) => (
          <Link
            className={activeTab === type ? "active" : undefined}
            href={type === "Notice" ? "#notices" : "#results"}
            onClick={() => setActiveTab(type)}
            key={type}
          >
            {type === "Notice" ? "Notices" : "Results"} <span>{String(published.filter((document) => document.type === type).length).padStart(2, "0")}</span>
          </Link>
        ))}
        <label className="search-box">
          <Search aria-hidden="true" size={17} />
          <span className="sr-only">Search documents</span>
          <Input value={query} onChange={(event) => setQuery(event.target.value)} type="search" placeholder="Search by title or category…" autoComplete="off" />
        </label>
      </div>

      {notices.length > 0 && (
        <div className="document-list" id="notices">
          <div className="list-heading">
            <div><p className="eyebrow">Latest updates</p><h2>Notices</h2></div>
            <label>Academic year
              <select value={year} onChange={(event) => setYear(event.target.value)}>
                {academicYears.map((item) => <option value={item.value} key={item.value}>{item.label}</option>)}
              </select>
            </label>
          </div>
          {notices.map((document, index) => <DocumentRow document={document} featured={index === 0} key={document.id} />)}
        </div>
      )}

      {results.length > 0 && (
        <div className="document-list results-list" id="results">
          <div className="list-heading"><div><p className="eyebrow">Academic records</p><h2>Results</h2></div><p>Results are published as verified PDF documents.</p></div>
          {results.map((document) => <DocumentRow document={document} key={document.id} />)}
        </div>
      )}

      {empty && (
        <div className="document-empty" id="document-empty">
          <span aria-hidden="true">⌕</span><h2>No documents found</h2><p>Try a different title, category, or academic year.</p>
          <button type="button" onClick={clearFilters}>Clear filters</button>
        </div>
      )}
    </section>
  );
}
