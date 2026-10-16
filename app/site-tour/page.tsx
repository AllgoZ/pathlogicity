import type { Metadata } from "next";
import { getHomepage } from "@/lib/content";
import { PageHero } from "@/components/layout/PageHero";
import { SiteTourPreview } from "@/components/site-tour/SiteTourPreview";
import { MasterPlan } from "@/components/master-plan/MasterPlan";

export const metadata: Metadata = {
  title: "Site Tour",
  description: "Explore Path Logicity zone by zone: warehousing, rail terminal, dry port, commercial, yards, roads and green infrastructure.",
};

export default function SiteTourPage() {
  const home = getHomepage();
  return (
    <div data-inner>
      <PageHero kicker="Site Tour" lines={["Inside", "*the hub*"]} intro="Explore the hub zone by zone." />
      <SiteTourPreview data={home.siteTour} />
      <MasterPlan zones={home.zones} />
    </div>
  );
}
