import type { Metadata } from "next";
import Link from "next/link";

import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { FacultyDirectory } from "@/features/faculty/components/faculty-directory";

export const metadata: Metadata = {
  title: "Our Faculty",
  description: "Meet the leadership, subject specialists, and class teachers at Shapla Grove School & College.",
};

export default function FacultyPage() {
  return (
    <div className="faculty-page">
      <SiteHeader active="faculty" />
      <main id="main">
        <section className="page-hero">
          <div>
            <nav className="breadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><span>Faculty</span></nav>
            <p className="eyebrow">Faculty and leadership</p>
            <h1>Teachers who know every student <em>by name.</em></h1>
          </div>
          <div className="hero-aside">
            <p>Meet the school leaders, subject specialists, and class teachers guiding students from early years through higher secondary.</p>
            <dl className="hero-facts">
              <div><dt>18:1</dt><dd>Student–teacher ratio</dd></div>
              <div><dt>12+</dt><dd>Years’ average experience</dd></div>
            </dl>
          </div>
        </section>

        <section className="principal">
          <div className="portrait portrait-principal"><span>SR</span><small>Principal since 2017</small></div>
          <div className="principal-message">
            <p className="eyebrow">A welcome from our principal</p>
            <blockquote>“School is where a young person learns not only what the world is, but what it could become through them.”</blockquote>
            <div className="principal-signoff">
              <span className="initial-seal" aria-hidden="true">SR</span>
              <div><h2>Dr. Samina Rahman</h2><p>Principal · PhD in Education · 24 years in teaching</p></div>
            </div>
          </div>
        </section>

        <FacultyDirectory />

        <section className="join-banner">
          <div><p className="eyebrow">Join our team</p><h2>Teach with purpose.</h2><p>We welcome thoughtful educators who care about the whole child.</p></div>
          <Link className="button button-light" href="mailto:careers@shaplagrove.edu.bd">View opportunities <span aria-hidden="true">→</span></Link>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
