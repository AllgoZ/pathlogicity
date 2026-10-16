"use client";

import Image from "next/image";
import type { GalleryItem } from "@/lib/content/types";
import { Rail } from "@/components/ui/Rail";
import { Reveal, RevealLines } from "@/components/ui/Reveal";

/**
 * §05.5 — "The park, in renders". A free-scrolling rail: the page is never pinned or
 * captured (round 4 — the old pinned gallery locked ~5 screens of scroll). Drag, swipe,
 * arrows or ←/→ move it; scrolling the page past it always works.
 */
export function RendersGallery({ items }: { items: GalleryItem[] }) {
  return (
    <section id="renders" data-stage="believe" aria-labelledby="renders-title" className="relative overflow-hidden bg-stone py-[clamp(88px,12vh,144px)]">
      <div className="shell grid-12 items-end gap-y-6">
        <div className="col-span-4 sm:col-span-6 lg:col-span-7">
          <p className="t-label text-ink">
            <span data-idx className="text-indigo-700">05.5 /</span> The park
          </p>
          <RevealLines id="renders-title" lines={["The park,", "*in renders.*"]} className="t-xl mt-5 text-ink" />
        </div>
        <Reveal className="col-span-4 flex flex-col gap-2 sm:col-span-2 lg:col-span-4 lg:col-start-9">
          <p className="t-body-l text-steel-700">From the entry gate to the rail terminal — the park as it is planned.</p>
          <p className="t-micro text-steel-500">Illustrative renders</p>
        </Reveal>
      </div>

      <Rail label="Renders of Path Logicity" count={items.length} className="mt-12 lg:mt-14" trackClassName="gap-[clamp(16px,2vw,32px)]">
        {items.map((it, i) => (
          <li key={it.id} className="group w-[84vw] shrink-0 snap-start sm:w-[62vw] lg:w-[min(52vw,820px)]">
            <figure>
              <div className={`relative aspect-[16/10] overflow-hidden rounded-[2px] shadow-[var(--shadow-card)] ${it.fit === "contain" ? "bg-paper" : "bg-paper-3"}`}>
                <Image
                  src={it.media.src as string}
                  alt={it.media.alt}
                  fill
                  sizes="(min-width: 1024px) 52vw, 84vw"
                  draggable={false}
                  className={`${it.fit === "contain" ? "object-contain p-4" : "img-grade object-cover"} transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-[1.04]`}
                />
              </div>
              <figcaption className="mt-5 flex items-baseline gap-5">
                <span className="t-micro tnum text-indigo-700">{String(i + 1).padStart(2, "0")}</span>
                <span>
                  <span className="t-s block text-ink">{it.title}</span>
                  <span className="mt-1 block text-[0.9375rem] text-steel-700">{it.caption}</span>
                </span>
              </figcaption>
            </figure>
          </li>
        ))}
        <li aria-hidden className="w-px shrink-0 sm:w-[var(--margin)]" />
      </Rail>
    </section>
  );
}
