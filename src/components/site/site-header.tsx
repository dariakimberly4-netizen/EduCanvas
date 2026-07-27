"use client";

import Link from "next/link";

import { Brand } from "@/components/site/brand";
import { useSchoolContent } from "@/features/school/lib/content-store";
import { cn } from "@/lib/utils";

type ActivePage = "home" | "faculty" | "notices";

interface SiteHeaderProps {
  active: ActivePage;
}

export function SiteHeader({ active }: SiteHeaderProps) {
  const { landing } = useSchoolContent().content;
  const navigation: { label: string; href: string; page?: ActivePage }[] = [
    { label: landing.navigationLabels.home, href: "/", page: "home" },
    { label: landing.navigationLabels.school, href: "/#school" },
    { label: landing.navigationLabels.academics, href: "/#academics" },
    { label: landing.navigationLabels.faculty, href: "/faculty", page: "faculty" },
    { label: landing.navigationLabels.notices, href: "/notices", page: "notices" },
  ];

  return (
    <>
      <a className="skip-link" href="#main">Skip to main content</a>
      <div className="utility-bar">
        <div className="shell">
          <p>{landing.utilityHours}</p>
          <div>
            <Link href={`tel:${landing.phone.replaceAll(" ", "")}`}>{landing.phone}</Link>
            <Link href="/admin">{landing.staffLoginLabel}</Link>
          </div>
        </div>
      </div>
      <header className="site-header">
        <div className="shell header-inner">
          <Brand name={landing.brandName} tagline={landing.brandTagline} />
          <input className="nav-toggle" id="nav-toggle" type="checkbox" />
          <label className="nav-toggle-label" htmlFor="nav-toggle">
            <span /><span /><span /><em>Open menu</em>
          </label>
          <nav className="site-nav" aria-label="Primary navigation">
            {navigation.map((item) => (
              <Link
                key={item.label}
                className={cn(item.page === active && "active")}
                href={item.href}
                aria-current={item.page === active ? "page" : undefined}
              >
                {item.label}
              </Link>
            ))}
            <Link className="nav-cta" href="/#admissions">{landing.navigationLabels.admissions}</Link>
          </nav>
        </div>
      </header>
    </>
  );
}
