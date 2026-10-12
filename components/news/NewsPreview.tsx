"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import type { NewsItem, NewsType } from "@/lib/content/types";
import { AssetSlot } from "@/components/ui/AssetSlot";
import { ArrowLink } from "@/components/ui/Button";
import { ContentSlot } from "@/components/ui/ContentSlot";
import { Icon } from "@/components/ui/Icon";
import { RevealLines } from "@/components/ui/Reveal";

const TABS: { id: NewsType; label: string }[] = [
  { id: "news", label: "News" },
  { id: "media", label: "Media coverage" },
  { id: "update", label: "Project updates" },
  { id: "event", label: "Events" },
];

/** §10 — Path Logicity in the news. CMS-driven; designed to stay rich when sparse. */
export function NewsPreview({ items }: { items: NewsItem[] }) {
  const [tab, setTab] = useState<NewsType>("update");
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const list = items.filter((i) => i.type === tab);
  const [featured, ...rest] = list;

  const onKey = (e: KeyboardEvent, i: number) => {
    const n = TABS.length;
    const next = e.key === "ArrowRight" ? (i + 1) % n : e.key === "ArrowLeft" ? (i - 1 + n) % n : e.key === "Home" ? 0 : e.key === "End" ? n - 1 : -1;
    if (next < 0) return;
    e.preventDefault();
    setTab(TABS[next].id);
    tabRefs.current[next]?.focus();
  };

  return (
    <section id="news" data-stage="believe" aria-labelledby="news-title" className="on-light relative bg-paper text-navy-950 section-pad">
      <div className="shell">
        <div className="grid-12 gap-y-6">
          <div className="col-span-4 sm:col-span-8 lg:col-span-8">
            <p className="t-label">
              <span className="text-navy-950/45">10 /</span> Newsroom
            </p>
            <RevealLines id="news-title" lines={["Path Logicity", "in the news"]} className="t-xl mt-6" />
          </div>
          <div className="col-span-4 flex items-end sm:col-span-8 lg:col-span-3 lg:col-start-10 lg:justify-end">
            <ArrowLink href="/news" tone="dark">
              View all
            </ArrowLink>
          </div>
        </div>

        <div role="tablist" aria-label="News categories" className="no-scrollbar mt-12 flex gap-8 overflow-x-auto border-b border-navy-950/15 lg:mt-16">
          {TABS.map((t, i) => (
            <button
              key={t.id}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              role="tab"
              id={`tab-${t.id}`}
              aria-selected={tab === t.id}
              aria-controls={`panel-${t.id}`}
              tabIndex={tab === t.id ? 0 : -1}
              onClick={() => setTab(t.id)}
              onKeyDown={(e) => onKey(e, i)}
              className={`relative shrink-0 pb-4 text-[13px] font-semibold uppercase tracking-[0.07em] transition-colors ${tab === t.id ? "text-navy-950" : "text-steel-700 hover:text-navy-950"}`}
            >
              {t.label}
              <span aria-hidden className={`absolute -bottom-px left-0 h-[2px] w-full origin-left bg-navy-950 transition-transform duration-300 ${tab === t.id ? "scale-x-100" : "scale-x-0"}`} />
            </button>
          ))}
        </div>

        <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`} key={tab} className="mt-10 [animation:fade-up_.6s_var(--ease-out-expo)_both] lg:mt-14">
          {featured ? (
            <div className="grid-12 gap-y-10">
              <article className={`group col-span-4 sm:col-span-8 ${rest.length ? "lg:col-span-7" : "lg:col-span-12"}`}>
                <div className="overflow-hidden">
                  <div className="transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.02]">
                    <AssetSlot slot={featured.image.slot} spec={featured.image.spec} ratio="16/10" tone="paper" variant={5} label={featured.image.alt || featured.headline || "Featured news image"} src={featured.image.src} focus="center" sizes="(min-width: 1024px) 55vw, 100vw" />
                  </div>
                </div>
                <Meta item={featured} />
                <h3 className="t-m mt-3 max-w-[22ch]">{featured.headline ?? <ContentSlot tone="light">Featured headline — to be published</ContentSlot>}</h3>
                <span className="mt-5 inline-flex items-center gap-3 text-[13px] font-semibold uppercase tracking-[0.07em]">
                  Read more <Icon name="arrow-right" size={18} className="arrow-nudge" />
                </span>
              </article>
              {rest.length ? (
                <ul className="col-span-4 sm:col-span-8 lg:col-span-5">
                  {rest.slice(0, 3).map((n) => (
                    <li key={n.id} className="group border-b border-navy-950/15 py-6 first:border-t first:pt-6 lg:first:border-t-0 lg:first:pt-0">
                      <Meta item={n} />
                      <div className="mt-3 flex items-start justify-between gap-6">
                        <p className="t-s max-w-[28ch]">{n.headline ?? <ContentSlot tone="light">Headline — to be published</ContentSlot>}</p>
                        <Icon name="arrow-right" size={20} className="arrow-nudge mt-1 shrink-0" />
                      </div>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          ) : (
            <EmptyState label={TABS.find((t) => t.id === tab)!.label} />
          )}
          {list.some((i) => i.placeholder) ? (
            <p className="t-micro mt-10 text-steel-700">CMS layout preview — no articles have been published yet. Placeholders are never shown as real coverage.</p>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function Meta({ item }: { item: NewsItem }) {
  return (
    <p className="t-micro mt-5 flex flex-wrap gap-3 text-steel-700">
      {item.source ?? <ContentSlot tone="light">Source</ContentSlot>}
      <span aria-hidden>·</span>
      {item.date ?? <ContentSlot tone="light">Date</ContentSlot>}
    </p>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="grid-12 items-center gap-y-8 border border-navy-950/15 p-8 lg:p-14">
      <div className="col-span-4 sm:col-span-8 lg:col-span-7">
        <p className="t-micro text-steel-700">{label}</p>
        <p className="t-m mt-3 max-w-[20ch]">Updates are on their way.</p>
        <p className="mt-3 max-w-[44ch] text-steel-700">Meanwhile, follow the project as it takes shape — milestones are tracked live in Project Status.</p>
      </div>
      <div className="col-span-4 sm:col-span-8 lg:col-span-4 lg:col-start-9 lg:justify-self-end">
        <ArrowLink href="#status" tone="dark">
          Follow project status
        </ArrowLink>
      </div>
    </div>
  );
}
