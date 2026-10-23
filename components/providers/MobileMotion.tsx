"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Phones / tablets: blocks that would simply appear as you scroll rise and fade in instead, staggered
 * within the group that arrives together. Everything is driven from here with the Web Animations API,
 * so no component is edited and nothing is left behind in the DOM (inline styles are removed once an
 * item has played). Desktop (≥ lg), reduced motion and elements already on screen are left alone.
 */
const TARGETS = [
  "#status [data-milestone]",
  "#sustainability ul > li",
  "#at-a-glance ul > li",
  "#path-group [data-mobile-rise] > li", // only the sectors list: the verticals and track record already reveal themselves
  "#status ul.flex-wrap > li", // the status legend
  "footer nav > div",
];

/**
 * Phone-only extras for §04 Project status, §05 PATH Group and PATH Legacy (they read as flat on a phone).
 * Two kinds, both driven from here so no component changes:
 *  - ENTRANCES: one-shot Web Animations on inner pieces (numerals wipe in, dots pop, cards slide in, image
 *    frames open) when they arrive. They use `clip-path` and the individual `translate` / `scale` / `rotate`
 *    properties, so they never fight the GSAP `transform` reveals the components already run.
 *  - SCRUBS: values tied to scroll position (image parallax, the milestone numeral swelling as it passes the
 *    middle of the screen, the About quote turning from grey to ink as you read down it). Their inline
 *    styles are removed on cleanup.
 */
const EXPO = "cubic-bezier(0.16, 1, 0.3, 1)";
const POP = "cubic-bezier(0.34, 1.56, 0.64, 1)";
const L = "left center";

