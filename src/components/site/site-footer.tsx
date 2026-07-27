"use client";

import Link from "next/link";

import { Brand } from "@/components/site/brand";
import { useSchoolContent } from "@/features/school/lib/content-store";

export function SiteFooter() {
  const { landing } = useSchoolContent().content;

  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div>
          <Brand light name={landing.brandName} tagline={landing.brandTagline} />
          <p>{landing.footerSummary}</p>
        </div>
        <div>
          <h2>{landing.footerExploreHeading}</h2>
          <Link href="/#school">{landing.navigationLabels.school}</Link>
          <Link href="/#academics">{landing.navigationLabels.academics}</Link>
          <Link href="/faculty">{landing.navigationLabels.faculty}</Link>
          <Link href="/#admissions">{landing.navigationLabels.admissions}</Link>
        </div>
        <div>
          <h2>{landing.footerFamiliesHeading}</h2>
          <Link href="/notices">{landing.navigationLabels.notices}</Link>
          <Link href="/notices#results">{landing.footerResultsLabel}</Link>
          <Link href="/admin">{landing.staffLoginLabel}</Link>
        </div>
        <address>
          <h2>{landing.footerContactHeading}</h2>
          {landing.addressLineOne}<br />
          {landing.addressLineTwo}
          <Link href={`tel:${landing.phone.replaceAll(" ", "")}`}>{landing.phone}</Link>
          <Link href={`mailto:${landing.email}`}>{landing.email}</Link>
        </address>
        <small>{landing.copyright}</small>
      </div>
    </footer>
  );
}
