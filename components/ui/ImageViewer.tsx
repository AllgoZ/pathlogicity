"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef } from "react";
import { Icon } from "./Icon";

export type ViewerItem = { src: string; alt: string; title: string; caption: string; fit?: "cover" | "contain" };

/**
 * Full-screen image viewer for phones and tablets: swipe sideways to move between images, tap the close
 * button (or press Esc) to leave. Locks page scroll while open and returns focus to where it came from.
 */
export function ImageViewer({ items, index, onIndex, onClose }: { items: ViewerItem[]; index: number; onIndex: (i: number) => void; onClose: () => void }) {
  const closeBtn = useRef<HTMLButtonElement>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const it = items[index];

  const go = useCallback(
    (d: 1 | -1) => {
      const n = index + d;
      if (n >= 0 && n < items.length) onIndex(n);
    },
    [index, items.length, onIndex],
  );

  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    const html = document.documentElement;
    const overflow = html.style.overflow;
    html.style.overflow = "hidden";
    window.__lenis?.stop();
    closeBtn.current?.focus();
    return () => {
      html.style.overflow = overflow;
      window.__lenis?.start();
      prev?.focus?.();
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Image viewer — ${it.title}`}
      className="fixed inset-0 z-[90] flex flex-col bg-ink text-paper [animation:fade-in_.35s_var(--ease-out-expo)_both]"
      onTouchStart={(e) => {
        const t = e.touches[0];
        touch.current = { x: t.clientX, y: t.clientY };
      }}
      onTouchEnd={(e) => {
        const s = touch.current;
        touch.current = null;
        if (!s) return;
        const t = e.changedTouches[0];
        const dx = t.clientX - s.x;
        const dy = t.clientY - s.y;
        if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.3) go(dx < 0 ? 1 : -1);
        else if (dy > 90 && Math.abs(dy) > Math.abs(dx) * 1.5) onClose(); // swipe down to dismiss
      }}
    >
      <div className="flex items-center justify-between px-5 pb-2 pt-[max(16px,env(safe-area-inset-top))]">
        <p className="t-micro tnum text-paper/70">
          {String(index + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
        </p>
        <button ref={closeBtn} type="button" onClick={onClose} aria-label="Close viewer" className="flex h-11 w-11 items-center justify-center border border-paper/30 text-paper transition-colors hover:bg-paper hover:text-ink">
          <Icon name="x" size={18} />
        </button>
      </div>

      <div className="relative min-h-0 flex-1 overflow-hidden">
        <div key={index} className="absolute inset-0 [animation:fade-in_.45s_var(--ease-out-expo)_both]">
          <Image src={it.src} alt={it.alt} fill sizes="100vw" priority className={`${it.fit === "contain" ? "bg-paper p-3" : "img-grade"} object-contain`} draggable={false} />
        </div>
      </div>

      <div className="px-5 pb-[max(20px,env(safe-area-inset-bottom))] pt-4">
        <p className="t-s text-paper">{it.title}</p>
        <p className="mt-1 text-[0.9375rem] text-paper/70">{it.caption}</p>
        <div className="mt-4 flex items-center justify-between">
          <p className="t-micro text-paper/50">Swipe to browse · swipe down to close</p>
          <div className="flex gap-2">
            <button type="button" onClick={() => go(-1)} disabled={index === 0} aria-label="Previous image" className="flex h-11 w-11 items-center justify-center border border-paper/30 text-paper disabled:opacity-30">
              <Icon name="arrow-right" size={18} className="rotate-180" />
            </button>
            <button type="button" onClick={() => go(1)} disabled={index === items.length - 1} aria-label="Next image" className="flex h-11 w-11 items-center justify-center border border-paper/30 text-paper disabled:opacity-30">
              <Icon name="arrow-right" size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
