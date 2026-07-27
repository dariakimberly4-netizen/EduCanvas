"use client";

import Link from "next/link";

import { useSchoolContent } from "@/features/school/lib/content-store";

export function SchoolStory() {
  const { content } = useSchoolContent();
  const { landing } = content;
  return (
    <section className="school-section" id="school">
      <div className="shell school-layout">
        <div className="section-intro">
          <p className="overline">{landing.storyKicker}</p>
          <h2>{landing.schoolHeading}</h2>
          <p>{landing.schoolIntro}</p>
          <Link className="text-link" href="/faculty">{landing.schoolStoryAction} <span>→</span></Link>
        </div>
        <div className="principles">
          {landing.principles.map((principle) => (
            <article key={principle.marker}><span aria-hidden="true">{principle.marker}</span><div><h3>{principle.title}</h3><p>{principle.description}</p></div></article>
          ))}
        </div>
      </div>
    </section>
  );
}
