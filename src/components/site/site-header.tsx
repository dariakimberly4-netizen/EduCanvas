import Link from "next/link";

import { Brand } from "@/components/site/brand";
import { cn } from "@/lib/utils";

type ActivePage = "home" | "faculty" | "notices";

interface SiteHeaderProps {
  active: ActivePage;
}

const navigation: { label: string; href: string; page?: ActivePage }[] = [
  { label: "Home", href: "/", page: "home" },
  { label: "Our school", href: "/#school" },
  { label: "Academics", href: "/#academics" },
  { label: "Faculty", href: "/faculty", page: "faculty" },
  { label: "Notices & results", href: "/notices", page: "notices" },
];

export function SiteHeader({ active }: SiteHeaderProps) {
  return (
    <>
      <a className="skip-link" href="#main">Skip to main content</a>
      <div className="utility-bar">
        <div className="shell">
          <p>Sunday–Thursday, 8:00 AM–4:00 PM</p>
          <div>
            <Link href="tel:+8801712345678">+880 1712 345 678</Link>
            <Link href="/admin">Staff login</Link>
          </div>
        </div>
      </div>
      <header className="site-header">
        <div className="shell header-inner">
          <Brand />
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
