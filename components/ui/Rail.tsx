"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { Icon } from "./Icon";

/**
 * Native horizontal rail. The page never scrolls sideways *for* the visitor and
 * is never pinned: this is an ordinary scroll-snap strip with drag (mouse),
 * swipe/trackpad, arrow buttons, keyboard (focus the strip, ←/→) and a progress
 * line. Children are `<li>` items; give each one `shrink-0 snap-start` and a width.
 */
export function Rail({
  label,
  children,
  className = "",
  trackClassName = "",
  count,
}: {
  label: string;
  children: ReactNode;
  className?: string;
  trackClassName?: string;
  /** number of items, for the "01 / 06" readout */
  count: number;
}) {
  const scroller = useRef<HTMLUListElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const [at, setAt] = useState({ start: true, end: false, index: 0 });
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null);

  const measure = useCallback(() => {
    const el = scroller.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const p = max > 0 ? el.scrollLeft / max : 0;
    if (bar.current) bar.current.style.transform = `scaleX(${Math.max(0.04, p)})`;
    const items = (Array.from(el.children) as HTMLElement[]).slice(0, count);
    const pad = parseFloat(getComputedStyle(el).paddingLeft) || 0;
    let index = 0;
    items.forEach((it, i) => {
      if (it.offsetLeft - pad - el.scrollLeft < el.clientWidth * 0.35) index = i;
    });
    setAt((s) => {
      const next = { start: el.scrollLeft < 4, end: el.scrollLeft >= max - 4, index };
      return s.start === next.start && s.end === next.end && s.index === next.index ? s : next;
    });
  }, [count]);

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    let raf = 0;
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    };
    measure();
    el.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
    };
  }, [measure]);

  const go = (dir: 1 | -1) => {
    const el = scroller.current;
    if (!el) return;
    const items = (Array.from(el.children) as HTMLElement[]).slice(0, count);
    const pad = parseFloat(getComputedStyle(el).paddingLeft) || 0;
    const target = items[Math.min(items.length - 1, Math.max(0, at.index + dir))];
    el.scrollTo({ left: Math.max(0, target.offsetLeft - pad), behavior: "smooth" });
  };

  // mouse drag-to-scroll (touch and trackpads already scroll natively)
  const onPointerDown = (e: React.PointerEvent<HTMLUListElement>) => {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    drag.current = { x: e.clientX, left: scroller.current!.scrollLeft, moved: false };
  };
  const onPointerMove = (e: React.PointerEvent<HTMLUListElement>) => {
    const d = drag.current;
    const el = scroller.current;
    if (!d || !el) return;
    const dx = e.clientX - d.x;
    if (!d.moved && Math.abs(dx) > 6) {
      d.moved = true;
      el.style.scrollSnapType = "none";
      el.style.cursor = "grabbing";
    }
    if (d.moved) el.scrollLeft = d.left - dx;
  };
  const endDrag = () => {
    const el = scroller.current;
    if (drag.current?.moved && el) {
      el.style.scrollSnapType = "";
      el.style.cursor = "";
    }
    drag.current = null;
  };

  return (
    <div className={className}>
      <ul
        ref={scroller}
        role="region"
        aria-label={label}
        tabIndex={0}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") {
            e.preventDefault();
            go(1);
          } else if (e.key === "ArrowLeft") {
            e.preventDefault();
            go(-1);
          }
        }}
        className={`no-scrollbar flex snap-x snap-mandatory overflow-x-auto scroll-pl-[var(--margin)] px-[var(--margin)] pb-2 [-webkit-overflow-scrolling:touch] focus-visible:outline-offset-[-3px] lg:cursor-grab ${trackClassName}`}
      >
        {children}
      </ul>

      <div className="shell mt-8 flex items-center gap-5">
        <span aria-hidden className="t-micro tnum w-14 shrink-0 text-steel-700">
          {String(at.index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
        </span>
        <span aria-hidden className="relative block h-[3px] flex-1 bg-ink/10">
          <span ref={bar} className="absolute inset-0 origin-left bg-yellow-400 transition-transform duration-300 ease-out" style={{ transform: "scaleX(0.04)" }} />
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => go(-1)}
            disabled={at.start}
            aria-label="Previous"
            className="flex h-11 w-11 items-center justify-center border border-ink/20 text-ink transition-colors hover:border-indigo-700 hover:bg-indigo-700 hover:text-paper disabled:pointer-events-none disabled:opacity-30"
          >
            <Icon name="arrow-right" size={18} className="rotate-180" />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            disabled={at.end}
            aria-label="Next"
            className="flex h-11 w-11 items-center justify-center border border-ink/20 text-ink transition-colors hover:border-indigo-700 hover:bg-indigo-700 hover:text-paper disabled:pointer-events-none disabled:opacity-30"
          >
            <Icon name="arrow-right" size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
