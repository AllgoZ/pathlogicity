"use client";

import { createElement, useRef, type ElementType, type ReactNode } from "react";
import { accent } from "@/lib/accent";
import { gsap, MQ } from "@/lib/motion/gsap";
import { useMotion } from "@/lib/motion/hooks";

/**
 * Headline that rises line-by-line from clip masks when it enters view.
 * Lines are hand-broken (never auto-wrapped) per the typography rules.
 */
export function RevealLines({
  lines,
  as = "h2",
  className = "",
  lineClassNames = [],
  id,
}: {
  lines: ReactNode[];
  as?: ElementType;
  className?: string;
  lineClassNames?: string[];
  id?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  useMotion(ref, (mm) => {
    mm.add(MQ.motion, () => {
      gsap.from(ref.current!.querySelectorAll("[data-line]"), {
        yPercent: 108,
        duration: 1.1,
        stagger: 0.08,
        ease: "expo.out",
        scrollTrigger: { trigger: ref.current, start: "top 85%", once: true },
      });
    });
  });
  return createElement(
    as,
    { ref, className, id },
    lines.map((line, i) => (
      <span key={i} className="block overflow-hidden pb-[0.14em] -mb-[0.14em]">
        <span data-line className={`block ${lineClassNames[i] ?? ""}`}>
          {accent(line)}
        </span>
      </span>
    )),
  );
}

/** Fades/rises every [data-reveal] descendant (or direct children) on entering view. */
export function Reveal({
  children,
  className = "",
  as = "div",
  stagger = 0.09,
  y = 24,
  start = "top 85%",
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  stagger?: number;
  y?: number;
  start?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  useMotion(ref, (mm) => {
    mm.add(MQ.motion, () => {
      const root = ref.current!;
      const marked = root.querySelectorAll("[data-reveal]");
      const targets = marked.length ? marked : root.children;
      gsap.from(targets, {
        y,
        opacity: 0,
        duration: 0.9,
        stagger,
        ease: "expo.out",
        scrollTrigger: { trigger: root, start, once: true },
      });
    });
  });
  return createElement(as, { ref, className }, children);
}
