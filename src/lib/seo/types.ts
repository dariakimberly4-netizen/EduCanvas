export interface PageSeo {
  title: string;
  description: string;
  keywords: string[];
  path: string;
  priority: number;
  changeFrequency: "daily" | "weekly" | "monthly" | "yearly";
}

export interface SiteSeo {
  siteName: string;
  shortName: string;
  siteUrl: string;
  titleDefault: string;
  description: string;
  locale: string;
  language: string;
  phone: string;
  email: string;
  address: {
    street: string;
    locality: string;
    region: string;
    postalCode: string;
    country: string;
  };
  keywords: string[];
}

export interface SeoConfig {
  site: SiteSeo;
  pages: Record<"home" | "faculty" | "notices", PageSeo>;
  disallowedPaths: string[];
}
