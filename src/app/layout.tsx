import type { Metadata } from "next";

import "@fontsource/merriweather/latin-700.css";
import "@fontsource/source-sans-3/latin-400.css";
import "@fontsource/source-sans-3/latin-500.css";
import "@fontsource/source-sans-3/latin-600.css";
import "@fontsource/source-sans-3/latin-700.css";
import "@fontsource/newsreader/latin-600.css";
import "@fontsource/newsreader/latin-700.css";
import "@fontsource/manrope/latin-400.css";
import "@fontsource/manrope/latin-500.css";
import "@fontsource/manrope/latin-600.css";
import "@fontsource/manrope/latin-700.css";
import "@fontsource/noto-naskh-arabic/arabic-600.css";
import "@fontsource/sora/latin-600.css";
import "@fontsource/sora/latin-700.css";
import "@fontsource/ibm-plex-sans/latin-400.css";
import "@fontsource/ibm-plex-sans/latin-500.css";
import "@fontsource/ibm-plex-sans/latin-600.css";
import "@fontsource/ibm-plex-sans/latin-700.css";
import "@fontsource/ibm-plex-mono/latin-500.css";
import "@fontsource/ibm-plex-mono/latin-600.css";
import "./globals.css";
import "./themes.css";

import { activeSiteTheme } from "@/config/site-theme";

export const metadata: Metadata = {
  metadataBase: new URL("https://shaplagrove.edu.bd"),
  applicationName: "EduCanvas",
  generator: "EduCanvas",
  title: {
    default: "Shapla Grove School & College",
    template: "%s | Shapla Grove School",
  },
  description:
    "Shapla Grove School & College in Dhanmondi, Dhaka. Education from Playgroup to Class XII.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme={activeSiteTheme}>
      <body>{children}</body>
    </html>
  );
}
