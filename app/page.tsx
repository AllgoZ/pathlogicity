import { getPartners, getSettings } from "@/lib/content";
import { getHomepageWithAssets } from "@/lib/content/server";
import { Hero } from "@/components/hero/Hero";
import { ScaleIndex } from "@/components/stats/ScaleIndex";
import { MasterPlan } from "@/components/master-plan/MasterPlan";
import { ProjectStatus } from "@/components/project-status/ProjectStatus";
import { PathGroup } from "@/components/path-group/PathGroup";
import { RendersGallery } from "@/components/gallery/RendersGallery";
import { HubOpener } from "@/components/advantage/HubOpener";
import { SpecDrawing } from "@/components/advantage/SpecDrawing";
import { Amenities } from "@/components/advantage/Amenities";
import { ConnectivityMap } from "@/components/connectivity-map/ConnectivityMap";
import { GatiShaktiBand } from "@/components/advantage/GatiShaktiBand";
import { Sustainability } from "@/components/sustainability/Sustainability";
import { BusinessValue } from "@/components/sustainability/BusinessValue";
import { SiteTourPreview } from "@/components/site-tour/SiteTourPreview";
import { NewsPreview } from "@/components/news/NewsPreview";

/**
 * Homepage — DISCOVER → EXPLORE → UNDERSTAND → BELIEVE → ENQUIRE.
 * The final CTA (§11) and footer (§12) are shared by every page via the root layout.
 */
export default function HomePage() {
  const home = getHomepageWithAssets();
  const settings = getSettings();
  return (
    <>
      <Hero data={home.hero} settings={settings} />
      <ScaleIndex data={home.scale} />
      <MasterPlan zones={home.zones} />
      <ProjectStatus milestones={home.milestones} lastUpdated={home.statusLastUpdated} leasing={home.leasing} constra={home.constra} />
      <PathGroup data={home.pathGroup} />
      <RendersGallery items={home.renders} />
      <HubOpener />
      <SpecDrawing glance={home.glance} />
      <Amenities items={home.amenities} />
      <ConnectivityMap destinations={home.destinations} />
      <GatiShaktiBand data={home.gatiShakti} partners={getPartners()} destinations={home.destinations} />
      <Sustainability data={home.sustainability} />
      <BusinessValue benefits={home.benefits} />
      <SiteTourPreview data={home.siteTour} />
      <NewsPreview items={home.news} />
    </>
  );
}
