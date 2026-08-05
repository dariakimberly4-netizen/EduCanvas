export const SITE_VISUAL_THEME_IDS = [
  "heritage",
  "fieldbook",
  "night-school",
  "common-room",
  "ledger",
] as const;

export type SiteVisualThemeId = (typeof SITE_VISUAL_THEME_IDS)[number];

export const SITE_VISUAL_THEME_NAMES: Record<SiteVisualThemeId, string> = {
  heritage: "Heritage",
  fieldbook: "Fieldbook",
  "night-school": "Night School",
  "common-room": "Common Room",
  ledger: "Ledger",
};

const visualThemeAliases: Readonly<Record<string, SiteVisualThemeId>> = {
  heritage: "heritage",
  classic: "heritage",
  v1: "heritage",
  fieldbook: "fieldbook",
  v2: "fieldbook",
  "night-school": "night-school",
  night: "night-school",
  v3: "night-school",
  "common-room": "common-room",
  commonroom: "common-room",
  v4: "common-room",
  ledger: "ledger",
  v5: "ledger",
};

export function resolveSiteVisualTheme(
  value: string | undefined,
): SiteVisualThemeId {
  return visualThemeAliases[value?.trim().toLowerCase() ?? ""] ?? "heritage";
}

export const activeSiteVisualTheme = resolveSiteVisualTheme(
  process.env.SITE_VISUAL_THEME,
);
