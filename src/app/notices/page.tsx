import Link from "next/link";

import { StructuredData } from "@/components/seo/structured-data";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { DocumentDirectory } from "@/features/notices/components/document-directory";
import { SchoolContentProvider } from "@/features/school/lib/content-store";
import { getSchoolContent } from "@/features/school/server/site-content-repository";
import { formatLongDate } from "@/lib/format";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { buildWebPageSchema } from "@/lib/seo/structured-data";

export const metadata = generatePageMetadata("notices");
export const dynamic = "force-dynamic";

export default async function NoticesPage() {
  const content = await getSchoolContent();
  const latestDocumentDate = content.documents
    .filter((document) => document.status === "Published")
    .toSorted((first, second) => second.date.localeCompare(first.date))[0]
    ?.date;
  const lastUpdated = latestDocumentDate
    ? formatLongDate(latestDocumentDate, "numeric")
    : "No publications yet";

  return (
    <SchoolContentProvider initialContent={content}>
      <div className="notices-page">
      <StructuredData data={buildWebPageSchema("notices")} />
      <SiteHeader active="notices" />
      <main id="main">
        <section className="page-hero compact">
          <div>
            <nav className="breadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><span>Notices & results</span></nav>
            <p className="eyebrow">Notices and results</p>
            <h1>Official updates, <em>easy to find.</em></h1>
          </div>
          <div className="hero-aside">
            <p>Search current examination schedules, holiday notices, parent updates, and verified student results.</p>
            <p className="updated-note"><span aria-hidden="true" />Last updated {lastUpdated}</p>
          </div>
        </section>

        <DocumentDirectory />

        <section className="help-strip">
          <div><span aria-hidden="true">?</span><p><strong>Need help finding a document?</strong><br />Contact the school office Sunday–Thursday, 8:00 AM–4:00 PM.</p></div>
          <Link href="tel:+8801712345678">Call +880 1712 345 678 →</Link>
        </section>
      </main>
      <SiteFooter />
      </div>
    </SchoolContentProvider>
  );
}
