"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState, type RefObject } from "react";
import { OFFICIAL_PLAN, officialZones } from "./officialZones";

const { width: W, height: H, src: PLAN_SRC } = OFFICIAL_PLAN;

/** Paint order for hit targets: big, low zones first so small ones sit on top and stay hoverable. */
const PAINT_ORDER = ["green", "roads", "yards", "warehousing", "rail", "commercial", "icd"];

export type PlanMarker = {
  id: string;
  /** position in the drawing's own pixel space (2774 × 1583) */
  x: number;
  y: number;
};

/**
 * The client's official master plan with its traced zones — the same drawing and the same zone
 * highlight §03 uses, as a reusable piece. `zone` lights one zone (everything else washes out, the
 * zone re-appears in full colour, its outline draws itself). `markers` are anchored dots in image
 * space; `activeMarker` pulses one. Hit targets are optional (`interactive`).
 */
export function OfficialPlanMap({
  zone,
  tag,
  markers = [],
  activeMarker = null,
  markerRef,
  interactive = false,
  onZoneEnter,
  onZoneLeave,
  onZoneSelect,
  sizes = "(min-width: 1024px) 60vw, 100vw",
  className = "",
}: {
  zone: string | null;
  /** label for the name tag beside the lit zone (omit for none) */
  tag?: string | null;
  markers?: PlanMarker[];
  activeMarker?: string | null;
  markerRef?: (id: string, el: HTMLSpanElement | null) => void;
  interactive?: boolean;
  onZoneEnter?: (id: string) => void;
  onZoneLeave?: () => void;
  onZoneSelect?: (id: string) => void;
  sizes?: string;
  className?: string;
}) {
  const clip = `plan-clip-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const lit = zone && officialZones[zone] ? zone : null;
  const [ax, ay] = lit ? officialZones[lit].anchor : [0, 0];

  return (
    <div className={`relative ${className}`}>
      <Image
        src={PLAN_SRC}
        alt="Official Path Logicity master plan: warehouses, surface parking, commercial areas, open warehouses, CFS shed, utilities, transit warehouse and the railway terminal"
        width={W}
        height={H}
        sizes={sizes}
        className="block h-auto w-full select-none"
        draggable={false}
      />
      <svg aria-hidden viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid meet">
        <defs>
          {lit ? (
            <clipPath id={clip}>
              <path d={officialZones[lit].d} clipRule="evenodd" />
            </clipPath>
          ) : null}
        </defs>
        {/* wash out the plan, then re-reveal the lit zone in full colour */}
        <rect width={W} height={H} fill="#f9fafd" className="transition-opacity duration-700" opacity={lit ? 0.72 : 0} />
        {lit ? <image href={PLAN_SRC} width={W} height={H} clipPath={`url(#${clip})`} /> : null}
        {lit ? (
          <path
            key={lit}
            d={officialZones[lit].d}
            fill="none"
            stroke="var(--color-indigo-700)"
            strokeWidth={5}
            strokeLinejoin="round"
            pathLength={1}
            strokeDasharray="1 1"
            style={{ animation: "draw 0.9s var(--ease-out-expo) both" }}
          />
        ) : null}
        {interactive
          ? PAINT_ORDER.map((id) =>
              officialZones[id] ? (
                <path
                  key={id}
                  d={officialZones[id].d}
                  fillRule="evenodd"
                  fill="transparent"
                  className="cursor-pointer"
                  onPointerEnter={(e) => e.pointerType === "mouse" && onZoneEnter?.(id)}
                  onPointerLeave={(e) => e.pointerType === "mouse" && onZoneLeave?.()}
                  onClick={() => onZoneSelect?.(id)}
                />
              ) : null,
            )
          : null}
      </svg>

      {/* anchored markers (leader-line targets in §06.1) */}
      {markers.map((m) => {
        const on = activeMarker === m.id;
        return (
          <span
            key={m.id}
            ref={(el) => markerRef?.(m.id, el)}
            aria-hidden
            className="pointer-events-none absolute z-10 h-3 w-3 -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${(m.x / W) * 100}%`, top: `${(m.y / H) * 100}%` }}
          >
            {on ? <span className="absolute inset-0 rounded-full bg-yellow-400 animate-pulse-soft" /> : null}
            <span className={`relative block h-3 w-3 rounded-full border-2 border-paper shadow transition-colors duration-300 ${on ? "bg-yellow-400" : "bg-indigo-700"}`} />
          </span>
        );
      })}

      {/* name tag for the lit zone */}
      {lit && tag ? (
        <span
          key={`${lit}-${tag}`}
          aria-hidden
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${(ax / W) * 100}%`, top: `${(ay / H) * 100}%`, animation: "fade-in .5s var(--ease-out-expo) both" }}
        >
          <span className="relative flex h-3 w-3">
            <span className="absolute inset-0 rounded-full bg-yellow-400 animate-pulse-soft" />
            <span className="relative h-3 w-3 rounded-full border-2 border-paper bg-yellow-400 shadow" />
          </span>
          <span className={`map-tag t-micro absolute top-1/2 -translate-y-1/2 whitespace-nowrap bg-ink px-2.5 py-1 text-paper shadow-lg ${ax > W * 0.62 ? "right-4" : "left-4"}`}>{tag}</span>
        </span>
      ) : null}
    </div>
  );
}

/**
 * A one-shot, scroll-triggered sequence: while `ref` is mostly in view it returns each id in `steps` in
 * turn (`start` ms after it comes into view, then every `step` ms), then null. It pauses when the section
 * leaves the screen and resumes when it returns, so it is never spent off-screen. `stop()` ends it for
 * good (call it on the first hover / focus / tap). Does nothing under reduced motion.
 */
export function useZoneTour(ref: RefObject<HTMLElement | null>, steps: string[], { start = 600, step = 1500 }: { start?: number; step?: number } = {}) {
  const [id, setId] = useState<string | null>(null);
  const stopped = useRef(false);
  const stopRef = useRef<() => void>(() => {});
  const key = steps.join("|");

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let i = 0; // steps shown so far (steps.length = all shown, steps.length + 1 = finished)
    let visible = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const advance = () => {
      if (stopped.current || !visible) return;
      if (i < steps.length) {
        setId(steps[i]);
        i += 1;
        timer = setTimeout(advance, step);
      } else if (i === steps.length) {
        setId(null);
        i += 1;
      }
    };
    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        clearTimeout(timer);
        if (visible && i <= steps.length && !stopped.current) timer = setTimeout(advance, i === 0 ? start : 500);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    stopRef.current = () => {
      stopped.current = true;
      clearTimeout(timer);
      io.disconnect();
    };
    return () => {
      clearTimeout(timer);
      io.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, key, start, step]);

  const stop = () => {
    stopRef.current();
    setId(null);
  };
  return [id, stop] as const;
}
