"use client";

import { useEffect, useRef, useState } from "react";
import type { Homepage } from "@/lib/content";
import type { SiteSettings } from "@/lib/content/types";
import { accent } from "@/lib/accent";
import { gsap, MQ } from "@/lib/motion/gsap";
import { useMotion } from "@/lib/motion/hooks";
import { AssetSlot } from "@/components/ui/AssetSlot";
import { ArrowLink, ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Route, type RouteHandle } from "@/components/ui/Route";

/** Route across the aerial: enters left, passes the site reticle, loops and exits down at x=6% into §02. */
const HERO_ROUTE =
  "M -2 66 C 16 66, 26 54, 44 52 C 60 50, 66 32, 76 31 C 86 30, 95 40, 94 56 C 93 72, 72 79, 48 81 C 26 83, 8 84, 6 92 L 6 102";

export function Hero({ data, settings }: { data: Homepage["hero"]; settings: SiteSettings }) {
  const section = useRef<HTMLElement>(null);
  const media = useRef<HTMLDivElement>(null);
  const cover = useRef<HTMLDivElement>(null);
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
    const q = gsap.utils.selector(section);

    mm.add(MQ.desktop, () => {
      const o = { p: 0 };
      route.current?.set(0);
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: section.current, start: "top top", end: "+=140%", scrub: 0.6, pin: true, anticipatePin: 1 },
      });
      tl.to(media.current, { scale: 1.12, duration: 0.4 }, 0)
        .to(q("[data-hero-line]"), { yPercent: -115, opacity: 0, stagger: 0.035, duration: 0.28, ease: "power2.in" }, 0.08)
        .to(q("[data-hero-hud]"), { opacity: 0, y: -24, duration: 0.2 }, 0.12)
        .to(q("[data-hero-reticle]"), { scale: 0.6, opacity: 0.35, duration: 0.3 }, 0.2)
        .to(o, { p: 1, duration: 0.62, onUpdate: () => route.current?.set(o.p) }, 0.24)
        .to(q("[data-hero-reticle]"), { opacity: 0, duration: 0.15 }, 0.72)
        .to(cover.current, { opacity: 1, duration: 0.3 }, 0.7);
    });

    mm.add(MQ.mobile, () => {
      const o = { p: 0 };
      route.current?.set(0);
      gsap.to(o, { p: 1, duration: 2.4, delay: 1.1, ease: "power2.inOut", onUpdate: () => route.current?.set(o.p) });
      gsap.to(media.current, {
        scale: 1.06,
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
        className="on-dark relative h-svh min-h-[640px] overflow-hidden bg-midnight lg:min-h-[680px]"
      >
        {/* Media */}
        <div ref={media} className="absolute inset-0 origin-[70%_40%] will-change-transform" data-paused={paused}>
          {/* M2 — the image opens from a centred window and settles from 1.18× (transform-only → composited) */}
          <div className="hero-reveal absolute inset-0 overflow-hidden">
          <div className="hero-reveal-inner absolute inset-0">
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
          ) : (
            <AssetSlot slot={data.video.slot} annotate={false} className="h-full w-full [&_img]:[filter:none]" label={data.video.alt} src={data.video.poster} focus="62% 60%" priority reveal={false} sizes="100vw" />
          )}
          </div>
          </div>
        </div>
        {/* Cinematic veils — midnight carries the headline at lower left; the render
            stays visible on the right. A cool indigo wash neutralises the render's warm cast. */}
        <div aria-hidden className="absolute inset-0 bg-[linear-gradient(90deg,rgb(13_14_53/0.92)_0%,rgb(13_14_53/0.66)_36%,rgb(13_14_53/0.12)_68%,transparent_100%)]" />
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-[58%] bg-gradient-to-t from-midnight via-midnight/70 to-transparent" />
        <div aria-hidden className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-midnight/70 to-transparent" />
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(50%_60%_at_8%_100%,rgb(231_172_0/0.16),transparent_70%)]" />
        <div ref={cover} aria-hidden className="absolute inset-0 z-[15] bg-porcelain opacity-0" />

        <Route ref={route} d={HERO_ROUTE} initial={0} base={false} tone="dark" className="z-[16]" strokeWidth={1.5} />

        {/* Site reticle — the location becomes a place you are looking at */}
        <div data-hero-reticle aria-hidden className="absolute left-[62%] top-[42%] z-10 hidden -translate-x-1/2 -translate-y-1/2 lg:block">
          <div className="intro-fade relative" style={{ ["--d" as string]: "1100ms" }}>
          <svg width="72" height="72" viewBox="0 0 72 72" fill="none" className="text-yellow-400">
            <circle cx="36" cy="36" r="22" stroke="currentColor" strokeOpacity="0.8" />
            <circle cx="36" cy="36" r="34" stroke="currentColor" strokeOpacity="0.25" strokeDasharray="2 5" />
            <path d="M36 4v16M36 52v16M4 36h16M52 36h16" stroke="currentColor" />
            <circle cx="36" cy="36" r="2.5" fill="currentColor" />
          </svg>
          <span className="absolute left-[60px] top-[12px] block h-px w-14 origin-left -rotate-[28deg] bg-yellow-400/70" />
          <span className="absolute left-[106px] top-[-30px] whitespace-nowrap border-l-2 border-yellow-400 bg-midnight/70 px-3 py-2 backdrop-blur-md">
            <span className="t-micro block text-yellow-400">Site</span>
            <span className="t-label mt-0.5 block text-paper">{data.siteTag}</span>
          </span>
          </div>
        </div>

        {/* Placeholder annotation (hidden with ?annotations=off, and once a real asset exists) */}
        {!data.video.src && !data.video.poster ? (
          <p
            aria-hidden
            className="slot-annotation t-micro absolute right-[calc(var(--margin)*0.5)] top-1/2 z-10 hidden origin-right -translate-y-1/2 translate-x-1/2 -rotate-90 whitespace-nowrap text-paper/40 lg:block"
            style={{ right: "max(12px, calc(var(--margin) * 0.35))" }}
          >
            Asset slot 01 — {data.video.slot} · {data.video.spec}
          </p>
        ) : null}

        {/* Content */}
        <div className="shell relative z-20 flex h-full flex-col pb-5 pt-[calc(64px+5vh)] lg:pb-7 lg:pt-[calc(88px+3.5vh)]">
          <h1 id="hero-title" className="t-hero max-w-[14ch] text-paper">
            {/* M2 — words rise one by one from masks; the serif accent word arrives last */}
            {(() => {
              let w = 0;
              const n = data.headline.join(" ").split(" ").length;
              return data.headline.map((line) => (
                <span key={line} data-hero-line className="block">
                  {line.split(" ").map((word, j) => {
                    const isAccent = word.includes("*");
                    const delay = isAccent ? 260 + n * 70 + 120 : 260 + w++ * 70;
                    return (
                      <span key={j} className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-top">
                        <span className="intro-rise" style={{ display: "inline-block", ["--d" as string]: `${delay}ms` }}>
                          {accent(word)}
                        </span>
                        {j < line.split(" ").length - 1 ? " " : null}
                      </span>
                    );
                  })}
                </span>
              ));
            })()}
          </h1>

          <div data-hero-hud className="mt-auto">
            <div className="intro-fade grid-12 gap-y-6 border-t border-white/20 pt-5 lg:pt-6" style={{ ["--d" as string]: "650ms" }}>
              {/* Location anchor */}
              <div className="col-span-4 flex gap-4 sm:col-span-4 lg:col-span-4">
                <Icon name="crosshair" size={30} className="mt-1 shrink-0 text-yellow-400" />
                <div>
                  <p className="t-micro text-paper/60">Location</p>
                  <p className="mt-1 font-display text-[clamp(1.375rem,2vw,2rem)] font-semibold leading-[1.05] tracking-[-0.02em] text-paper">
                    {data.location.primary}
                  </p>
                  <p className="font-display text-[clamp(1.375rem,2vw,2rem)] font-normal leading-[1.1] tracking-[-0.02em] text-paper/70">
                    {data.location.secondary}
                  </p>
                  <p className="t-micro mt-3 text-paper/60">
                    {data.location.roads.join("  ·  ")}
                    {settings.coordinates ? (
                      <span className="ml-3 text-paper/75">
                        {settings.coordinates.lat.toFixed(4)}°N / {settings.coordinates.lng.toFixed(4)}°E
                      </span>
                    ) : null}
                  </p>
                </div>
              </div>

              <p className="t-body-l col-span-4 max-w-[34ch] text-paper/80 sm:col-span-4 lg:col-span-3 lg:pt-1">{data.copy}</p>

              <div className="col-span-4 flex flex-col gap-3 sm:col-span-8 sm:flex-row sm:items-center lg:col-span-5 lg:flex-col lg:items-end lg:justify-start xl:flex-row xl:items-start xl:justify-end xl:gap-7">
                <ButtonLink href="#explore" className="w-full sm:w-auto">
                  Explore the project
                </ButtonLink>
                <ArrowLink href="#enquire" tone="light" className="justify-center whitespace-nowrap sm:justify-start xl:h-14">
                  Enquire leasing now
                </ArrowLink>
              </div>
            </div>

            <div className="intro-fade mt-4 flex items-center justify-between lg:mt-5" style={{ ["--d" as string]: "900ms" }}>
              <p className="t-micro flex items-center gap-3 text-paper/60">
                <span aria-hidden className="relative block h-4 w-px overflow-hidden bg-white/20">
                  <span className="absolute left-0 top-0 block h-1.5 w-px bg-yellow-400" style={{ animation: "scroll-cue 2.4s var(--ease-route) infinite" }} />
                </span>
                Scroll to enter
              </p>
              {/* film control only when there is a film (the hero is a still until drone footage arrives) */}
              {data.video.src ? (
                <button
                  type="button"
                  onClick={() => setPaused((p) => !p)}
                  aria-pressed={paused}
                  className="t-micro flex h-10 items-center gap-2 px-2 text-paper/60 transition-colors hover:text-paper"
                >
                  <Icon name={paused ? "play" : "pause"} size={14} />
                  {paused ? "Play film" : "Pause film"}
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </section>
      <div data-hero-end aria-hidden />
    </>
  );
}
