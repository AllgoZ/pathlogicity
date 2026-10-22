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
  "footer nav > div",
];

export function MobileMotion() {
  const pathname = usePathname();

  useEffect(() => {
    if (!window.matchMedia("(max-width: 1023.98px) and (prefers-reduced-motion: no-preference)").matches) return;
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
      clearTimeout(late);
      clearTimeout(batchTimer);
      io.disconnect();
      seen.forEach((el) => (el as HTMLElement).style.removeProperty("opacity"));
    };
  }, [pathname]);

  return null;
}
