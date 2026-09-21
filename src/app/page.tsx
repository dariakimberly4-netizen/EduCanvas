/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

import { StructuredData } from "@/components/seo/structured-data";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { AdmissionInquiry } from "@/features/home/components/admission-inquiry";
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

const academicJourney = [
  {
    step: "01",
    phase: "BEGIN",
    level: "Pre-School",
    copy: "A warm first step where curiosity, confidence, language, movement, and joyful discovery are nurtured.",
  },
  {
    step: "02",
    phase: "DISCOVER",
    level: "Grade School",
    copy: "Strong foundations grow through purposeful academics, creativity, communication, friendship, and character formation.",
  },
  {
    step: "03",
    phase: "GROW",
    level: "Junior High School",
    copy: "Learners deepen knowledge, independence, collaboration, leadership, and readiness for more focused study.",
  },
  {
    step: "04",
    phase: "PREPARE",
    level: "Senior High School",
    copy: "Students prepare for higher education, employment, entrepreneurship, and lifelong learning through purposeful pathways.",
  },
];

const facilities = [
  "Library",
  "Science Laboratories",
  "Computer Laboratories",
  "Gymnasium",
  "Clinic",
  "Guidance Office",
  "Registrar",
  "Canteen",
];

const values = [
  ["C", "Commitment", "Give time and energy to what matters and follow through with purpose."],
  ["O", "Orderliness", "Work with a clear system, organization, and responsibility."],
  ["D", "Discipline", "Act with self-control and respect for standards that help the community thrive."],
  ["E", "Excellence", "Give your best while doing what is right."],
];

