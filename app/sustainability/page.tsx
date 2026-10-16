import type { Metadata } from "next";
import { getHomepage, getNavigation } from "@/lib/content";
import { PageHero } from "@/components/layout/PageHero";
import { Sustainability } from "@/components/sustainability/Sustainability";
import { BusinessValue } from "@/components/sustainability/BusinessValue";

export const metadata: Metadata = {
  title: "Sustainability",
  description: "IGBC Platinum pre-certification and how infrastructure, efficiency and sustainability work together at Path Logicity.",
};

export default function SustainabilityPage() {
  const home = getHomepage();
  const links = getNavigation().find((n) => n.href === "/sustainability")?.children;
  return (
    <div data-inner>
      <PageHero kicker="Sustainability" lines={["Sustainability", "*& business value*"]} intro="How infrastructure, efficiency and sustainability work together." links={links} />
      <div id="esg">
        <Sustainability data={home.sustainability} />
      </div>
      <BusinessValue benefits={home.benefits} />
    </div>
  );
}
