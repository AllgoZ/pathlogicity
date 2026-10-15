"use client";

import { useEffect, useState } from "react";
import { useHeroThreshold, useScrollY } from "./useHeroThreshold";

const STAGES = ["discover", "explore", "understand", "believe", "enquire"] as const;
type Stage = (typeof STAGES)[number];

/**
 * DISCOVER → EXPLORE → UNDERSTAND → BELIEVE → ENQUIRE, made visible.
 * Sections declare data-stage; the rail highlights the one at viewport centre.
 */
export function JourneyRail() {
  const [active, setActive] = useState<Stage | null>(null);
  const [anchors, setAnchors] = useState<Partial<Record<Stage, string>>>({});
  const threshold = useHeroThreshold();
  const y = useScrollY();

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-stage]"));
    if (!sections.length) return;
    const map: Partial<Record<Stage, string>> = {};
    sections.forEach((s) => {
      const st = s.dataset.stage as Stage;
      if (!map[st] && s.id) map[st] = s.id;
    });
    setAnchors(map);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive((e.target as HTMLElement).dataset.stage as Stage);
        });
      },
      { rootMargin: "-48% 0px -48% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  if (!Object.keys(anchors).length) return null;
  const visible = y > threshold * 0.9 && active;
  const idx = active ? STAGES.indexOf(active) : 0;

  return (
    <nav
      aria-label="Journey"
      className={`fixed right-[18px] top-1/2 z-30 hidden -translate-y-1/2 flex-col items-end transition-opacity duration-500 xl:flex ${visible ? "opacity-100" : "pointer-events-none opacity-0"}`}
    >
      <ol className="relative flex flex-col items-end gap-7">
        <span aria-hidden className="absolute bottom-1 right-[3.5px] top-1 w-px bg-ink/15" />
        <span
          aria-hidden
          className="absolute right-[3.5px] top-1 w-px origin-top bg-yellow-400 transition-[height] duration-700 ease-[var(--ease-out-expo)]"
          style={{ height: `calc(${(idx / (STAGES.length - 1)) * 100}% - 4px)` }}
        />
        {STAGES.map((s) => (
          <li key={s}>
            <a
              href={anchors[s] ? `#${anchors[s]}` : undefined}
              aria-current={active === s ? "step" : undefined}
              className="group relative flex items-center gap-3"
            >
              <span className="t-micro pointer-events-none absolute right-5 whitespace-nowrap bg-indigo-700 px-2 py-1 text-paper opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                {s}
              </span>
              <span
                aria-hidden
                className={`relative block h-2 w-2 rounded-full border transition-colors duration-300 ${
                  active === s ? "border-yellow-400 bg-yellow-400" : STAGES.indexOf(s) < idx ? "border-yellow-400 bg-paper" : "border-ink/30 bg-paper"
                }`}
              />
            </a>
          </li>
        ))}
      </ol>
      {/* active stage, set vertically so it never overlaps page content */}
      <p aria-hidden className="t-micro mt-6 text-right text-blue-500 [writing-mode:vertical-rl]" style={{ marginLeft: "auto" }}>
        {active}
      </p>
    </nav>
  );
}
