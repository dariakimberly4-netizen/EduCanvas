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
  const navigation = [
    { label: "Home", href: "/", page: "home" as ActivePage },
    { label: "Our School", href: "/#school" },
    { label: "Academics", href: "/#academics" },
    { label: "Campus Life", href: "/#campus-life" },
    { label: "News", href: "/#news" },
    { label: "Portal", href: "/admin" },
  ];

  return (
    <>
      <a className="skip-link" href="#main">Skip to main content</a>
      <div className="utility-bar">
        <div className="shell">
          <p>{landing.utilityHours}</p>
          <div>
            <Link href={`tel:${landing.phone.replaceAll(" ", "")}`}>{landing.phone}</Link>
            <Link href="/admin">School portal</Link>
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
            <Link className="nav-cta" href="/#admissions">Admissions</Link>
          </nav>
        </div>
      </header>
    </>
  );
}