type Entrance = { sel: string; frames: (el: HTMLElement) => Keyframe[]; duration?: number; stagger?: number; easing?: string };
const ENTRANCES: Entrance[] = [
  // §04 — milestone dot pops, the big numeral wipes in
  { sel: "#status [data-milestone] > span", frames: () => [{ scale: 0 }, { scale: 1 }], duration: 650, easing: POP },
  { sel: "#status [data-milestone] p[aria-hidden]", frames: () => [{ clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)" }], duration: 900 },
  // §04.1 and §05 — the yellow-edged cards wipe in (mission from the left, vision from the right). Clip-path only:
  // these cards are targets of the component's own GSAP reveal, which reads computed translate/scale and would
  // freeze a half-played slide into the card's final position.
  {
    sel: `#path-group [class*="border-l-[3px]"], #availability [class*="border-l-[3px]"]`,
    frames: (el) => [{ clipPath: el.previousElementSibling ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)" }, { clipPath: "inset(0 0 0 0)" }],
    duration: 950,
  },
  // §05 — sector diamonds spin in; track-record figures rise and settle
  { sel: "#path-group [data-mobile-rise] li > span", frames: () => [{ rotate: "-135deg", scale: 0 }, { rotate: "45deg", scale: 1 }], duration: 700, easing: POP, stagger: 70 },
  { sel: "#path-group ul.grid-cols-2 > li > div", frames: () => [{ scale: 0.8, translate: "0 16px", transformOrigin: L }, { scale: 1, translate: "0 0", transformOrigin: L }], duration: 800, stagger: 80 },
  // PATH Legacy — each vertical's photo frame opens upward, its number tab and title slide in, its gold rule draws
  { sel: `#verticals li [class*="aspect-[4/3]"]`, frames: () => [{ clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)" }], duration: 1000 },
  { sel: `#verticals li span[class*="bg-ink"]`, frames: () => [{ translate: "-28px 0", opacity: 0 }, { translate: "0 0", opacity: 1 }], duration: 700 },
  { sel: "#verticals li h3", frames: () => [{ translate: "22px 0", opacity: 0 }, { translate: "0 0", opacity: 1 }], duration: 800 },
  { sel: `#verticals li span[class*="h-[3px]"]`, frames: () => [{ scale: "0 1", transformOrigin: L }, { scale: "1 1", transformOrigin: L }], duration: 900 },
];

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
type Scrub = { sel: string; apply: (el: HTMLElement, p: number, r: DOMRect, vh: number) => void };
const SCRUBS: Scrub[] = [
  // §04 — the site photo drifts inside its frame as you scroll past
  { sel: "#status img", apply: (el, p) => ((el.style.scale = "1.14"), (el.style.translate = `0 ${((0.5 - p) * 12).toFixed(2)}%`)) },
  // §04 — the milestone number swells and leans in as it passes the middle of the screen
  {
    sel: "#status [data-milestone] p[aria-hidden]",
    apply: (el, _p, r, vh) => {
      const f = 1 - clamp01(Math.abs(r.top + r.height / 2 - vh * 0.5) / (vh * 0.45));
      el.style.transformOrigin = L;
      el.style.scale = (1 + 0.2 * f).toFixed(3);
      el.style.translate = `${(f * 8).toFixed(1)}px 0`;
    },
  },
  // §05 — the About quote fills from grey to ink as it is read down the screen
  {
    sel: "#path-group #about blockquote",
    apply: (el, _p, r, vh) => {
      const q = clamp01((vh * 0.85 - r.top) / (r.height + vh * 0.35)) * 100;
      el.style.backgroundImage = `linear-gradient(to bottom, var(--color-ink) ${(q - 6).toFixed(1)}%, rgb(100 102 120 / 0.38) ${(q + 4).toFixed(1)}%)`;
      el.style.backgroundClip = "text";
      el.style.setProperty("-webkit-background-clip", "text");
      el.style.color = "transparent";
    },
  },
  // PATH Legacy — each vertical's photo drifts inside its frame
  { sel: "#verticals li img", apply: (el, p) => ((el.style.scale = "1.18"), (el.style.translate = `0 ${((0.5 - p) * 14).toFixed(2)}%`)) },
];
const SCRUB_PROPS = ["scale", "translate", "transform-origin", "background-image", "background-clip", "-webkit-background-clip", "color"];

export function MobileMotion() {
  const pathname = usePathname();

  useEffect(() => {
    if (!window.matchMedia("(max-width: 1023.98px) and (prefers-reduced-motion: no-preference)").matches) return;

    // ENTRANCES — played once, the first time each piece scrolls in (pieces already on screen are left alone)
    const pending = new Map<Element, Entrance>();
    const entered = new Set<Element>();
    const enterIO = new IntersectionObserver(
      (entries) => {
        const n = new Map<Entrance, number>();
        entries.forEach((e) => {
          const fx = pending.get(e.target);
          if (!e.isIntersecting || !fx) return;
          enterIO.unobserve(e.target);
          pending.delete(e.target);
          const i = n.get(fx) ?? 0;
          n.set(fx, i + 1);
          e.target.animate(fx.frames(e.target as HTMLElement), { duration: fx.duration ?? 800, delay: i * (fx.stagger ?? 90), easing: fx.easing ?? EXPO, fill: "backwards" });
        });
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    const armEntrances = () =>
      ENTRANCES.forEach((fx) =>
        document.querySelectorAll<HTMLElement>(fx.sel).forEach((el) => {
          if (entered.has(el)) return;
          entered.add(el);
          if (el.getBoundingClientRect().top < window.innerHeight * 0.9) return;
          pending.set(el, fx);
          enterIO.observe(el);
        }),
      );

    // SCRUBS — one passive scroll listener, one frame per scroll tick, only for pieces near the screen
    const touched = new Set<HTMLElement>();
    let raf = 0;
    const scrub = () => {
      raf = 0;
      const vh = window.innerHeight;
      SCRUBS.forEach(({ sel, apply }) =>
        document.querySelectorAll<HTMLElement>(sel).forEach((el) => {
          const r = el.getBoundingClientRect();
          if (r.bottom < -vh * 0.2 || r.top > vh * 1.05) return;
          apply(el, (vh - r.top) / (vh + r.height), r, vh);
          touched.add(el);
        }),
      );
    };
    const queue = () => {
      if (!raf) raf = requestAnimationFrame(scrub);
    };
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);

    armEntrances();
    queue();
    const lateFx = window.setTimeout(() => {
      armEntrances();
      queue();
    }, 1200);

    const seen = new Set<Element>();
    let batch = 0;
    let batchTimer: ReturnType<typeof setTimeout> | undefined;

    const play = (el: HTMLElement) => {
      const d = batch++ * 90;
      el.animate(
        [
          { opacity: 0, transform: "translate3d(0, 26px, 0)" },
          { opacity: 1, transform: "translate3d(0, 0, 0)" },
        ],
        { duration: 750, delay: d, easing: "cubic-bezier(0.16, 1, 0.3, 1)", fill: "backwards" },
      );
      el.style.removeProperty("opacity");
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          io.unobserve(e.target);
          play(e.target as HTMLElement);
        });
        clearTimeout(batchTimer);
        batchTimer = setTimeout(() => (batch = 0), 120);
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );

    const arm = () => {
      document.querySelectorAll<HTMLElement>(TARGETS.join(",")).forEach((el) => {
        if (seen.has(el)) return;
        seen.add(el);
        if (el.getBoundingClientRect().top < window.innerHeight * 0.92) return; // already in view: leave it
        el.style.opacity = "0"; // hidden until it arrives; the animation fills backwards, then this is removed
        io.observe(el);
      });
    };
    arm();
    const late = window.setTimeout(arm, 1200); // sections that mount late (lazy scenes)
    return () => {
      clearTimeout(lateFx);
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", queue);
      window.removeEventListener("resize", queue);
      enterIO.disconnect();
      touched.forEach((el) => SCRUB_PROPS.forEach((p) => el.style.removeProperty(p)));
      clearTimeout(late);
      clearTimeout(batchTimer);
      io.disconnect();
      seen.forEach((el) => (el as HTMLElement).style.removeProperty("opacity"));
    };
  }, [pathname]);

  return null;
}