export default async function HomePage() {
  const content = await getSchoolContent();
  const { landing } = content;

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

      <main id="main" className="theresian-home">
        <section className="tsc-hero" aria-labelledby="tsc-hero-title">
          <div className="tsc-hero-glow tsc-hero-glow-one" />
          <div className="tsc-hero-glow tsc-hero-glow-two" />
          <div className="tsc-path-line" aria-hidden="true" />

          <div className="shell tsc-hero-grid">
            <div className="tsc-hero-copy">
              <div className="tsc-status">
                <span />
                Admissions for S.Y. 2026–2027 are ongoing
              </div>
              <p className="tsc-eyebrow">Bacoor, Cavite · Established 1988</p>
              <h1 id="tsc-hero-title">
                Where Holistic
                <span>Formation Begins.</span>
              </h1>
              <p className="tsc-lead">
                Theresian School of Cavite develops creative thinkers, good
                communicators, collaborators, and lifelong learners through a
                balanced journey of academics, character, community, and growth.
              </p>
              <div className="tsc-actions">
                <a className="tsc-button tsc-button-primary" href="#journey">
                  Begin Your Journey <span aria-hidden="true">↓</span>
                </a>
                <a className="tsc-button tsc-button-ghost" href="#admissions">
                  Apply to TSC
                </a>
              </div>
              <div className="tsc-hero-facts" aria-label="School highlights">
                <div><strong>1988</strong><span>Founded</span></div>
                <div><strong>2005</strong><span>ESC accredited since</span></div>
                <div><strong>K–12</strong><span>Basic education</span></div>
              </div>
            </div>

            <div className="tsc-emblem-stage" aria-label="Theresian School of Cavite identity">
              <div className="tsc-rings" aria-hidden="true">
                <span /><span /><span />
              </div>
              <div className="tsc-emblem-card">
                <p>THE THERESIAN JOURNEY</p>
                <div className="tsc-emblem">
                  <img
                    src="https://tsc.edu.ph/wp-content/uploads/2020/04/cropped-TSC-Logo-200X200-1-1.png"
                    alt="Theresian School of Cavite emblem"
                  />
                </div>
                <h2>Theresian School<br />of Cavite</h2>
                <span className="tsc-gold-rule" />
                <small>Prosperity · Hope · Wisdom · Truth · Purity</small>
              </div>
              <div className="tsc-floating-note tsc-note-one">Learn</div>
              <div className="tsc-floating-note tsc-note-two">Grow</div>
              <div className="tsc-floating-note tsc-note-three">Become</div>
            </div>
          </div>
        </section>

        <section className="tsc-marquee" aria-label="Theresian formation">
          <div>
            <span>CREATIVE THINKERS</span><i>✦</i>
            <span>GOOD COMMUNICATORS</span><i>✦</i>
            <span>COLLABORATORS</span><i>✦</i>
            <span>LIFELONG LEARNERS</span>
          </div>
        </section>

        <section className="tsc-story" id="school">
          <div className="shell tsc-story-grid">
            <div className="tsc-section-heading">
              <p className="tsc-eyebrow">OUR SCHOOL</p>
              <h2>A school journey built around the whole learner.</h2>
            </div>
            <div className="tsc-story-copy">
              <p>
                Formerly known as Kiddie Kollege of Cavite, TSC was founded in
                1988 as a place where children can feel at home while learning,
                developing life skills, and striving for excellence.
              </p>
              <blockquote>
                “A leading GLOCAL academic institution committed to the holistic
                formation of the youth.”
              </blockquote>
              <a className="tsc-text-link" href="#formation">Discover our formation approach →</a>
            </div>
          </div>
        </section>

        <section className="tsc-journey" id="journey" aria-labelledby="journey-title">
          <div className="shell">
            <div className="tsc-section-heading tsc-heading-centered">
              <p className="tsc-eyebrow">THE THERESIAN JOURNEY</p>
              <h2 id="journey-title">Every stage prepares the learner for what comes next.</h2>
              <p>
                A continuous path from first discoveries to future-ready learning.
              </p>
            </div>

            <div className="tsc-journey-track">
              <div className="tsc-track-line" aria-hidden="true" />
              {academicJourney.map((item, index) => (
                <article className="tsc-journey-card" key={item.phase}>
                  <div className="tsc-step">
                    <span>{item.step}</span>
                    <i aria-hidden="true">{index + 1}</i>
                  </div>
                  <p>{item.phase}</p>
                  <h3>{item.level}</h3>
                  <div>{item.copy}</div>
                  <a href="#admissions">Explore this stage →</a>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="tsc-academics" id="academics">
          <div className="shell">
            <div className="tsc-section-heading">
              <p className="tsc-eyebrow">ACADEMICS</p>
              <h2>Learning with direction, depth, and a future in mind.</h2>
            </div>

            <div className="tsc-academic-feature">
              <div>
                <span className="tsc-feature-number">03</span>
                <p>SENIOR HIGH SCHOOL</p>
                <h3>Choose a pathway that matches where you want to go.</h3>
                <p>
                  Senior High School learners build core competencies while
                  preparing for higher education, employment, entrepreneurship,
                  and skills development.
                </p>
              </div>
              <div className="tsc-pathways">
                <article><strong>STEM</strong><span>MA · EA · ICT</span></article>
                <article><strong>BE</strong><span>Business & Entrepreneurship</span></article>
                <article><strong>ASSH</strong><span>Arts, Social Sciences & Humanities</span></article>
              </div>
            </div>
          </div>
        </section>

        <section className="tsc-campus" id="campus-life">
          <div className="shell">
            <div className="tsc-section-heading tsc-heading-centered">
              <p className="tsc-eyebrow">BEYOND THE CLASSROOM</p>
              <h2>Explore the places that support the Theresian experience.</h2>
              <p>
                Learning happens across the campus—in spaces designed for
                discovery, wellbeing, creativity, guidance, and community.
              </p>
            </div>

            <div className="tsc-campus-grid">
              {facilities.map((facility, index) => (
                <a href="#contact" className="tsc-campus-tile" key={facility}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{facility}</strong>
                  <i aria-hidden="true">↗</i>
                </a>
              ))}
            </div>

            <div className="tsc-campus-actions">
              <Link href="/faculty">Meet the school community →</Link>
              <a href="#contact">Plan a school visit →</a>
            </div>
          </div>
        </section>

        <section className="tsc-formation" id="formation">
          <div className="shell tsc-formation-layout">
            <div className="tsc-formation-intro">
              <p className="tsc-eyebrow">HOLISTIC FORMATION</p>
              <h2>CODE is more than an acronym. It is a way of becoming.</h2>
              <p>
                TSC’s core values connect everyday learning with responsibility,
                character, discipline, and the pursuit of excellence.
              </p>
            </div>
            <div className="tsc-values">
              {values.map(([letter, title, copy]) => (
                <article key={letter}>
                  <span>{letter}</span>
                  <div><h3>{title}</h3><p>{copy}</p></div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="tsc-news" id="news">
          <div className="shell">
            <div className="tsc-news-heading">
              <div className="tsc-section-heading">
                <p className="tsc-eyebrow">CURRENT AT TSC</p>
                <h2>News & Updates</h2>
              </div>
              <Link href="/notices" className="tsc-text-link">Open school notices →</Link>
            </div>

            <div className="tsc-news-grid">
              <a href="https://tsc.edu.ph/" target="_blank" rel="noreferrer">
                <span>MAY 18 · 2026</span>
                <h3>Opening Block Schedule for S.Y. 2026–2027</h3>
                <p>View the latest school-year schedule information from TSC.</p>
              </a>
              <a href="https://tsc.edu.ph/" target="_blank" rel="noreferrer">
                <span>MAY 11 · 2026</span>
                <h3>Books are now available</h3>
                <p>Check the latest bookstore and school-material updates.</p>
              </a>
              <a href="https://tsc.edu.ph/admissions-for-sy-2025-2026/" target="_blank" rel="noreferrer">
                <span>ADMISSIONS</span>
                <h3>Applications for S.Y. 2026–2027 are ongoing</h3>
                <p>Review the current application options for incoming students.</p>
              </a>
            </div>
          </div>
        </section>

        <AdmissionInquiry />

        <section className="tsc-contact" id="contact">
          <div className="shell tsc-contact-grid">
            <div>
              <p className="tsc-eyebrow">YOUR JOURNEY STARTS HERE</p>
              <h2>Visit. Ask. Apply. Become a Theresian.</h2>
            </div>
            <div className="tsc-contact-details">
              <p><strong>Visit</strong>Agueda Lane, Tirona Highway, Habay 1, Bacoor, Cavite 4102</p>
              <p><strong>Call</strong><a href="tel:0464343109">(046) 434-3109</a></p>
              <p><strong>Office hours</strong>Mon–Fri 8:00 AM–5:00 PM · Sat 8:00 AM–12:00 PM</p>
              <Link className="tsc-button tsc-button-light" href="/admin">
                Open School Portal →
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </SchoolContentProvider>
  );
}
