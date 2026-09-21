import { ImageResponse } from "next/og";

import { seoConfig } from "@/config/seo";
import { activeSiteTheme } from "@/config/site-theme";
import { THEME_BRAND } from "@/config/theme-brand";

export const alt =
  "Theresian School of Cavite — Where Holistic Formation Begins";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  const brand = THEME_BRAND[activeSiteTheme];

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        overflow: "hidden",
        background: brand.deep,
        color: "#ffffff",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          width: 16,
          height: "100%",
          display: "flex",
          background: brand.accent,
        }}
      />

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          padding: "64px 74px 58px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <div
            style={{
              width: 76,
              height: 76,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 38,
              background: brand.primary,
              border: `2px solid ${brand.accent}`,
              fontSize: 23,
              fontWeight: 700,
              letterSpacing: -1,
            }}
          >
            {brand.monogram}
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 31, fontWeight: 700 }}>
              {seoConfig.site.shortName}
            </div>
            <div
              style={{
                display: "flex",
                marginTop: 7,
                color: "#e0d59a",
                fontSize: 14,
                fontWeight: 600,
                letterSpacing: 2.2,
                textTransform: "uppercase",
              }}
            >
              {brand.previewLabel}
            </div>
          </div>
        </div>

        <div
          style={{
            maxWidth: 850,
            display: "flex",
            marginTop: 66,
            fontSize: 64,
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: -2.5,
          }}
        >
          Where Holistic Formation Begins.
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 15,
            marginTop: "auto",
            color: "#d9e8df",
            fontSize: 20,
          }}
        >
          <div
            style={{
              width: 48,
              height: 4,
              display: "flex",
              background: brand.accent,
            }}
          />
          Pre-School to Senior High School · Bacoor, Cavite
        </div>
      </div>

      <div
        style={{
          width: 290,
          height: 290,
          position: "absolute",
          right: -70,
          top: -70,
          display: "flex",
          border: `1px solid ${brand.primary}`,
          borderRadius: "50%",
          opacity: .7,
        }}
      />
      <div
        style={{
          width: 190,
          height: 190,
          position: "absolute",
          right: -20,
          top: -20,
          display: "flex",
          border: `1px solid ${brand.accent}`,
          borderRadius: "50%",
          opacity: .45,
        }}
      />
    </div>,
    { ...size },
  );
}
