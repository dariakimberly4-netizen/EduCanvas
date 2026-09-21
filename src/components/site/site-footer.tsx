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
          <h2>Explore</h2>
          <Link href="/#school">Our School</Link>
          <Link href="/#academics">Academics</Link>
          <Link href="/#campus-life">Campus Life</Link>
          <Link href="/#admissions">Admissions</Link>
        </div>
        <div>
          <h2>For families</h2>
          <Link href="/#news">News & Updates</Link>
          <Link href="/#contact">Visit & Contact</Link>
          <Link href="/admin">School Portal</Link>
        </div>
        <address>
          <h2>Contact</h2>
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
