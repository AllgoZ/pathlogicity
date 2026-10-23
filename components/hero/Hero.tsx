"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { Homepage } from "@/lib/content";
import type { SiteSettings } from "@/lib/content/types";
import { gsap, MQ } from "@/lib/motion/gsap";
import { useMotion } from "@/lib/motion/hooks";
import { ArrowLink, ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Route, type RouteHandle } from "@/components/ui/Route";

/** Route across the render: enters left, passes the site reticle, loops and exits down at x=6% into §02 (where ScaleIndex carries it on). */
const HERO_ROUTE =
  "M -2 66 C 16 66, 26 54, 44 52 C 60 50, 66 32, 76 31 C 86 30, 95 40, 94 56 C 93 72, 72 79, 48 81 C 26 83, 8 84, 6 92 L 6 102";

/**
 * Phones / tablets: the line lives in the clear window of the render between the headline and the location
 * bar (so it never crosses text), sweeps across the image and leaves at the right. Coordinates are 0–100
 * within that window.
 */
const MOBILE_ROUTE = "M -2 66 C 16 28, 34 82, 56 50 C 72 28, 88 44, 102 18";
/** the site marker sits where the first segment ends (56%, 50%) */
const MOBILE_PIN = { x: 56, y: 50, at: 0.5 };

/**
 * §01 — Hero. The render (or, once supplied, the Warehouse 17 site photograph) runs full-bleed behind the copy
 * under a porcelain wash; the location, intro and actions sit on a bottom bar. On desktop the hero pins briefly
 * as you scroll: the headline lifts away, the reticle shrinks and the route line draws out across the image and
 * down into §02.
 *
 * Banner motion (client round 5), all CSS so nothing flashes before hydration and nothing runs under reduced
 * motion: the image drifts slowly (`hero-drift`), the headline lines rise through their masks (`hero-rise`), the
 * bottom bar fades up (`hero-fade`) and the site reticle pings (`hero-ping`).
 */
