import Link from "next/link";

import { cn } from "@/lib/utils";

interface BrandProps {
  light?: boolean;
  admin?: boolean;
}

export function Brand({ light = false, admin = false }: BrandProps) {
  return (
    <Link
      className={cn("brand", light && "brand-light")}
      href="/"
      aria-label="Shapla Grove School home"
    >
      <span className="brand-mark" aria-hidden="true">শ</span>
      <span>
        <strong>Shapla Grove</strong>
        <small>{admin ? "Website management" : "School & College · Est. 1998"}</small>
      </span>
    </Link>
  );
}
