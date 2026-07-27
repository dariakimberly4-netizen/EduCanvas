import Link from "next/link";

import { StructuredData } from "@/components/seo/structured-data";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { AdmissionInquiry } from "@/features/home/components/admission-inquiry";
import { HomeHero } from "@/features/home/components/home-hero";
import { SchoolStory } from "@/features/home/components/school-story";
import { SchoolContentProvider } from "@/features/school/lib/content-store";
import { getSchoolContent } from "@/features/school/server/site-content-repository";
import { generatePageMetadata } from "@/lib/seo/metadata";
import {
  buildEducationalOrganizationSchema,
  buildWebPageSchema,
  buildWebSiteSchema,
} from "@/lib/seo/structured-data";

export const metadata = generatePageMetadata("home");
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const content = await getSchoolContent();
  const { landing } = content;
  const taskLinks = ["#admissions", "/notices", "/notices#results", "/faculty"];
  const updates = content.documents
    .filter((document) => document.status === "Published")
    .toSorted((first, second) => second.date.localeCompare(first.date))
    .slice(0, 3)
    .map((document) => {
      const date = new Date(`${document.date}T00:00:00`);
      return {
        date: document.date,
        day: String(date.getDate()).padStart(2, "0"),
        month: date.toLocaleString("en-GB", { month: "short" }),
        category:
          document.type === "Result" ? "Results" : document.category,
        title: document.title,
        meta: `PDF · ${document.fileSize ?? document.fileName}`,
        href: document.type === "Result" ? "/notices#results" : "/notices",
      };
    });

  return (
    <SchoolContentProvider initialContent={content}>
      <StructuredData
        data={[
          buildWebSiteSchema(),
          buildEducationalOrganizationSchema(),
          buildWebPageSchema("home"),
        ]}
      />
      <SiteHeader active="home" />
      <main id="main">
        <HomeHero />

        <section className="school-rail" aria-label={landing.schoolGlanceHeading}>
          <div className="shell">
            <p className="rail-title">{landing.schoolGlanceHeading}</p>
            <dl>
              {landing.schoolStats.map((stat) => <div key={`${stat.value}-${stat.label}`}><dt>{stat.value}</dt><dd>{stat.label}</dd></div>)}
            </dl>
          </div>
        </section>

        <section className="task-section shell" aria-labelledby="task-title">
          <div className="section-intro">
            <p className="overline">{landing.tasksKicker}</p>
            <h2 id="task-title">{landing.tasksHeading}</h2>
            <p>{landing.tasksIntro}</p>
          </div>
          <div className="task-grid">
            {landing.tasks.map((task, index) => (
              <Link className={`task-card${index === 0 ? " task-primary" : ""}`} href={taskLinks[index] ?? "#admissions"} key={`${task.number}-${task.title}`}>
                <span className="task-icon" aria-hidden="true">{task.number}</span>
                <div><h3>{task.title}</h3><p>{task.description}</p></div>
                <strong>{task.action} <span aria-hidden="true">→</span></strong>
              </Link>
            ))}
          </div>
        </section>

        <SchoolStory />

        <section className="academics-section" id="academics">
          <div className="shell">
            <div className="section-heading-row">
              <div className="section-intro"><p className="overline">{landing.academicsKicker}</p><h2>{landing.academicsHeading}</h2></div>
              <p>{landing.academicsIntro}</p>
            </div>
            <div className="level-grid">
              {landing.academicLevels.map((level) => (
                <article key={level.title}>
                  <span>{level.classes}</span>
                  <h3>{level.title}</h3>
                  <p>{level.description}</p>
                  <Link href="#admissions">{level.action} →</Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="updates-section shell">
          <div className="updates-heading">
            <div className="section-intro"><p className="overline">{landing.updatesKicker}</p><h2>{landing.updatesHeading}</h2></div>
            <Link className="button button-secondary" href="/notices">{landing.updatesAction}</Link>
          </div>
          <div className="update-list">
            {updates.map((update) => (
              <Link href={update.href} key={update.title}>
                <time dateTime={update.date}><strong>{update.day}</strong>{update.month}</time>
                <div><span>{update.category}</span><h3>{update.title}</h3></div>
                <p>{update.meta}</p><b>View →</b>
              </Link>
            ))}
          </div>
        </section>

        <AdmissionInquiry />
      </main>
      <SiteFooter />
    </SchoolContentProvider>
  );
}
