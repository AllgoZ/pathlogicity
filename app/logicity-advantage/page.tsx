import type { Metadata } from "next";
import { getHomepage, getNavigation, getPartners } from "@/lib/content";
import { PageHero } from "@/components/layout/PageHero";
import { SpecDrawing } from "@/components/advantage/SpecDrawing";
import { Amenities } from "@/components/advantage/Amenities";
import { GatiShaktiBand } from "@/components/advantage/GatiShaktiBand";
import { MasterPlan } from "@/components/master-plan/MasterPlan";
import { ConnectivityMap } from "@/components/connectivity-map/ConnectivityMap";

export const metadata: Metadata = {
  title: "The Logicity Advantage",
  description: "Project at a glance, amenities, road, rail, air and port connectivity, and PM Gati Shakti: one hub, every route.",
};

export default function LogicityAdvantagePage() {
  const home = getHomepage();
  const links = getNavigation().find((n) => n.href === "/logicity-advantage")?.children;
  return (
    <div data-inner>
      <PageHero kicker="Logicity Advantage" lines={["One hub.", "*Every route.*"]} intro="The project in numbers, the amenities around it, and the routes into it." links={links} />
      <SpecDrawing glance={home.glance} />
      <MasterPlan zones={home.zones} />
      <Amenities items={home.amenities} />
      <div id="solutions">
        <ConnectivityMap destinations={home.destinations} />
      </div>
      <GatiShaktiBand data={home.gatiShakti} partners={getPartners()} />
    </div>
  );
}
