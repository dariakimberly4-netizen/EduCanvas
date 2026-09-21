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
  name = "Theresian School of Cavite",
  tagline = "Where Holistic Formation Begins",
}: BrandProps) {
  return (
    <Link
      className={cn("brand", light && "brand-light")}
      href="/"
      aria-label={`${name} home`}
    >
      <span className="brand-mark" aria-hidden="true">TSC</span>
      <span>
        <strong>{name}</strong>
        <small>{admin ? "School portal" : tagline}</small>
      </span>
    </Link>
  );
}
