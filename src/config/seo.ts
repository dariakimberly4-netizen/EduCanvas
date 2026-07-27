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
    siteName: "Shapla Grove School & College",
    shortName: "Shapla Grove",
    siteUrl,
    titleDefault: "Shapla Grove School & College | Playgroup to Class XII",
    description:
      "Shapla Grove School & College in Dhanmondi, Dhaka offers attentive teaching, a safe campus, and a complete education from Playgroup to Class XII.",
    locale: "en_BD",
    language: "en",
    phone: "+880 1712 345 678",
    email: "office@shaplagrove.edu.bd",
    address: {
      street: "12 Lakeview Road, Dhanmondi",
      locality: "Dhaka",
      region: "Dhaka",
      postalCode: "1209",
      country: "BD",
    },
    keywords: [
      "school in Dhanmondi",
      "school in Dhaka",
      "English version school Dhaka",
      "Playgroup to Class XII",
      "college in Dhanmondi",
      "school admissions Dhaka",
      "Shapla Grove School",
    ],
  },
  pages: {
    home: {
      title: "Shapla Grove School & College | Playgroup to Class XII",
      description:
        "Discover academics, admissions, notices, results, and student life at Shapla Grove School & College in Dhanmondi, Dhaka.",
      keywords: [
        "Shapla Grove School",
        "school admissions Dhanmondi",
        "English version school Dhaka",
        "Playgroup to Class XII",
      ],
      path: "/",
      priority: 1,
      changeFrequency: "weekly",
    },
    faculty: {
      title: "Our Faculty",
      description:
        "Meet the school leaders, subject specialists, and class teachers guiding students at Shapla Grove School & College.",
      keywords: [
        "Shapla Grove faculty",
        "school teachers Dhaka",
        "subject specialists Dhanmondi",
        "school leadership",
      ],
      path: "/faculty",
      priority: 0.8,
      changeFrequency: "monthly",
    },
    notices: {
      title: "Notices & Results",
      description:
        "Find official examination schedules, holiday notices, parent updates, and verified results from Shapla Grove School & College.",
      keywords: [
        "Shapla Grove notices",
        "school examination schedule",
        "school results Dhaka",
        "parent notices",
      ],
      path: "/notices",
      priority: 0.8,
      changeFrequency: "weekly",
    },
  },
  disallowedPaths: ["/admin", "/api"],
};
