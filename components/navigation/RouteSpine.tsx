"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * The route line that links the whole homepage: a thin line in the left margin that leaves the
 * hero, passes a node at the top of every section, and ends at the enquiry block. Gold draws
 * down it as you scroll (nodes light as they are reached). It lives in the page margin so it
 * never crosses content. Reduced motion: drawn in full, nothing moves.
 *
 * Imperative on purpose — it reads the page's real section positions and updates on scroll
 * without re-rendering React.
 */
export function RouteSpine() {
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);
  const home = pathname === "/";

  useEffect(() => {
    const root = ref.current;
    if (!home || !root) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const trail = root.querySelector<HTMLElement>("[data-trail]")!;
    const head = root.querySelector<HTMLElement>("[data-head]")!;
    const host = root.querySelector<HTMLElement>("[data-nodes]")!;
    let y0 = 0;
    let h = 0;
    let tops: number[] = [];
    let nodes: HTMLElement[] = [];
    let raf = 0;

    const docTop = (el: Element) => el.getBoundingClientRect().top + window.scrollY;

    const update = () => {
      raf = 0;
      if (!h) return;
      const p = reduce ? 1 : Math.min(1, Math.max(0, (window.scrollY + window.innerHeight * 0.6 - y0) / h));
      trail.style.transform = `scaleY(${p})`;
      head.style.transform = `translate3d(0, ${p * h}px, 0)`;
      head.style.opacity = !reduce && p > 0 && p < 1 ? "1" : "0";
      nodes.forEach((n, i) => {
        n.dataset.on = tops[i] <= p * h + 1 ? "1" : "0";
      });
    };
    const queue = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    const layout = () => {
      const hero = document.getElementById("explore"); // the hero route and §02 incoming route carry the line down to here
      const end = document.getElementById("enquire");
      if (!hero || !end) {
        root.style.display = "none";
        return;
      }
      root.style.display = "";
      y0 = docTop(hero);
      h = Math.max(0, docTop(end) + 28 - y0);
      root.style.top = `${y0}px`;
      root.style.height = `${h}px`;
      const secs = Array.from(document.querySelectorAll<HTMLElement>("#main > section")).filter((s) => s.id && s.id !== "top" && s.id !== "scale");
      tops = [0, ...secs.map((s) => docTop(s) - y0).filter((t) => t > 8 && t < h - 8), h];
      host.replaceChildren(
        ...tops.map((t, i) => {
          const n = document.createElement("span");
          n.className = i === tops.length - 1 ? "route-node route-node-end" : "route-node";
          n.style.top = `${t}px`;
          return n;
        }),
      );
      nodes = Array.from(host.children) as HTMLElement[];
      queue();
    };

    layout();
    const ro = new ResizeObserver(() => layout());
    ro.observe(document.body);
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", layout);
    const late = window.setTimeout(layout, 1200); // after lazy scenes settle
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(late);
      ro.disconnect();
      window.removeEventListener("scroll", queue);
      window.removeEventListener("resize", layout);
    };
  }, [home]);

  if (!home) return null;
  return (
    <div ref={ref} aria-hidden className="pointer-events-none absolute z-20 w-0" style={{ left: "calc(var(--margin) * 0.42)", top: 0, height: 0, display: "none" }}>
      <span className="absolute inset-y-0 -left-[0.5px] w-px bg-ink/10" />
      <span data-trail className="absolute inset-y-0 -left-px w-[2px] origin-top bg-yellow-400" style={{ transform: "scaleY(0)" }} />
      <span data-nodes className="absolute inset-0" />
      <span data-head className="absolute left-0 top-0 opacity-0 transition-opacity duration-300 will-change-transform">
        <span className="absolute -left-[5px] -top-[5px] block h-2.5 w-2.5 rounded-full bg-yellow-400 shadow-[0_0_0_6px_rgb(231_172_0/0.2),0_0_18px_3px_rgb(231_172_0/0.4)]" />
      </span>
    </div>
  );
}
