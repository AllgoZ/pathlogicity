import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getNavigation } from "@/lib/content";
import { ArrowLink } from "@/components/ui/Button";
import { SurveyGrid } from "@/components/ui/SurveyGrid";

/** Holding template for inner chapters (built after homepage sign-off — docs/UI-PLAN.md §6). */
const CHAPTERS: Record<string, { index: string; title: string[]; anchor: string }> = {
  "path-group": { index: "02", title: ["Path", "Group"], anchor: "/#path-group" },
  "logicity-advantage": { index: "03", title: ["The Logicity", "Advantage"], anchor: "/#advantage" },
  sustainability: { index: "04", title: ["Sustain-", "ability"], anchor: "/#sustainability" },
  "site-tour": { index: "05", title: ["Logicity", "360"], anchor: "/#site-tour" },
  news: { index: "06", title: ["News &", "Media"], anchor: "/#news" },
  blogs: { index: "07", title: ["Blogs"], anchor: "/" },
};

export const dynamicParams = false;
export function generateStaticParams() {
  return Object.keys(CHAPTERS).map((chapter) => ({ chapter }));
}

export async function generateMetadata({ params }: { params: Promise<{ chapter: string }> }): Promise<Metadata> {
  const { chapter } = await params;
  const c = CHAPTERS[chapter];
  return { title: c ? c.title.join(" ").replace("- ", "") : "Path Logicity" };
}

export default async function ChapterPage({ params }: { params: Promise<{ chapter: string }> }) {
  const { chapter } = await params;
  const c = CHAPTERS[chapter];
  if (!c) notFound();
  const nav = getNavigation().find((n) => n.href === `/${chapter}`);

  return (
    <section className="relative flex min-h-[86svh] items-end overflow-hidden bg-navy-950 pb-20 pt-40">
      <SurveyGrid />
      <div className="shell relative grid-12 gap-y-12">
        <div className="col-span-4 sm:col-span-8 lg:col-span-7">
          <p className="t-label">
            <span className="text-yellow-400">{c.index} /</span> Chapter in design
          </p>
          <h1 className="t-xl mt-6">
            {c.title.map((t) => (
              <span key={t} className="block">
                {t}
              </span>
            ))}
          </h1>
          <p className="t-body-l mt-6 max-w-[40ch] text-steel-300">This page follows homepage sign-off. Its sections are planned below.</p>
          <div className="mt-10">
            <ArrowLink href={c.anchor}>See the homepage preview</ArrowLink>
          </div>
        </div>
        {nav?.children ? (
          <ol className="col-span-4 self-end border-t border-white/10 sm:col-span-8 lg:col-span-4 lg:col-start-9">
            {nav.children.map((ch, i) => (
              <li key={ch.href} id={ch.href.split("#")[1]} className="flex gap-4 border-b border-white/10 py-4">
                <span className="t-micro text-yellow-400">{String(i + 1).padStart(2, "0")}</span>
                <span>
                  <span className="t-label block">{ch.label}</span>
                  {ch.note ? <span className="mt-1 block text-sm text-steel-500">{ch.note}</span> : null}
                </span>
              </li>
            ))}
          </ol>
        ) : null}
      </div>
    </section>
  );
}
