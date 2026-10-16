"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Homepage } from "@/lib/content";
import type { SiteSettings } from "@/lib/content/types";
import { accent } from "@/lib/accent";
import { gsap, MQ } from "@/lib/motion/gsap";
import { useMotion } from "@/lib/motion/hooks";
import { ArrowLink, ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Route, type RouteHandle } from "@/components/ui/Route";

/** Route across the hero: starts at the location block, crosses the image seam and loops back. The page-wide RouteSpine takes over below the hero. */
const HERO_ROUTE =
  "M 38 66 C 46 66, 52 46, 62 40 C 74 33, 92 38, 90 54 C 88 72, 62 82, 44 80";

/**
 * §01 — Hero. Light and image-led: the headline and location sit on porcelain, the
 * render opens out to the right across a diagonal seam. No opening animation —
 * the page is complete on first paint; the route line draws as you scroll.
 */
export function Hero({ data, settings }: { data: Homepage["hero"]; settings: SiteSettings }) {
  const section = useRef<HTMLElement>(null);
  const media = useRef<HTMLDivElement>(null);
  const route = useRef<RouteHandle>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(false);

  // Respect Save-Data / reduced motion: poster only, user can press play.
  useEffect(() => {
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (conn?.saveData || window.matchMedia("(prefers-reduced-motion: reduce)").matches) setPaused(true);
  }, []);

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    if (paused) v.pause();
    else v.play().catch(() => setPaused(true));
  }, [paused]);

  useMotion(section, (mm) => {
    mm.add(MQ.motion, () => {
      const o = { p: 0 };
      route.current?.set(0);
      gsap.to(o, {
        p: 1,
        ease: "none",
        onUpdate: () => route.current?.set(o.p),
        scrollTrigger: { trigger: section.current, start: "top top", end: "bottom top", scrub: 0.6 },
      });
      // slow parallax on the render — earned by scrolling, not played on load
      gsap.to(media.current, {
        yPercent: 5,
        ease: "none",
        scrollTrigger: { trigger: section.current, start: "top top", end: "bottom top", scrub: true },
      });
    });
    mm.add("(prefers-reduced-motion: reduce)", () => {
      route.current?.set(1);
    });
  });

  return (
    <>
      <section
        id="top"
        ref={section}
        data-stage="discover"
        aria-labelledby="hero-title"
        className="relative flex flex-col overflow-hidden bg-porcelain lg:block lg:min-h-[max(700px,100svh)]"
      >
        {/* Media — one element, stacked under the text on phones, a diagonal panel on desktop */}
        <div className="relative order-2 mt-10 aspect-[16/10] w-full lg:absolute lg:inset-y-0 lg:right-0 lg:mt-0 lg:aspect-auto lg:w-[62%] lg:pt-[88px]">
          <div className="relative h-full w-full overflow-hidden lg:[clip-path:polygon(13%_0,100%_0,100%_100%,0_100%)]">
            <div ref={media} className="absolute inset-x-0 -inset-y-[6%] will-change-transform" data-paused={paused}>
              {data.video.src ? (
                <video
                  ref={video}
                  className="h-full w-full object-cover"
                  autoPlay={!paused}
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  poster={data.video.poster ?? undefined}
                  aria-label={data.video.alt}
                >
                  <source src={data.video.src} type="video/mp4" />
                </video>
              ) : data.video.poster ? (
                <Image
                  src={data.video.poster}
                  alt={data.video.alt}
                  fill
                  preload
                  fetchPriority="high"
                  sizes="(min-width: 1024px) 62vw, 100vw"
                  className="object-cover object-[30%_50%]"
                />
              ) : null}
            </div>
          </div>
          <p className="t-micro absolute bottom-4 right-4 z-10 bg-paper/90 px-3 py-1.5 text-steel-700 backdrop-blur-sm">Illustrative render</p>
        </div>

        <Route ref={route} d={HERO_ROUTE} initial={0} base={false} tone="light" className="z-[5] max-lg:hidden" strokeWidth={1.5} />

        {/* Content */}
        <div className="shell relative z-10 order-1 pt-[104px] lg:flex lg:min-h-[max(700px,100svh)] lg:flex-col lg:justify-center lg:pb-16 lg:pt-[calc(88px+16px)]">
          <div className="lg:w-[48%] lg:max-w-[660px]">
            <h1 id="hero-title" className="t-hero text-ink">
              {data.headline.map((line) => (
                <span key={line} className="block">
                  {accent(line)}
                </span>
              ))}
            </h1>

            {/* The location, stated plainly and large */}
            <div className="mt-8 flex gap-4 border-l-[3px] border-yellow-400 pl-5">
              <div>
                <p className="t-micro flex items-center gap-2 text-steel-500">
                  <Icon name="crosshair" size={16} className="text-indigo-700" />
                  Location
                </p>
                <p className="mt-1 text-[clamp(1.5rem,2.3vw,2.125rem)] font-bold leading-[1.1] tracking-[-0.02em] text-ink">
                  {data.location.primary}, {data.location.secondary}
                </p>
                <ul className="mt-3 flex flex-wrap gap-2" aria-label="Road access">
                  {data.location.roads.map((r) => (
                    <li key={r} className="t-micro border border-ink/15 bg-paper px-3 py-1 text-indigo-700">
                      {r}
                    </li>
                  ))}
                  {settings.coordinates ? (
                    <li className="t-micro px-1 py-1 text-steel-700">
                      {settings.coordinates.lat.toFixed(4)}°N / {settings.coordinates.lng.toFixed(4)}°E
                    </li>
                  ) : null}
                </ul>
              </div>
            </div>

            <p className="t-body-l mt-6 max-w-[44ch] text-steel-700">{data.copy}</p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-7">
              <ButtonLink href="#explore" className="w-full sm:w-auto">
                Explore the project
              </ButtonLink>
              <ArrowLink href="#enquire" className="justify-center whitespace-nowrap sm:justify-start">
                Enquire leasing now
              </ArrowLink>
            </div>

            {/* film control only when there is a film (the hero is a still until drone footage arrives) */}
            {data.video.src ? (
              <button
                type="button"
                onClick={() => setPaused((p) => !p)}
                aria-pressed={paused}
                className="t-micro mt-6 flex h-10 items-center gap-2 text-steel-700 transition-colors hover:text-ink"
              >
                <Icon name={paused ? "play" : "pause"} size={14} />
                {paused ? "Play film" : "Pause film"}
              </button>
            ) : null}
          </div>
        </div>

        <div aria-hidden className="pinwheel-stripe absolute inset-x-0 bottom-0 z-20 h-[3px]" />
      </section>
      <div data-hero-end aria-hidden />
    </>
  );
}
