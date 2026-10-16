import type { Metadata, Viewport } from "next";
import { ViewTransition } from "react";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import { getEnquiry, getNavigation, getSettings } from "@/lib/content";
import { Nav } from "@/components/navigation/Nav";
import { JourneyRail } from "@/components/navigation/JourneyRail";
import { RouteSpine } from "@/components/navigation/RouteSpine";
import { MobileActionBar } from "@/components/navigation/MobileActionBar";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { SurfaceMorph } from "@/components/providers/SurfaceMorph";
import { MobileMotion } from "@/components/providers/MobileMotion";
import { EnquireBlock } from "@/components/contact/EnquireBlock";
import { Footer } from "@/components/footer/Footer";

/** One typeface: Open Sans, the client's brand/site font (client round 2 — fonts). */
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = getSettings();
  return (
    <html lang="en-IN" className={openSans.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: annotationsScript }} />
      </head>
      <body>
        <SmoothScroll />
        <SurfaceMorph />
        <MobileMotion />
        <Nav items={getNavigation()} settings={settings} />
        {/* M12 — route changes: old page lifts away, new page wipes up over a light curtain */}
        <ViewTransition default="page-wipe">
          <main id="main">{children}</main>
        </ViewTransition>
        <EnquireBlock content={getEnquiry()} settings={settings} />
        <Footer navigation={getNavigation()} settings={settings} />
        <RouteSpine />
        <JourneyRail />
        <MobileActionBar settings={settings} />
      </body>
    </html>
  );
}
