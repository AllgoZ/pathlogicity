"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { telHref } from "@/lib/content";
import type { SiteSettings } from "@/lib/content/types";
import { Icon } from "@/components/ui/Icon";
import { useHeroThreshold, useScrollY } from "./useHeroThreshold";

/** Thumb-reach conversion bar on mobile, after the hero, hidden while the form is visible. */
export function MobileActionBar({ settings }: { settings: SiteSettings }) {
  const threshold = useHeroThreshold();
  const y = useScrollY();
  const [formVisible, setFormVisible] = useState(false);

  useEffect(() => {
    const el = document.getElementById("enquire");
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setFormVisible(e.isIntersecting), { rootMargin: "0px 0px -20% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const show = y > threshold && !formVisible;
  const cell = "flex h-14 w-14 shrink-0 items-center justify-center border-l border-ink/10 text-indigo-700";

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-ink/10 bg-paper/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_24px_-12px_rgb(26_28_70/0.2)] backdrop-blur-md transition-transform duration-500 ease-[var(--ease-out-expo)] lg:hidden ${
        show ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="flex">
        <Link
          href="#enquire"
          tabIndex={show ? 0 : -1}
          className="flex h-14 flex-1 items-center justify-between bg-yellow-400 px-5 text-[0.875rem] font-bold uppercase tracking-[0.05em] text-ink"
        >
          Enquire leasing now <Icon name="arrow-right" size={18} />
        </Link>
        {settings.phone ? (
          <a href={telHref(settings.phone)} aria-label="Call us" className={cell} tabIndex={show ? 0 : -1}>
            <Icon name="phone" size={20} />
          </a>
        ) : (
          <span className={`${cell} opacity-40`} role="img" aria-label="Call leasing team (number to be supplied)">
            <Icon name="phone" size={20} />
          </span>
        )}
        {settings.whatsapp ? (
          <a href={`https://wa.me/${settings.whatsapp}`} aria-label="WhatsApp" className={cell} tabIndex={show ? 0 : -1}>
            <Icon name="whatsapp" size={20} />
          </a>
        ) : (
          <span className={`${cell} opacity-40`} role="img" aria-label="WhatsApp (number to be supplied)">
            <Icon name="whatsapp" size={20} />
          </span>
        )}
      </div>
    </div>
  );
}
