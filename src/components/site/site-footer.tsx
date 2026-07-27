import Link from "next/link";

import { Brand } from "@/components/site/brand";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div>
          <Brand light />
          <p>Structured learning, individual guidance, and a safe campus from Playgroup to Class XII.</p>
        </div>
        <div>
          <h2>Explore</h2>
          <Link href="/#school">Our school</Link>
          <Link href="/#academics">Academics</Link>
          <Link href="/faculty">Faculty</Link>
          <Link href="/#admissions">Admissions</Link>
        </div>
        <div>
          <h2>For families</h2>
          <Link href="/notices">Notices</Link>
          <Link href="/notices#results">Results</Link>
          <Link href="/admin">Staff login</Link>
        </div>
        <address>
          <h2>Contact</h2>
          12 Lakeview Road, Dhanmondi<br />
          Dhaka 1209
          <Link href="tel:+8801712345678">+880 1712 345 678</Link>
          <Link href="mailto:office@shaplagrove.edu.bd">office@shaplagrove.edu.bd</Link>
        </address>
        <small>© 2026 Shapla Grove School & College. Prototype website.</small>
      </div>
    </footer>
  );
}
