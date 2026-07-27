"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

import type { FacultyMember } from "@/features/school/domain/types";
import { useSchoolContent } from "@/features/school/lib/content-store";
import { resolveStoredAssetUrl } from "@/features/storage/domain/asset-url";
import { getInitials } from "@/lib/format";

type FacultyArea = "all" | "primary" | "science" | "humanities";

const filters: { label: string; value: FacultyArea }[] = [
  { label: "All", value: "all" },
  { label: "Primary", value: "primary" },
  { label: "Science", value: "science" },
  { label: "Humanities", value: "humanities" },
];

function getFacultyArea(profile: FacultyMember): Exclude<FacultyArea, "all"> {
  const searchable = `${profile.department} ${profile.role} ${profile.subject}`.toLowerCase();
  if (/primary|early/.test(searchable)) return "primary";
  if (/humanities|languages|creative arts|social science/.test(searchable)) return "humanities";
  if (/science|physics|chemistry|biology|math/.test(searchable)) return "science";
  return "humanities";
}

export function FacultyDirectory() {
  const { content } = useSchoolContent();
  const [filter, setFilter] = useState<FacultyArea>("all");
  const profiles = useMemo(
    () => content.faculty.filter((profile) => profile.status === "Published" && (filter === "all" || getFacultyArea(profile) === filter)),
    [content.faculty, filter],
  );

  return (
    <section className="faculty-section">
      <div className="filter-bar">
        <div><p className="eyebrow">Across every stage</p><h2>Our teaching team</h2><span id="faculty-count">{profiles.length} {profiles.length === 1 ? "member" : "members"}</span></div>
        <div className="faculty-filters" role="group" aria-label="Filter faculty by area">
          {filters.map((item) => (
            <button
              className={filter === item.value ? "filter-active" : undefined}
              type="button"
              aria-pressed={filter === item.value}
              onClick={() => setFilter(item.value)}
              key={item.value}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
      <div className="faculty-grid" id="public-faculty-grid">
        {profiles.map((profile, index) => (
          <article data-faculty-area={getFacultyArea(profile)} key={profile.id}>
            <div className={`portrait tone-${(index % 6) + 1}${profile.imageUrl ? " has-image" : ""}`}>
              {profile.imageUrl ? (
                <Image
                  src={resolveStoredAssetUrl(
                    profile.imageStorageFileId,
                    profile.imageUrl,
                  )}
                  alt={`${profile.name}, ${profile.role}`}
                  fill
                  sizes="(max-width: 700px) 50vw, (max-width: 1020px) 33vw, 25vw"
                  unoptimized
                />
              ) : (
                <span>{getInitials(profile.name)}</span>
              )}
            </div>
            <h2>{profile.name}</h2><p>{profile.role}</p><small>{profile.subject} · {profile.experience} years</small>
          </article>
        ))}
      </div>
    </section>
  );
}
