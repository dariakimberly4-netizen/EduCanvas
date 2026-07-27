import type { MetadataRoute } from "next";

import { seoConfig } from "@/config/seo";
import { activeSiteTheme } from "@/config/site-theme";
import { THEME_BRAND } from "@/config/theme-brand";

export default function manifest(): MetadataRoute.Manifest {
  const brand = THEME_BRAND[activeSiteTheme];
  return {
    name: seoConfig.site.siteName,
    short_name: seoConfig.site.shortName,
    description: seoConfig.site.description,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: brand.deep,
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
