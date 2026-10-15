import type { Metadata, Viewport } from "next";
import { ViewTransition } from "react";
import { Instrument_Serif, Open_Sans, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { getEnquiry, getNavigation, getSettings } from "@/lib/content";
import { Nav } from "@/components/navigation/Nav";
import { JourneyRail } from "@/components/navigation/JourneyRail";
import { MobileActionBar } from "@/components/navigation/MobileActionBar";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { Preloader } from "@/components/providers/Preloader";
import { SurfaceMorph } from "@/components/providers/SurfaceMorph";
import { EnquireBlock } from "@/components/contact/EnquireBlock";
import { Footer } from "@/components/footer/Footer";

/** Display: Plus Jakarta Sans · Accent: Instrument Serif italic · Body: Open Sans (the client's brand/site font). */
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta", display: "swap" });
const instrument = Instrument_Serif({ subsets: ["latin"], weight: "400", style: "italic", variable: "--font-instrument", display: "swap", preload: false });
const openSans = Open_Sans({ subsets: ["latin"], variable: "--font-open-sans", display: "swap" });

export const metadata: Metadata = {
  title: {
    default: "Path Logicity — India's Largest Multimodal Logistics Hub · Dobbaspet, Bengaluru",
    template: "%s · Path Logicity",
  },
  description: "A connected logistics ecosystem at Dobbaspet, Bengaluru, built to move businesses faster.",
};

export const viewport: Viewport = {
  themeColor: "#f8f8f5",
  colorScheme: "light",
};

/** Placeholder labels are hidden for visitors; ?annotations=on shows them for internal review */
const annotationsScript = `try{if(new URLSearchParams(location.search).get('annotations')==='on')document.documentElement.dataset.annotations='on'}catch(e){}`;

/** M1 — run the brand preloader once per session, on the home page, desktop only, with motion enabled (set before paint).
 *  Skipped on phones: there it would hold back the LCP hero image (Lighthouse QA, Phase 4). */
const preloadScript = `try{if(location.pathname==='/'&&!sessionStorage.getItem('pl-intro')&&matchMedia('(prefers-reduced-motion: no-preference) and (min-width: 1024px)').matches)document.documentElement.dataset.preload='1'}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = getSettings();
  return (
    <html lang="en-IN" className={`${jakarta.variable} ${instrument.variable} ${openSans.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: annotationsScript + preloadScript }} />
      </head>
      <body>
        <Preloader />
        <SmoothScroll />
        <SurfaceMorph />
        <Nav items={getNavigation()} settings={settings} />
        {/* M12 — route changes: old page lifts away, new page wipes up over a midnight curtain */}
        <ViewTransition default="page-wipe">
          <main id="main">{children}</main>
        </ViewTransition>
        <EnquireBlock content={getEnquiry()} settings={settings} />
        <Footer navigation={getNavigation()} settings={settings} />
        <JourneyRail />
        <MobileActionBar settings={settings} />
      </body>
    </html>
  );
}
