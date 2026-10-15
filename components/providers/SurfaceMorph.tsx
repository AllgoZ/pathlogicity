"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { gsap, MQ } from "@/lib/motion/gsap";

const isTransparent = (c: string) => c === "transparent" || /rgba\(\s*0,\s*0,\s*0,\s*0\s*\)/.test(c);

/**
 * M3 — Scroll colour morph. Wherever a light section meets a midnight one
 * (`data-surface="dark"`), the incoming section's background tweens from the
 * previous section's colour to its own as it scrolls in, so the page breathes
 * between porcelain and midnight instead of cutting hard. Motion-only.
 */
export function SurfaceMorph() {
  const pathname = usePathname();

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(MQ.motion, (ctx) => {
      // run after section-level scenes (pins) have created their spacers; ctx.add keeps
      // the late-created tweens inside this matchMedia context so they revert with it
      const id = requestAnimationFrame(() => ctx.add(() => {
        const main = document.getElementById("main");
        const raw = [...Array.from(main?.children ?? []), document.getElementById("enquire"), document.querySelector("footer")];
        const blocks = raw
          .filter((el): el is HTMLElement => el instanceof HTMLElement)
          .map((el) => (el.classList.contains("pin-spacer") ? (el.firstElementChild as HTMLElement) : el))
          .filter((el) => el && el.offsetHeight > 0 && !isTransparent(getComputedStyle(el).backgroundColor));

        blocks.forEach((el, i) => {
          const prev = blocks[i - 1];
          if (!prev) return;
          const dark = el.dataset.surface === "dark";
          if (dark === (prev.dataset.surface === "dark")) return;
          const from = getComputedStyle(prev).backgroundColor;
          const to = getComputedStyle(el).backgroundColor;
          gsap.fromTo(
            el,
            { backgroundColor: from },
            // immediateRender:false → the section keeps its own colour until it actually starts entering
            // (no dark-on-dark state while it sits off-screen); the blend completes before its text is read
            { backgroundColor: to, ease: "none", immediateRender: false, scrollTrigger: { trigger: el, start: "top bottom", end: "top 72%", scrub: true } },
          );
        });
      }));
      return () => cancelAnimationFrame(id);
    });
    return () => mm.revert();
  }, [pathname]);

  return null;
}
