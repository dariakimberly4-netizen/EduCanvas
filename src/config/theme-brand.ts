import type { SiteThemeId } from "@/config/site-theme";

interface ThemeBrand {
  primary: string;
  deep: string;
  pale: string;
  accent: string;
  monogram: string;
  previewLabel: string;
}

export const THEME_BRAND: Record<SiteThemeId, ThemeBrand> = {
  school: {
    primary: "#1f5f8b",
    deep: "#0a1f33",
    pale: "#eaf3f8",
    accent: "#f2b84b",
    monogram: "SG",
    previewLabel: "School & College",
  },
  madrasha: {
    primary: "#176b51",
    deep: "#0b2922",
    pale: "#e7f1eb",
    accent: "#c79a3b",
    monogram: "SG",
    previewLabel: "Knowledge · Character · Service",
  },
  coaching: {
    primary: "#3e6682",
    deep: "#121d2b",
    pale: "#edf3f6",
    accent: "#b87852",
    monogram: "SG",
    previewLabel: "Diagnose · Practise · Improve",
  },
};
