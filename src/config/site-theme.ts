export const SITE_THEME_IDS = ["school", "madrasha", "coaching"] as const;

export type SiteThemeId = (typeof SITE_THEME_IDS)[number];

const themeAliases: Readonly<Record<string, SiteThemeId>> = {
  school: "school",
  madrasha: "madrasha",
  coaching: "coaching",
  coacing: "coaching",
};

export function resolveSiteTheme(value: string | undefined): SiteThemeId {
  return themeAliases[value?.trim().toLowerCase() ?? ""] ?? "school";
}

export const activeSiteTheme = resolveSiteTheme(process.env.SITE_THEME);
