"use client";

import Image from "next/image";
import { useRef } from "react";
import type { GalleryItem } from "@/lib/content/types";
import { gsap, MQ } from "@/lib/motion/gsap";
import { useMotion } from "@/lib/motion/hooks";
import { RevealLines } from "@/components/ui/Reveal";

/**
 * §05.5 — "The park, in renders". Midnight anchor. On desktop the section pins
 * and the track scrolls sideways with a gold progress line; on mobile (and
 * under reduced motion) it is a native swipe row with snap points.
 */
export function RendersGallery({ items }: { items: GalleryItem[] }) {
  const section = useRef<HTMLElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLUListElement>(null);
  const bar = useRef<HTMLSpanElement>(null);

  useMotion(section, (mm) => {
    mm.add(MQ.desktop, () => {
      const t = track.current!;
      const distance = () => Math.max(0, t.scrollWidth - viewport.current!.clientWidth);
      const tw = gsap.to(t, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: section.current,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (bar.current) bar.current.style.transform = `scaleX(${self.progress})`;
          },
        },
      });
      // each card's image drifts slightly against the track — depth while it travels
      gsap.utils.toArray<HTMLElement>("[data-drift]", t).forEach((img) => {
        gsap.fromTo(img, { xPercent: -6 }, { xPercent: 6, ease: "none", scrollTrigger: { trigger: section.current, start: "top top", end: () => `+=${distance()}`, scrub: true } });
      });
      return () => tw.scrollTrigger?.kill();
    });
  });

  return (
    <section
      ref={section}
      id="renders"
      data-surface="dark"
      data-stage="believe"
      aria-labelledby="renders-title"
      className="on-dark grain relative overflow-hidden bg-midnight py-[clamp(88px,12vh,140px)] text-paper lg:flex lg:h-svh lg:flex-col lg:justify-center lg:py-0"
    >
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(45%_50%_at_85%_10%,rgb(231_172_0/0.1),transparent_70%),radial-gradient(60%_60%_at_0%_100%,rgb(32_31_133/0.55),transparent_70%)]" />

      <div className="shell relative grid-12 items-end gap-y-6">
        <div className="col-span-4 sm:col-span-6 lg:col-span-7">
          <p className="t-label text-paper">
            <span className="text-yellow-400">05.5 /</span> The park
          </p>
          <RevealLines id="renders-title" lines={["The park,", "*in renders.*"]} className="t-xl mt-5 text-paper" />
        </div>
        <div className="col-span-4 flex flex-col gap-4 sm:col-span-2 lg:col-span-3 lg:col-start-10">
          <p className="text-[0.9375rem] leading-relaxed text-paper/65">From the entry gate to the rail terminal — the park as it is planned.</p>
          <p className="t-micro text-paper/45">Illustrative renders</p>
        </div>
      </div>

      <div ref={viewport} className="relative mt-12 lg:mt-16">
        <ul
          ref={track}
          className="no-scrollbar flex snap-x snap-mandatory gap-[clamp(16px,2vw,32px)] overflow-x-auto px-[var(--margin)] pb-2 will-change-transform lg:snap-none lg:overflow-visible"
          aria-label="Renders of Path Logicity"
        >
          {items.map((it, i) => (
            <li key={it.id} className="group w-[84vw] shrink-0 snap-start sm:w-[62vw] lg:w-[min(56vw,880px)]">
              <figure>
                <div className={`relative aspect-[16/10] overflow-hidden rounded-[2px] ${it.fit === "contain" ? "bg-paper" : "bg-midnight-2"}`}>
                  <div data-drift={it.fit === "contain" ? undefined : ""} className="absolute -inset-x-[7%] inset-y-0">
                    <Image
                      src={it.media.src as string}
                      alt={it.media.alt}
                      fill
                      sizes="(min-width: 1024px) 60vw, 85vw"
                      className={`${it.fit === "contain" ? "object-contain p-4" : "object-cover [filter:contrast(1.06)_saturate(0.78)]"} transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-[1.04]`}
                    />
                  </div>
                  {it.fit === "contain" ? null : <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-midnight/40 via-transparent to-transparent" />}
                </div>
                <figcaption className="mt-5 flex items-baseline gap-5">
                  <span className="t-micro text-yellow-400">{String(i + 1).padStart(2, "0")}</span>
                  <span>
                    <span className="block font-display text-[clamp(1.125rem,1.5vw,1.5rem)] font-semibold tracking-[-0.02em] text-paper">{it.title}</span>
                    <span className="mt-1 block text-[0.9375rem] text-paper/60">{it.caption}</span>
                  </span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>

      <div className="shell relative mt-10 hidden items-center gap-5 lg:flex">
        <span className="t-micro text-paper/45">Scroll</span>
        <span aria-hidden className="relative block h-px flex-1 bg-white/15">
          <span ref={bar} className="absolute inset-0 origin-left scale-x-0 bg-yellow-400" />
        </span>
        <span className="t-micro tnum text-paper/45">{String(items.length).padStart(2, "0")} renders</span>
      </div>
    </section>
  );
}
