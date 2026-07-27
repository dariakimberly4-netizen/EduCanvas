import Link from "next/link";

import { StructuredData } from "@/components/seo/structured-data";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { AdmissionInquiry } from "@/features/home/components/admission-inquiry";
import { HomeHero } from "@/features/home/components/home-hero";
import { SchoolStory } from "@/features/home/components/school-story";
import { generatePageMetadata } from "@/lib/seo/metadata";
import {
  buildEducationalOrganizationSchema,
  buildWebPageSchema,
  buildWebSiteSchema,
} from "@/lib/seo/structured-data";

export const metadata = generatePageMetadata("home");

const tasks = [
  { number: "01", title: "Apply for admission", description: "Check eligibility, class availability, and request a campus visit.", action: "Start enquiry", href: "#admissions", primary: true },
  { number: "02", title: "Read school notices", description: "View examination schedules, events, holidays, and parent updates.", action: "View notices", href: "/notices" },
  { number: "03", title: "Check results", description: "Find verified term, model test, and board result documents.", action: "View results", href: "/notices#results" },
  { number: "04", title: "Meet our faculty", description: "Learn about our teachers, subject leaders, and school leadership.", action: "Meet the team", href: "/faculty" },
];

const academicLevels = [
  { classes: "Playgroup–KG", title: "Early years", description: "Language, number sense, movement, routines, and learning through guided play.", action: "Ask about early years" },
  { classes: "Classes I–V", title: "Primary school", description: "Strong foundations in Bangla, English, mathematics, science, and social studies.", action: "Ask about primary" },
  { classes: "Classes VI–X", title: "Secondary school", description: "Deeper subject study, practical science, digital skills, and SSC preparation.", action: "Ask about secondary" },
  { classes: "Classes XI–XII", title: "Higher secondary", description: "Focused academic streams, university guidance, and HSC exam preparation.", action: "Ask about college" },
];

const updates = [
  { date: "2026-07-24", day: "24", month: "Jul", category: "Examination", title: "Half-yearly examination schedule for Classes VI–X", meta: "PDF · 1.2 MB", href: "/notices" },
  { date: "2026-07-18", day: "18", month: "Jul", category: "General", title: "School closure for Ashura", meta: "PDF · 420 KB", href: "/notices" },
  { date: "2026-06-28", day: "28", month: "Jun", category: "Results", title: "First term results — Classes VI–VIII", meta: "PDF · 2.4 MB", href: "/notices#results" },
];

export default function HomePage() {
  return (
    <>
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

        <section className="school-rail" aria-label="School at a glance">
          <div className="shell">
            <p className="rail-title">School at a glance</p>
            <dl>
              <div><dt>Playgroup–XII</dt><dd>Classes offered</dd></div>
              <div><dt>18:1</dt><dd>Student–teacher ratio</dd></div>
              <div><dt>Bangla & English</dt><dd>Languages of instruction</dd></div>
              <div><dt>96%</dt><dd>2025 board pass rate</dd></div>
            </dl>
          </div>
        </section>

        <section className="task-section shell" aria-labelledby="task-title">
          <div className="section-intro">
            <p className="overline">How can we help?</p>
            <h2 id="task-title">Find what you need.</h2>
            <p>Quick access for parents, students, and prospective families.</p>
          </div>
          <div className="task-grid">
            {tasks.map((task) => (
              <Link className={`task-card${task.primary ? " task-primary" : ""}`} href={task.href} key={task.number}>
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
              <div className="section-intro"><p className="overline">Academic pathway</p><h2>Learning that progresses with your child.</h2></div>
              <p>Each stage has clear academic goals, age-appropriate support, and preparation for what comes next.</p>
            </div>
            <div className="level-grid">
              {academicLevels.map((level) => (
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
            <div className="section-intro"><p className="overline">Current information</p><h2>Latest from the school.</h2></div>
            <Link className="button button-secondary" href="/notices">View all notices & results</Link>
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
    </>
  );
}
