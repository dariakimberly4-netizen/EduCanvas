"use client";

import Link from "next/link";

import { useSchoolContent } from "@/features/school/lib/content-store";

const principles = [
  { marker: "A", title: "Strong academic foundations", description: "National curriculum teaching supported by laboratories, technology, language practice, and regular feedback." },
  { marker: "B", title: "Every student is known", description: "An 18:1 student–teacher ratio helps teachers identify strengths, provide support, and keep families informed." },
  { marker: "C", title: "Character beyond the classroom", description: "Clubs, sport, arts, leadership, and service help students become responsible and confident young people." },
];

export function SchoolStory() {
  const { content } = useSchoolContent();
  return (
    <section className="school-section" id="school">
      <div className="shell school-layout">
        <div className="section-intro">
          <p className="overline">Why Shapla Grove</p>
          <h2>{content.landing.schoolHeading}</h2>
          <p>{content.landing.schoolIntro}</p>
          <Link className="text-link" href="/faculty">Meet the educators behind our approach <span>→</span></Link>
        </div>
        <div className="principles">
          {principles.map((principle) => (
            <article key={principle.marker}><span aria-hidden="true">{principle.marker}</span><div><h3>{principle.title}</h3><p>{principle.description}</p></div></article>
          ))}
        </div>
      </div>
    </section>
  );
}