export function Hero({ data, settings }: { data: Homepage["hero"]; settings: SiteSettings }) {
  const section = useRef<HTMLElement>(null);
  const media = useRef<HTMLDivElement>(null);
  const cover = useRef<HTMLDivElement>(null);
  const route = useRef<RouteHandle>(null);
  const mroute = useRef<RouteHandle>(null);
  const pin = useRef<HTMLSpanElement>(null);
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
      let pinned = false;
      mroute.current?.set(0);
      gsap.set(pin.current, { opacity: 0, scale: 0.4 });
      gsap.to(o, {
        p: 1,
        duration: 2.2,
        delay: 0.5,
        ease: "power2.inOut",
        onUpdate: () => {
          mroute.current?.set(o.p);
          if (!pinned && o.p >= MOBILE_PIN.at) {
            pinned = true;
            gsap.to(pin.current, { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(2)" });
          }
        },
      });
      gsap.to(media.current, {
        scale: 1.06,
        ease: "none",
        scrollTrigger: { trigger: section.current, start: "top top", end: "bottom top", scrub: true },
      });
      // the headline drifts up and softens as the page scrolls away from the banner
      gsap.to(q("[data-hero-head]"), {
        yPercent: -22,
        opacity: 0.15,
        ease: "none",
        scrollTrigger: { trigger: section.current, start: "top top", end: "60% top", scrub: true },
      });

      // Look around: the photograph is much wider than a phone, so a finger drags it sideways (object-position),
      // with a little momentum. A gentle first sweep shows it can move; the hint and track show where you are.
      const el = section.current;
      const img = q("[data-hero-img]")[0] as HTMLImageElement | undefined;
      const hint = q("[data-hero-hint]")[0] as HTMLElement | undefined;
      const thumb = q("[data-hero-thumb]")[0] as HTMLElement | undefined;
      if (!el || !img) return;
      const MIN = 15;
      const MAX = 85;
      const clamp = (n: number) => Math.min(MAX, Math.max(MIN, n));
      const X = { v: 70 };
      const apply = () => {
        img.style.objectPosition = `${X.v}% center`;
        thumb?.style.setProperty("--p", String((X.v - MIN) / (MAX - MIN)));
      };
      // how far the image can travel, in px: its rendered width minus the viewport's
      const travel = () => el.clientHeight * (img.naturalWidth && img.naturalHeight ? img.naturalWidth / img.naturalHeight : 16 / 9) - el.clientWidth;
      apply();

      const intro = gsap.timeline({ delay: 2.6, onUpdate: apply });
      intro.to(X, { v: 40, duration: 1.7, ease: "power2.inOut" }).to(X, { v: 64, duration: 1.5, ease: "power2.inOut" });
      if (hint) gsap.fromTo(hint, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.7, delay: 1.6 });

      let startX = 0;
      let startY = 0;
      let startV = 0;
      let lastX = 0;
      let lastT = 0;
      let vel = 0;
      let down = false;
      let dragging = false;
      const stopIntro = () => {
        intro.kill();
        gsap.killTweensOf(X);
        if (hint) gsap.to(hint, { opacity: 0, duration: 0.4, overwrite: true });
      };
      const onDown = (e: PointerEvent) => {
        if ((e.target as Element).closest("a, button, input, textarea, select")) return;
        down = true;
        dragging = false;
        startX = lastX = e.clientX;
        startY = e.clientY;
        startV = X.v;
        vel = 0;
        lastT = e.timeStamp;
      };
      const onMove = (e: PointerEvent) => {
        if (!down) return;
        const dx = e.clientX - startX;
        if (!dragging) {
          if (Math.abs(dx) < 6 || Math.abs(dx) < Math.abs(e.clientY - startY)) return;
          dragging = true;
          stopIntro();
          el.setPointerCapture(e.pointerId);
        }
        const t = travel();
        if (t <= 0) return;
        const dt = e.timeStamp - lastT;
        if (dt > 0) vel = (e.clientX - lastX) / dt;
        lastX = e.clientX;
        lastT = e.timeStamp;
        X.v = clamp(startV - (dx / t) * 100);
        apply();
      };
      const onUp = (e: PointerEvent) => {
        if (!down) return;
        down = false;
        if (!dragging) return;
        dragging = false;
        if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
        const t = travel();
        if (t > 0 && Math.abs(vel) > 0.05) gsap.to(X, { v: clamp(X.v - ((vel * 380) / t) * 100), duration: 1.1, ease: "power3.out", onUpdate: apply });
      };
      const prevTouch = el.style.touchAction;
      el.style.touchAction = "pan-y"; // vertical scroll stays with the browser; horizontal drags come to us
      el.addEventListener("pointerdown", onDown);
      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerup", onUp);
      el.addEventListener("pointercancel", onUp);
      return () => {
        el.removeEventListener("pointerdown", onDown);
        el.removeEventListener("pointermove", onMove);
        el.removeEventListener("pointerup", onUp);
        el.removeEventListener("pointercancel", onUp);
        el.style.touchAction = prevTouch;
        img.style.objectPosition = "70% center";
      };
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      route.current?.set(1);
      mroute.current?.set(1);
      gsap.set(pin.current, { opacity: 1, scale: 1 });
    });
  });

  return (
    <>
      <section
        id="top"
        ref={section}
        data-stage="discover"
        aria-labelledby="hero-title"
        className="relative h-svh min-h-[640px] overflow-hidden bg-porcelain lg:min-h-[680px]"
      >
        {/* Media */}
        <div ref={media} className="absolute inset-0 origin-[70%_40%] will-change-transform" data-paused={paused}>
          <div className="hero-drift relative isolate h-full w-full overflow-hidden bg-paper-2">
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
              <Image src={data.video.poster} alt={data.video.alt} fill preload fetchPriority="high" sizes="100vw" className="object-cover" style={{ objectPosition: "70% center" }} data-hero-img />
            ) : null}
          </div>
        </div>

        {/* Porcelain wash — strongest behind the headline on the left, easing off to the right; clear under the nav and at the foot */}
        <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-porcelain via-porcelain/80 to-transparent max-sm:hidden sm:via-porcelain/70 lg:via-porcelain/55 lg:to-porcelain/0" />
        {/* phones: pale behind the headline, the render clear through the middle, pale behind the location bar */}
        <div aria-hidden className="absolute inset-0 bg-[linear-gradient(to_bottom,rgb(249_250_253/0.9)_0%,rgb(249_250_253/0.72)_30%,rgb(249_250_253/0.18)_42%,transparent_50%)] sm:hidden" />
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-[46%] bg-gradient-to-t from-porcelain via-porcelain/85 to-transparent max-sm:h-[58%] max-sm:via-porcelain/95" />
        <div aria-hidden className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-porcelain/80 to-transparent" />
        <div ref={cover} aria-hidden className="absolute inset-0 z-[15] bg-porcelain opacity-0" />

        <Route ref={route} d={HERO_ROUTE} initial={0} base={false} tone="light" trail="blue" className="z-[16] max-lg:hidden" strokeWidth={1.5} />

        {/* Site reticle — the location becomes a place you are looking at */}
        <div data-hero-reticle aria-hidden className="absolute left-[60%] top-[44%] z-10 hidden -translate-x-1/2 -translate-y-1/2 lg:block">
          <div className="relative">
            <svg width="72" height="72" viewBox="0 0 72 72" fill="none" className="text-yellow-400">
              <circle cx="36" cy="36" r="22" stroke="currentColor" strokeOpacity="0.8" />
              <circle cx="36" cy="36" r="34" stroke="currentColor" strokeOpacity="0.25" strokeDasharray="2 5" />
              <path d="M36 4v16M36 52v16M4 36h16M52 36h16" stroke="currentColor" />
              <circle cx="36" cy="36" r="2.5" fill="currentColor" />
            </svg>
            <span aria-hidden className="hero-ping absolute left-1/2 top-1/2 block h-[44px] w-[44px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-yellow-400" />
            <span className="absolute left-[60px] top-[12px] block h-px w-14 origin-left -rotate-[28deg] bg-indigo-700/70" />
            <span className="absolute left-[106px] top-[-30px] whitespace-nowrap border-l-2 border-yellow-400 bg-paper/95 px-3 py-2 shadow-lg">
              <span className="t-micro block text-blue-500">{data.siteLabel}</span>
              <span className="t-label mt-0.5 block text-ink">{data.siteTag}</span>
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="shell relative z-20 flex h-full flex-col pb-5 pt-[calc(64px+5vh)] lg:pb-7 lg:pt-[calc(88px+3.5vh)]">
          <h1 id="hero-title" data-hero-head className="t-hero max-w-[14ch] text-ink">
            {data.headline.map((line, i) => (
              <span key={line} data-hero-line className={`block overflow-hidden pb-[0.08em] -mb-[0.08em] ${i === data.headline.length - 1 ? "text-indigo-700" : ""}`}>
                <span className="hero-rise block" style={{ animationDelay: `${120 + i * 110}ms` }}>
                  {line.replace(/\*/g, "")}
                </span>
              </span>
            ))}
          </h1>

          {/* phones / tablets: the clear window of the render between the headline and the location bar */}
          <div aria-hidden className="relative -mx-[var(--margin)] min-h-[72px] flex-1 lg:hidden">
            <Route ref={mroute} d={MOBILE_ROUTE} initial={0} base={false} tone="light" trail="blue" strokeWidth={1.5} />
            <span ref={pin} className="absolute z-10 h-3 w-3 -translate-x-1/2 -translate-y-1/2 opacity-0" style={{ left: `${MOBILE_PIN.x}%`, top: `${MOBILE_PIN.y}%` }}>
              <span className="absolute inset-0 rounded-full bg-yellow-400 animate-pulse-soft" />
              <span className="relative block h-3 w-3 rounded-full border-2 border-paper bg-yellow-400 shadow" />
            </span>
            {/* drag hint + position track; revealed by the look-around scene, so it never shows without motion or on desktop */}
            <div data-hero-hint className="pointer-events-none absolute inset-x-0 bottom-2 flex justify-center opacity-0">
              <span className="t-micro flex items-center gap-3 rounded-full bg-paper/90 px-4 py-2 text-ink shadow-[var(--shadow-card)]">
                <Icon name="arrow-right" size={14} className="hero-nudge rotate-180 text-indigo-700" style={{ "--dir": -1 } as CSSProperties} />
                <span className="flex items-center gap-3">
                  Drag to look around
                  <span className="relative block h-[3px] w-12 bg-ink/15">
                    <span data-hero-thumb className="absolute top-0 block h-full w-4 bg-yellow-400" style={{ left: "calc((100% - 1rem) * var(--p, 0.65))" }} />
                  </span>
                </span>
                <Icon name="arrow-right" size={14} className="hero-nudge text-indigo-700" />
              </span>
            </div>
          </div>

          <div data-hero-hud className="mt-auto">
            <div className="hero-fade grid-12 gap-y-6 border-t border-ink/15 pt-5 lg:pt-6" style={{ animationDelay: "650ms" }}>
              {/* Location anchor */}
              <div className="col-span-4 flex gap-4 sm:col-span-4 lg:col-span-4">
                <Icon name="crosshair" size={30} className="mt-1 shrink-0 text-blue-500" />
                <div>
                  <p className="t-micro text-steel-500">Location</p>
                  <p className="mt-1 text-[clamp(1.25rem,1.8vw,1.75rem)] font-extrabold leading-[1.05] tracking-[-0.02em] text-ink">{data.location.primary}</p>
                  <p className="text-[clamp(1.25rem,1.8vw,1.75rem)] font-normal leading-[1.1] tracking-[-0.02em] text-steel-700">{data.location.secondary}</p>
                  <p className="t-micro mt-3 text-steel-500">
                    {data.location.roads.join("  ·  ")}
                    {settings.coordinates ? (
                      <span className="ml-3 text-steel-700">
                        {settings.coordinates.lat.toFixed(4)}°N / {settings.coordinates.lng.toFixed(4)}°E
                      </span>
                    ) : null}
                  </p>
                </div>
              </div>

              <p className="t-body-l col-span-4 max-w-[34ch] text-steel-700 sm:col-span-4 lg:col-span-3 lg:pt-1">{data.copy}</p>

              <div className="col-span-4 flex flex-col gap-3 sm:col-span-8 sm:flex-row sm:items-center lg:col-span-5 lg:flex-col lg:items-end lg:justify-start xl:flex-row xl:items-start xl:justify-end xl:gap-7">
                <ButtonLink href="#explore" className="w-full sm:w-auto">
                  Explore the project
                </ButtonLink>
                <ArrowLink href="#enquire" className="justify-center whitespace-nowrap sm:justify-start xl:h-14">
                  Enquire leasing now
                </ArrowLink>
              </div>
            </div>

            <div className="hero-fade mt-4 flex items-center justify-between lg:mt-5" style={{ animationDelay: "900ms" }}>
              <p className="t-micro flex items-center gap-3 text-steel-500">
                <span aria-hidden className="relative block h-4 w-px overflow-hidden bg-ink/15">
                  <span className="absolute left-0 top-0 block h-1.5 w-px bg-yellow-400" style={{ animation: "scroll-cue 2.4s var(--ease-route) infinite" }} />
                </span>
                Scroll to enter
              </p>
              {/* film control only when there is a film; until then the render is labelled so it is never mistaken for site footage */}
              {data.video.src ? (
                <button
                  type="button"
                  onClick={() => setPaused((p) => !p)}
                  aria-pressed={paused}
                  className="t-micro flex h-10 items-center gap-2 px-2 text-steel-500 transition-colors hover:text-ink"
                >
                  <Icon name={paused ? "play" : "pause"} size={14} />
                  {paused ? "Play film" : "Pause film"}
                </button>
              ) : (
                <p className="t-micro px-2 text-steel-500">{data.sitePhoto ? `${data.siteLabel} · site photograph` : "Illustrative render"}</p>
              )}
            </div>
          </div>
        </div>
      </section>
      <div data-hero-end aria-hidden />
    </>
  );
}
