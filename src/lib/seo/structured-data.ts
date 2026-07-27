import { seoConfig } from "@/config/seo";

function absoluteUrl(path: string) {
  return `${seoConfig.site.siteUrl}${path}`;
}

export function buildWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${seoConfig.site.siteUrl}/#website`,
    name: seoConfig.site.siteName,
    alternateName: seoConfig.site.shortName,
    url: seoConfig.site.siteUrl,
    description: seoConfig.site.description,
    inLanguage: seoConfig.site.language,
    publisher: {
      "@id": `${seoConfig.site.siteUrl}/#organization`,
    },
  };
}

export function buildEducationalOrganizationSchema() {
  const { site } = seoConfig;
  return {
    "@context": "https://schema.org",
    "@type": ["EducationalOrganization", "School"],
    "@id": `${site.siteUrl}/#organization`,
    name: site.siteName,
    alternateName: site.shortName,
    url: site.siteUrl,
    logo: absoluteUrl("/icon.svg"),
    image: absoluteUrl("/opengraph-image"),
    description: site.description,
    telephone: site.phone,
    email: site.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.locality,
      addressRegion: site.address.region,
      postalCode: site.address.postalCode,
      addressCountry: site.address.country,
    },
  };
}

export function buildWebPageSchema(
  slug: keyof typeof seoConfig.pages,
) {
  const page = seoConfig.pages[slug];
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${absoluteUrl(page.path)}#webpage`,
    name: page.title,
    description: page.description,
    url: absoluteUrl(page.path),
    inLanguage: seoConfig.site.language,
    isPartOf: {
      "@id": `${seoConfig.site.siteUrl}/#website`,
    },
    about: {
      "@id": `${seoConfig.site.siteUrl}/#organization`,
    },
  };
}
