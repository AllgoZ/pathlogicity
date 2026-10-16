import type { Metadata } from "next";
import { getHomepage, getNavigation } from "@/lib/content";
import { PageHero } from "@/components/layout/PageHero";
import { PathGroup } from "@/components/path-group/PathGroup";

export const metadata: Metadata = {
  title: "PATH Group",
  description: "The infrastructure experience behind Path Logicity: from building India's infrastructure to connecting its supply chains.",
};

export default function PathGroupPage() {
  const home = getHomepage();
  const links = getNavigation().find((n) => n.href === "/path-group")?.children;
  return (
    <div data-inner>
      <PageHero kicker="PATH Group" lines={["The group behind", "*Path Logicity*"]} intro="The experience and credibility behind India's largest multimodal logistics hub." links={links} />
      <PathGroup data={home.pathGroup} standalone />
    </div>
  );
}
