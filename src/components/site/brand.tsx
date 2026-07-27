import Link from "next/link";

import { cn } from "@/lib/utils";

interface BrandProps {
  light?: boolean;
  admin?: boolean;
  name?: string;
  tagline?: string;
}

export function Brand({
  light = false,
  admin = false,
  name = "Shapla Grove",
  tagline = "School & College · Est. 1998",
}: BrandProps) {
  return (
    <Link
      className={cn("brand", light && "brand-light")}
      href="/"
      aria-label={`${name} home`}
    >
      <span className="brand-mark" aria-hidden="true">শ</span>
      <span>
        <strong>{name}</strong>
        <small>{admin ? "Website management" : tagline}</small>
      </span>
    </Link>
  );
}
