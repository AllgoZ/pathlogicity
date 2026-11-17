"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import type { GalleryItem } from "@/lib/content/types";
import { Icon } from "@/components/ui/Icon";
import { ImageViewer } from "@/components/ui/ImageViewer";
import { Rail } from "@/components/ui/Rail";
import { Reveal, RevealLines } from "@/components/ui/Reveal";
import { gsap, MQ, ScrollTrigger } from "@/lib/motion/gsap";
import { useIsoLayoutEffect } from "@/lib/motion/hooks";

/** On desktop the gallery travels sideways as the page scrolls down. Page pixels per sideways pixel (< 1: the page is held only for part of the travel). */
const HOLD = 0.65;

/**
 * §05.5 — "Path Logicity, in renders" (client round 7: was "The park, in renders"; now sits before PATH Group).
 * Round 9: on desktop the section holds the screen and the renders slide sideways as the visitor scrolls DOWN (the page moves on
 * once the last render has been shown). Drag, the arrows and ←/→ still work and move the page to match. Phones, tablets and
 * reduced motion keep the free-scrolling rail (drag, swipe, arrows, full-screen viewer): the page is never captured there.
 */
export function RendersGallery({ items }: { items: GalleryItem[] }) {
  const section = useRef<HTMLElement>(null);

  useIsoLayoutEffect(() => {
    const el = section.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add(MQ.desktop, () => {
      const scroller = el.querySelector<HTMLElement>(".rail");
      if (!scroller) return;
      el.setAttribute("data-hscroll", "on"); // CSS: the section fills the screen, cards are sized to fit it, snapping is off
      const maxX = () => Math.max(0, scroller.scrollWidth - scroller.clientWidth);
      let last = 0; // the sideways position we last set ourselves
      let manualUntil = 0; // while the strip is being moved by hand (arrows, drag, keys) the page follows it, not the other way round
      const apply = (p: number) => {
        if (performance.now() < manualUntil) return;
        const x = Math.round(p * maxX());
        last = x;
        if (Math.abs(scroller.scrollLeft - x) > 0.5) scroller.scrollLeft = x;
      };
      const st = ScrollTrigger.create({
        trigger: el,
        start: "top top",
        end: () => "+=" + Math.max(1, Math.round(maxX() * HOLD)),
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => apply(self.progress),
        onRefresh: (self) => apply(self.progress),
      });
      // the arrows, a mouse drag or ←/→ move the strip: while the section is held, carry the page along so the two stay in step
      const onScroll = () => {
        const x = scroller.scrollLeft;
        if (Math.abs(x - last) < 1.5 || !st.isActive || maxX() <= 0) return;
        last = x;
        manualUntil = performance.now() + 180;
        const y = st.start + (x / maxX()) * (st.end - st.start);
        if (window.__lenis) window.__lenis.scrollTo(y, { immediate: true });
        else window.scrollTo(0, y);
      };
      scroller.addEventListener("scroll", onScroll, { passive: true });
      return () => {
        scroller.removeEventListener("scroll", onScroll);
        el.removeAttribute("data-hscroll");
        scroller.scrollLeft = 0;
      };
    });
    return () => mm.revert();
  }, []);

  // phones / tablets: tap a render to open it full-screen
  const [open, setOpen] = useState<number | null>(null);
  const openIfSmall = (i: number) => {
    if (window.matchMedia("(max-width: 1023.98px)").matches) setOpen(i);
  };
  return (
    <section
      ref={section}
      id="renders"
      data-stage="believe"
      aria-labelledby="renders-title"
      className="relative overflow-hidden bg-stone py-[clamp(88px,12vh,144px)] data-[hscroll=on]:flex data-[hscroll=on]:min-h-svh data-[hscroll=on]:flex-col data-[hscroll=on]:justify-center data-[hscroll=on]:py-[clamp(40px,6vh,72px)]"
    >
      <div className="shell grid-12 items-end gap-y-6">
        <div className="col-span-4 sm:col-span-6 lg:col-span-7">
          <p className="t-label flex items-center gap-2.5 text-ink">
            <span aria-hidden className="text-indigo-700">•</span> Renders
          </p>
          <RevealLines id="renders-title" lines={["Path Logicity,", "*in renders.*"]} className="t-xl mt-5 text-ink" />
        </div>
        <Reveal className="col-span-4 flex flex-col gap-2 sm:col-span-2 lg:col-span-4 lg:col-start-9">
          <p className="t-body-l text-steel-700">From the entry gate to the rail terminal — the park as it is planned.</p>
          <p className="t-micro text-steel-500">Illustrative renders</p>
        </Reveal>
      </div>

      <Rail label="Renders of Path Logicity" count={items.length} className="mt-12 lg:mt-14" trackClassName="gap-[clamp(16px,2vw,32px)] [[data-hscroll=on]_&]:snap-none">
        {items.map((it, i) => (
          <li key={it.id} className="group w-[84vw] shrink-0 snap-start sm:w-[62vw] lg:w-[min(52vw,820px)] [[data-hscroll=on]_&]:w-[clamp(420px,calc((100svh_-_450px)*1.6),min(52vw,820px))]">
            <figure>
              <div onClick={() => openIfSmall(i)} className={`relative aspect-[16/10] overflow-hidden rounded-[2px] shadow-[var(--shadow-card)] ${it.fit === "contain" ? "bg-paper" : "bg-paper-3"}`}>
                <Image
                  src={it.media.src as string}
                  alt={it.media.alt}
                  fill
                  sizes="(min-width: 1024px) 52vw, 84vw"
                  draggable={false}
                  className={`${it.fit === "contain" ? "object-contain p-4" : "img-grade object-cover"} transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-[1.04]`}
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpen(i);
                  }}
                  aria-label={`View ${it.title} full screen`}
                  className="absolute bottom-3 right-3 flex h-11 w-11 items-center justify-center bg-paper/90 text-ink shadow-md backdrop-blur-sm transition-colors active:bg-yellow-400 lg:hidden"
                >
                  <Icon name="expand" size={18} />
                </button>
              </div>
              <figcaption className="mt-5 flex items-baseline gap-5">
                <span aria-hidden className="t-micro tnum text-indigo-700">•</span>
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
      {open !== null ? (
        <ImageViewer
          items={items.map((it) => ({ src: it.media.src as string, alt: it.media.alt, title: it.title, caption: it.caption, fit: it.fit }))}
          index={open}
          onIndex={setOpen}
          onClose={() => setOpen(null)}
        />
      ) : null}
    </section>
  );
}
