import type { Metadata } from "next";

import { seoConfig } from "@/config/seo";

function absoluteUrl(path: string) {
  return `${seoConfig.site.siteUrl}${path}`;
}

function buildOpenGraph(title: string, description: string, path: string) {
  return {
    title,
    description,
    url: absoluteUrl(path),
    siteName: seoConfig.site.siteName,
    locale: seoConfig.site.locale,
    type: "website" as const,
    images: [
      {
        url: absoluteUrl("/opengraph-image"),
        width: 1200,
        height: 630,
        alt: `${seoConfig.site.siteName} — ${title}`,
      },
    ],
  };
}

function buildTwitter(title: string, description: string) {
  return {
    card: "summary_large_image" as const,
    title,
    description,
    images: [absoluteUrl("/opengraph-image")],
  };
}

export function generateRootMetadata(): Metadata {
  return {
    metadataBase: new URL(seoConfig.site.siteUrl),
    applicationName: "EduCanvas",
    generator: "EduCanvas",
    category: "education",
    title: {
      template: `%s | ${seoConfig.site.shortName}`,
      default: seoConfig.site.titleDefault,
    },
    description: seoConfig.site.description,
    keywords: seoConfig.site.keywords,
    manifest: "/manifest.webmanifest",
    icons: {
      icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
      shortcut: "/icon.svg",
      apple: "/icon.svg",
    },
    openGraph: buildOpenGraph(
      seoConfig.site.titleDefault,
      seoConfig.site.description,
      "/",
    ),
    twitter: buildTwitter(
      seoConfig.site.titleDefault,
      seoConfig.site.description,
    ),
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: process.env.GOOGLE_SITE_VERIFICATION
      ? { google: process.env.GOOGLE_SITE_VERIFICATION }
      : undefined,
  };
}

export function generatePageMetadata(
  slug: keyof typeof seoConfig.pages,
): Metadata {
  const page = seoConfig.pages[slug];
  return {
    title: page.path === "/" ? { absolute: page.title } : page.title,
    description: page.description,
    keywords: page.keywords,
    alternates: {
      canonical: absoluteUrl(page.path),
    },
    openGraph: buildOpenGraph(page.title, page.description, page.path),
    twitter: buildTwitter(page.title, page.description),
  };
}

export function generatePrivatePageMetadata(title: string): Metadata {
  return {
    title,
    robots: {
      index: false,
      follow: false,
      noarchive: true,
      googleBot: {
        index: false,
        follow: false,
        noimageindex: true,
      },
    },
  };
}
