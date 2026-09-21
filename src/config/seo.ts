import type { SeoConfig } from "@/lib/seo/types";

function normalizeSiteUrl(value: string | undefined) {
  const fallback = "http://localhost:3000";
  try {
    const url = new URL(value || fallback);
    return url.toString().replace(/\/$/, "");
  } catch {
    return fallback;
  }
}

const siteUrl = normalizeSiteUrl(
  process.env.SITE_URL ?? process.env.BETTER_AUTH_URL,
);

export const seoConfig: SeoConfig = {
  site: {
    siteName: "Theresian School of Cavite, Inc.",
    shortName: "Theresian School of Cavite",
    siteUrl,
    titleDefault: "Theresian School of Cavite | Where Holistic Formation Begins",
    description:
      "Theresian School of Cavite in Bacoor, Cavite provides holistic formation from Pre-School through Senior High School, nurturing creative thinkers, communicators, collaborators, and lifelong learners.",
    locale: "en_PH",
    language: "en",
    phone: "(046) 434-3109",
    email: "admissons.tsc88@gmail.com",
    address: {
      street: "Agueda Lane, Tirona Highway, Habay 1",
      locality: "Bacoor",
      region: "Cavite",
      postalCode: "4102",
      country: "PH",
    },
    keywords: [
      "Theresian School of Cavite",
      "school in Bacoor Cavite",
      "private school Bacoor",
      "Pre-School Bacoor",
      "Junior High School Bacoor",
      "Senior High School Bacoor",
      "holistic formation school Cavite",
      "TSC admissions",
    ],
  },
  pages: {
    home: {
      title: "Theresian School of Cavite | Where Holistic Formation Begins",
      description:
        "Explore the Theresian journey, academics, campus life, holistic formation, and admissions at Theresian School of Cavite in Bacoor.",
      keywords: [
        "Theresian School of Cavite",
        "TSC Bacoor",
        "school admissions Bacoor",
        "holistic education Cavite",
      ],
      path: "/",
      priority: 1,
      changeFrequency: "weekly",
    },
    faculty: {
      title: "School Community",
      description:
        "Explore the learning community that supports students at Theresian School of Cavite.",
      keywords: [
        "Theresian School of Cavite community",
        "TSC faculty",
        "school teachers Bacoor",
        "school leadership Cavite",
      ],
      path: "/faculty",
      priority: 0.8,
      changeFrequency: "monthly",
    },
    notices: {
      title: "News & Updates",
      description:
        "Find school announcements, schedules, updates, and published information from Theresian School of Cavite.",
      keywords: [
        "TSC news",
        "Theresian School of Cavite announcements",
        "school updates Bacoor",
        "TSC schedule",
      ],
      path: "/notices",
      priority: 0.8,
      changeFrequency: "weekly",
    },
  },
  disallowedPaths: ["/admin", "/api"],
};
