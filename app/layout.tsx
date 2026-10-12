import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Manrope } from "next/font/google";
import "./globals.css";
import { getEnquiry, getNavigation, getSettings } from "@/lib/content";
import { Nav } from "@/components/navigation/Nav";
import { JourneyRail } from "@/components/navigation/JourneyRail";
import { MobileActionBar } from "@/components/navigation/MobileActionBar";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { EnquireBlock } from "@/components/contact/EnquireBlock";
import { Footer } from "@/components/footer/Footer";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", weight: ["400", "500"], display: "swap" });

export const metadata: Metadata = {
  title: {
    default: "Path Logicity — India's Largest Multimodal Logistics Hub · Dobbaspet, Bengaluru",
    template: "%s · Path Logicity",
  },
  description: "A connected logistics ecosystem at Dobbaspet, Bengaluru, built to move businesses faster.",
};

export const viewport: Viewport = {
  themeColor: "#070e26",
  colorScheme: "dark",
};

/** ?annotations=off hides asset-slot labels for clean client screenshots */
const annotationsScript = `try{if(new URLSearchParams(location.search).get('annotations')==='off')document.documentElement.dataset.annotations='off'}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = getSettings();
  return (
    <html lang="en-IN" className={`${manrope.variable} ${inter.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: annotationsScript }} />
      </head>
      <body>
        <SmoothScroll />
        <Nav items={getNavigation()} settings={settings} />
        <main id="main">{children}</main>
        <EnquireBlock content={getEnquiry()} settings={settings} />
        <Footer navigation={getNavigation()} settings={settings} />
        <JourneyRail />
        <MobileActionBar settings={settings} />
      </body>
    </html>
  );
}
