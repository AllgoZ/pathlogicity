"use client";

import { useEffect, useRef, type ComponentPropsWithoutRef, type ElementType, type ReactNode } from "react";

/**
 * Client round 8 ("motion that only shows when the cursor moves over it should show by itself, one at a time, as a flow").
 *
 * Wraps a group of cards / rows. Once the group is on screen, it lights its `[data-flow]` items one after another by
 * setting `data-lit="true"` on the item (then removing it), so the same look a hover gives is shown without a pointer.
 * Style the lit state next to the hover state, e.g. `group-hover:w-20 group-data-[lit=true]:w-20` (the item is the `group`).
 *
 * - `data-flow` items that share the same value (e.g. a ring node and its list row) light together; an empty value is its own step.
 * - Only items currently on screen are lit (so a sideways rail skips the cards that are out of view).
 * - It plays through `passes` times, pauses while the group is off screen, and stops for good the moment a mouse enters the
 *   group or keyboard focus lands in it, so a visitor who takes control is never fought. Touch devices keep the flow.
 * - Nothing runs under reduced motion (every item is already fully readable).
 */
export function Flow<T extends ElementType = "div">({
  as,
  start = 900,
  step = 1500,
  passes = 1,
  children,
  ...rest
}: {
  as?: T;
  /** ms after the group comes into view before the first item lights */
  start?: number;
  /** ms each item stays lit */
  step?: number;
  passes?: number;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children">) {
  const Tag = (as ?? "div") as ElementType;
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let visible = false;
    let done = false;
    let n = 0; // steps taken
    let lit: HTMLElement[] = [];

    const groups = () => {
      const map = new Map<string, HTMLElement[]>();
      root.querySelectorAll<HTMLElement>("[data-flow]").forEach((el, i) => {
        // a bare `data-flow` renders as "true": it is its own step
        const v = el.dataset.flow;
        const key = v && v !== "true" ? v : `#${i}`;
        map.set(key, [...(map.get(key) ?? []), el]);
      });
      return [...map.values()];
    };
    const onScreen = (els: HTMLElement[]) =>
      els.some((el) => {
        const r = el.getBoundingClientRect();
        return r.right > 0 && r.left < window.innerWidth && r.bottom > 0 && r.top < window.innerHeight;
      });
    const clear = () => {
      lit.forEach((el) => el.removeAttribute("data-lit"));
      lit = [];
    };
    const stop = () => {
      done = true;
      clearTimeout(timer);
      clear();
    };
    const tick = () => {
      timer = undefined;
      if (done || !visible) return;
      clear();
      const list = groups();
      if (n >= list.length * passes) return stop();
      // the next group in order that is on screen (a rail may have scrolled it away)
      for (let tries = 0; tries < list.length; tries++) {
        const g = list[n % list.length];
        n++;
        if (onScreen(g)) {
          g.forEach((el) => el.setAttribute("data-lit", "true"));
          lit = g;
          break;
        }
        if (n >= list.length * passes) return stop();
      }
      timer = setTimeout(tick, step);
    };

    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        clearTimeout(timer);
        if (visible && !done) timer = setTimeout(tick, n === 0 ? start : 400);
        else clear();
      },
      { threshold: 0.3 },
    );
    io.observe(root);
    // the visitor takes over: a mouse over the group, or keyboard focus inside it
    const take = (e: Event) => {
      if (e.type === "pointerenter" && (e as PointerEvent).pointerType !== "mouse") return;
      io.disconnect();
      stop();
    };
    root.addEventListener("pointerenter", take);
    root.addEventListener("focusin", take);
    return () => {
      io.disconnect();
      clearTimeout(timer);
      clear();
      root.removeEventListener("pointerenter", take);
      root.removeEventListener("focusin", take);
    };
  }, [start, step, passes]);

  return (
    <Tag ref={ref} {...rest}>
      {children}
    </Tag>
  );
}
