"use client";

import Image from "next/image";
import { Fragment, useEffect, useRef, useState, type CSSProperties } from "react";
import type { Homepage } from "@/lib/content";
import type { SiteSettings } from "@/lib/content/types";
import { gsap, MQ } from "@/lib/motion/gsap";
import { useMotion } from "@/lib/motion/hooks";
import { ArrowLink, ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

const WORD_STEP = 110; // ms between headline words
const INTRO = 1300; // ms before the first word rises (the photograph has developed by then)
const BLEED = 24; // px the photograph extends past the hero on every side, so the pointer drift never shows an edge

type HeadWord = { w: string; accent: boolean };

/** One headline row: each word rises through its own mask, one after another. Accent words (`*word*` in the content) are gold. */
function HeroRow({ words, from }: { words: HeadWord[]; from: number }) {
  return (
    <span aria-hidden className="block overflow-hidden pb-[0.1em] pt-[0.06em] -mb-[0.1em] -mt-[0.06em] [text-wrap:balance]">
      {words.map((x, i) => (
        <Fragment key={i}>
          <span className="inline-block overflow-hidden pb-[0.12em] align-bottom">
            <span className={`hero-word ${x.accent ? "text-yellow-400" : ""}`} style={{ animationDelay: `${INTRO + (from + i) * WORD_STEP}ms` }}>
              {x.w}
            </span>
          </span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </span>
  );
}

/**
 * §01 — Hero (round 9 redo, docs/PLAN-HERO-REDESIGN-R9.md). One continuous picture: the client's photograph runs
 * full-bleed and everything else sits ON it, on a soft deep-ink gradient at the foot. No card, no ring, no pin.
 *
 * Motion, in the order a visitor sees it (all CSS keyframes, so nothing flashes before hydration):
 *  1. a pencil drawing of the scene is on screen; the photograph DEVELOPS across it, left to right, behind a gold edge;
 *  2. the foot gradient fades in, the location kicker appears and the headline words rise through masks;
 *  3. a gold route line draws across the base of the headline, a node leading it, and pings on arrival;
 *  4. the copy and the two actions rise in turn;
 *  5. the photograph then breathes slowly (`hero-drift`). On desktop a mouse shifts photograph and headline a few px at
 *     different depths; on scroll the photograph parallaxes and the text lifts away (the page is never held);
 *  6. phones: the photograph is wider than the screen, so a finger drags it sideways to look around.
 * Reduced motion: the finished image, headline and route line; no drift, no scroll effects.
 */
export function Hero({ data, settings }: { data: Homepage["hero"]; settings: SiteSettings }) {
  const section = useRef<HTMLElement>(null);
  const media = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
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

    // ---- scroll exit, desktop and phones: the photograph parallaxes down and swells a little; the text lifts away ----
    mm.add(MQ.motion, () => {
      gsap.to(media.current, {
        yPercent: 10,
        scale: 1.05,
        ease: "none",
        scrollTrigger: { trigger: section.current, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to(content.current, {
        y: -64,
        opacity: 0,
        ease: "none",
        scrollTrigger: { trigger: section.current, start: "top top", end: "60% top", scrub: true },
      });
    });

    // ---- desktop mouse: photograph and headline shift a few px at different depths ----
    mm.add(MQ.desktop, () => {
      const el = section.current;
      if (!el || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
      const moves = (q("[data-depth]") as HTMLElement[]).map((d) => ({
        d: Number(d.dataset.depth),
        x: gsap.quickTo(d, "x", { duration: 1.2, ease: "power3.out" }),
        y: gsap.quickTo(d, "y", { duration: 1.2, ease: "power3.out" }),
      }));
      let visible = true;
      const io = new IntersectionObserver(([e]) => {
        visible = e.isIntersecting;
        if (!visible) moves.forEach((m) => (m.x(0), m.y(0)));
      });
      io.observe(el);
      const onMove = (e: PointerEvent) => {
        if (!visible || (e.pointerType !== "mouse" && e.pointerType !== "pen")) return;
        const nx = (e.clientX / window.innerWidth - 0.5) * 2;
        const ny = (e.clientY / window.innerHeight - 0.5) * 2;
        moves.forEach((m) => (m.x(-nx * m.d), m.y(-ny * m.d)));
      };
      window.addEventListener("pointermove", onMove, { passive: true });
      return () => {
        window.removeEventListener("pointermove", onMove);
        io.disconnect();
      };
    });

    // ---- phones / tablets: look around. The photograph is much wider than a phone, so a finger drags it sideways
    // (object-position) with a little momentum. A gentle first sweep shows it can move; the hint shows where you are. ----
    mm.add(MQ.mobile, () => {
      const el = section.current;
      const imgs = q("[data-hero-img]") as HTMLImageElement[]; // the photograph and the drawing under it pan together
      const img = imgs[0];
      const hint = q("[data-hero-hint]")[0] as HTMLElement | undefined;
      const thumb = q("[data-hero-thumb]")[0] as HTMLElement | undefined;
      if (!el || !img) return;
      const MIN = 10;
      const MAX = 90;
      const clamp = (n: number) => Math.min(MAX, Math.max(MIN, n));
      const X = { v: 42 };
      const apply = () => {
        imgs.forEach((i) => (i.style.objectPosition = `${X.v}% 50%`));
        thumb?.style.setProperty("--p", String((X.v - MIN) / (MAX - MIN)));
      };
      // how far the photograph can travel, in px: its rendered width (cover, height-limited) minus the box's width
      const travel = () => img.clientHeight * (img.naturalWidth && img.naturalHeight ? img.naturalWidth / img.naturalHeight : 4 / 3) - img.clientWidth;
      apply();

      const intro = gsap.timeline({ delay: 3.2, onUpdate: apply });
      intro.to(X, { v: 62, duration: 2, ease: "power2.inOut" }).to(X, { v: 46, duration: 1.7, ease: "power2.inOut" });
      if (hint) gsap.fromTo(hint, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.7, delay: 2.4 });

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
        imgs.forEach((i) => (i.style.objectPosition = ""));
      };
    });
  });

  // the content's short headline lines are set as two rows (nothing is reworded); `*word*` marks an accent word
  const lines = data.headline.map((l) => ({ text: l.replace(/\*/g, ""), accent: l.includes("*") }));
  const mid = Math.ceil(lines.length / 2);
  const rows: HeadWord[][] = [lines.slice(0, mid), lines.slice(mid)].map((r) => r.flatMap((l) => l.text.split(" ").map((w) => ({ w, accent: l.accent }))));
  const headline = lines.map((l) => l.text);

  return (
    <>
      <section
        id="top"
        ref={section}
        data-stage="discover"
        aria-labelledby="hero-title"
        className="relative h-svh min-h-[640px] overflow-clip bg-paper lg:min-h-[680px]"
      >
        {/* Media: the pencil drawing underneath, the photograph on top (it develops across the drawing). The box reaches 14% above
            the hero so the scroll parallax never uncovers an edge. */}
        <div ref={media} className="absolute inset-x-0 bottom-0 -top-[14%] will-change-transform" data-paused={paused}>
          <div data-depth="14" className="absolute" style={{ inset: -BLEED }}>
            {data.video.src ? (
              <div className="hero-drift relative isolate h-full w-full overflow-hidden bg-paper-2">
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
              </div>
            ) : (
              <div className="hero-drift absolute inset-0 overflow-hidden bg-paper">
                <Image src={data.sketch} alt="" aria-hidden fill loading="eager" fetchPriority="low" sizes="100vw" className="object-cover" style={{ objectPosition: "50% 50%" }} data-hero-img />
                <div className="hero-develop absolute inset-0">
                  <Image src={data.video.poster ?? ""} alt={data.video.alt} fill preload fetchPriority="high" sizes="100vw" className="object-cover" style={{ objectPosition: "50% 50%" }} data-hero-img />
                </div>
                {/* the gold edge that leads the photograph across the drawing */}
                <span aria-hidden className="hero-scan pointer-events-none absolute inset-0 z-[2] block">
                  <span className="absolute inset-y-0 right-0 block w-[2px] bg-yellow-400 shadow-[0_0_24px_6px_rgb(255_214_10/0.45)]" />
                </span>
              </div>
            )}
          </div>
        </div>

        {/* one soft deep-ink gradient at the foot: the text sits on the photograph, not on a card. A light veil behind the nav. */}
        <div aria-hidden className="hero-scrim pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-[74%] lg:h-[68%]" />
        {/* (sticky, so it stays behind the nav while the hero scrolls away; `overflow-clip` on the section keeps sticky working) */}
        <div aria-hidden className="pointer-events-none sticky top-0 z-[5] h-0">
          <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-paper/65 to-transparent" />
        </div>

        {/* phones: where the drag hint lives (in the clear upper part of the photograph) */}
        <div data-hero-hint aria-hidden className="pointer-events-none absolute inset-x-0 top-[24%] z-[6] flex justify-center opacity-0 lg:hidden">
          <span className="t-micro flex items-center gap-3 rounded-full bg-ink/55 px-4 py-2 text-paper backdrop-blur-sm">
            <Icon name="arrow-right" size={14} className="hero-nudge rotate-180 text-yellow-400" style={{ "--dir": -1 } as CSSProperties} />
            <span className="flex items-center gap-3">
              Drag to look around
              <span className="relative block h-[3px] w-12 bg-paper/25">
                <span data-hero-thumb className="absolute top-0 block h-full w-4 bg-yellow-400" style={{ left: "calc((100% - 1rem) * var(--p, 0.25))" }} />
              </span>
            </span>
            <Icon name="arrow-right" size={14} className="hero-nudge text-yellow-400" />
          </span>
        </div>

        {/* Content: bottom-left, on the photograph */}
        <div ref={content} className="on-dark shell relative z-20 flex h-full flex-col justify-end pb-5 pt-[calc(88px+3vh)] lg:pb-8">
          <div data-hero-head data-depth="-6">
            <p className="hero-fade t-label flex flex-wrap items-center gap-x-3 gap-y-1 text-paper/90 [text-shadow:0_1px_14px_rgb(17_18_51/0.5)]" style={{ animationDelay: "1250ms" }}>
              <span aria-hidden className="block h-px w-8 bg-yellow-400" />
              <span>
                {data.location.primary}, {data.location.secondary}
              </span>
              <span aria-hidden className="text-paper/40">
                ·
              </span>
              <span className="text-paper/70">{data.location.roads.join("  ·  ")}</span>
              {settings.coordinates ? (
                <span className="text-paper/70">
                  {settings.coordinates.lat.toFixed(4)}°N / {settings.coordinates.lng.toFixed(4)}°E
                </span>
              ) : null}
            </p>
            <h1 id="hero-title" aria-label={headline.join(" ")} className="hero-title mt-4 text-paper [text-shadow:0_2px_30px_rgb(17_18_51/0.35)] lg:mt-5">
              {rows.map((row, ri) => (
                <HeroRow key={ri} words={row} from={rows.slice(0, ri).reduce((n, r) => n + r.length, 0)} />
              ))}
            </h1>
          </div>

          {/* the route: a gold line draws across the base of the headline, a node leading it */}
          <div aria-hidden className="relative mt-6 h-[2px] w-full lg:mt-8">
            <span className="hero-route-line absolute inset-0 block" />
            <span className="hero-route-node absolute top-1/2 block h-[9px] w-[9px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-yellow-400 shadow-[0_0_14px_3px_rgb(255_214_10/0.55)]" />
          </div>

          <div className="mt-5 flex flex-col gap-5 lg:mt-6 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
            <p className="hero-fade t-body-l max-w-[44ch] text-paper/90" style={{ animationDelay: "2300ms" }}>
              {data.copy}
            </p>
            <div className="hero-fade flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-7" style={{ animationDelay: "2450ms" }}>
              <ButtonLink href="#explore" className="w-full sm:w-auto">
                Explore the project
              </ButtonLink>
              <ArrowLink href="#enquire" tone="light" className="justify-center whitespace-nowrap sm:justify-start">
                Enquire leasing now
              </ArrowLink>
            </div>
          </div>

          <div className="hero-fade mt-4 flex items-center justify-between lg:mt-5" style={{ animationDelay: "2650ms" }}>
            <p className="t-micro flex items-center gap-3 text-paper/70">
              <span aria-hidden className="relative block h-4 w-px overflow-hidden bg-paper/25">
                <span className="absolute left-0 top-0 block h-1.5 w-px bg-yellow-400" style={{ animation: "scroll-cue 2.4s var(--ease-route) infinite" }} />
              </span>
              Scroll to enter
            </p>
            {/* film control only when there is a film; until then the image is labelled so it is never mistaken for site footage */}
            {data.video.src ? (
              <button
                type="button"
                onClick={() => setPaused((p) => !p)}
                aria-pressed={paused}
                className="t-micro flex h-10 items-center gap-2 px-2 text-paper/70 transition-colors hover:text-paper"
              >
                <Icon name={paused ? "play" : "pause"} size={14} />
                {paused ? "Play film" : "Pause film"}
              </button>
            ) : (
              <p className="t-micro text-paper/70">Illustrative image</p>
            )}
          </div>
        </div>
      </section>
      <div data-hero-end aria-hidden />
    </>
  );
}
