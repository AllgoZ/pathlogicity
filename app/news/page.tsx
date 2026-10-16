import type { Metadata } from "next";
import { getHomepage } from "@/lib/content";
import { PageHero } from "@/components/layout/PageHero";
import { NewsPreview } from "@/components/news/NewsPreview";

export const metadata: Metadata = {
  title: "News & Media",
  description: "News, media coverage, project updates and events from Path Logicity.",
};

export default function NewsPage() {
  const home = getHomepage();
  return (
    <div data-inner>
      <PageHero kicker="News" lines={["News &", "*media*"]} intro="News, media coverage, project updates and events." />
      <NewsPreview items={home.news} standalone />
    </div>
  );
}
