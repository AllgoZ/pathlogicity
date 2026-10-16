"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { telHref } from "@/lib/content";
import type { NavItem, SiteSettings } from "@/lib/content/types";
import { Icon } from "@/components/ui/Icon";
import { Logo } from "./Logo";
import { Magnetic } from "@/components/ui/Magnetic";
import { useHeroThreshold, useHideOnScroll, useScrolledPast } from "./useHeroThreshold";

export function Nav({ items, settings }: { items: NavItem[]; settings: SiteSettings }) {
  const pathname = usePathname();
  const threshold = useHeroThreshold();
  const [open, setOpen] = useState<number | null>(null);
  const [menu, setMenu] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const solid = useScrolledPast(24); // the hero is light, so the bar turns solid as soon as content starts to slide under it
  // Hide on fast downward scroll after the hero; reveal on any upward scroll.
  const hidden = useHideOnScroll(threshold + 240, menu || open !== null);
  // the hero is light, so the nav keeps dark text everywhere (kept as a flag in case a page gets a photo-led hero)
  const onImage = false;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(null);
        setMenu(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (menu) window.__lenis?.stop();
    else window.__lenis?.start();
    document.documentElement.style.overflow = menu ? "hidden" : "";
  }, [menu]);

  useEffect(() => {
    setMenu(false);
    setOpen(null);
  }, [pathname]);

  const hoverOpen = (i: number | null) => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(i), i === null ? 160 : 110);
  };

  const isCurrent = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <>
      <a
        href="#main"
        className="fixed left-4 top-4 z-[100] -translate-y-24 bg-yellow-400 px-4 py-3 text-sm font-semibold text-ink focus:translate-y-0"
      >
        Skip to content
      </a>

      <header
        className={`${onImage ? "on-dark" : ""} fixed inset-x-0 top-0 z-50 transition-[transform,background-color,height,border-color] duration-300 ease-[var(--ease-out-expo)] ${
          hidden ? "-translate-y-full" : "translate-y-0"
        } ${solid || menu ? "border-b border-ink/[0.06] bg-porcelain/90 shadow-[0_8px_30px_-18px_rgb(17_18_51/0.25)] backdrop-blur-xl" : "border-b border-transparent bg-transparent"}`}
      >
        {/* the client pinwheel as a 2px signature stripe, drawn in once the nav turns solid */}
        <span
          aria-hidden
          className={`pinwheel-stripe absolute inset-x-0 bottom-0 h-[2px] origin-left transition-transform duration-700 ease-[var(--ease-out-expo)] ${solid && !menu ? "scale-x-100" : "scale-x-0"}`}
        />
        <div className={`shell flex items-center justify-between transition-[height] duration-300 ${solid ? "h-16" : "h-16 lg:h-[88px]"}`}>
          <Logo tone={onImage ? "light" : "dark"} className={`relative z-[60] transition-transform duration-300 ${solid ? "lg:scale-90" : ""} origin-left`} />

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-[clamp(14px,1.9vw,34px)]">
              {items.map((item, i) => (
                <li
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => item.children && hoverOpen(i)}
                  onMouseLeave={() => item.children && hoverOpen(null)}
                >
                  {item.children ? (
                    <>
                      <button
                        type="button"
                        aria-expanded={open === i}
                        aria-controls={`nav-panel-${i}`}
                        onClick={() => setOpen(open === i ? null : i)}
                        className={`group relative flex items-center gap-1.5 py-3 text-[0.875rem] font-semibold transition-colors ${
                          onImage ? (isCurrent(item.href) || open === i ? "text-paper" : "text-paper/75 hover:text-paper") : isCurrent(item.href) || open === i ? "text-indigo-700" : "text-ink/80 hover:text-indigo-700"
                        }`}
                      >
                        {item.label}
                        <svg width="9" height="9" viewBox="0 0 9 9" aria-hidden className={`transition-transform duration-300 ${open === i ? "rotate-180" : ""}`}>
                          <path d="M1 3l3.5 3L8 3" stroke="currentColor" strokeWidth="1.3" fill="none" />
                        </svg>
                        <Underline active={isCurrent(item.href)} />
                      </button>
                      <div
                        id={`nav-panel-${i}`}
                        className={`absolute left-1/2 top-full w-[300px] -translate-x-1/2 pt-3 transition-[opacity,transform,visibility] duration-300 ease-[var(--ease-out-expo)] ${
                          open === i ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0"
                        }`}
                      >
                        <div className="relative border border-ink/10 bg-paper shadow-[0_18px_40px_-16px_rgb(26_28_70/0.25)]">
                          <span
                            aria-hidden
                            className={`absolute left-0 top-0 h-px w-full origin-left bg-yellow-400 transition-transform duration-500 ease-[var(--ease-out-expo)] ${
                              open === i ? "scale-x-100" : "scale-x-0"
                            }`}
                          />
                          <ul className="py-2">
                            {item.children.map((c, j) => (
                              <li key={c.href}>
                                <Link
                                  href={c.href}
                                  className="group flex gap-4 px-5 py-3.5 transition-colors hover:bg-porcelain focus-visible:bg-porcelain"
                                >
                                  <span className="t-micro pt-[3px] text-indigo-700">{String(j + 1).padStart(2, "0")}</span>
                                  <span>
                                    <span className="block text-[0.9375rem] font-bold text-ink">{c.label}</span>
                                    {c.note ? <span className="mt-1 block text-[0.8125rem] leading-snug text-steel-500">{c.note}</span> : null}
                                  </span>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      aria-current={isCurrent(item.href) ? "page" : undefined}
                      className={`group relative block py-3 text-[0.875rem] font-semibold transition-colors ${
                        onImage ? (isCurrent(item.href) ? "text-paper" : "text-paper/75 hover:text-paper") : isCurrent(item.href) ? "text-indigo-700" : "text-ink/80 hover:text-indigo-700"
                      }`}
                    >
                      {item.label}
                      <Underline active={isCurrent(item.href)} />
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="relative z-[60] flex items-center gap-3">
            <Magnetic strength={0.22}>
            <Link
              href="#enquire"
              className="group inline-flex h-10 items-center gap-2 bg-yellow-400 px-4 text-[0.8125rem] font-bold uppercase tracking-[0.05em] text-ink transition-colors duration-300 hover:bg-indigo-700 hover:text-paper lg:h-11 lg:px-5"
            >
              Enquire
              <Icon name="arrow-right" size={15} className="arrow-nudge hidden sm:block" />
            </Link>
            </Magnetic>
            <button
              type="button"
              aria-expanded={menu}
              aria-controls="mobile-menu"
              aria-label={menu ? "Close menu" : "Open menu"}
              onClick={() => setMenu((m) => !m)}
              className="relative flex h-10 w-10 items-center justify-center lg:hidden"
            >
              <span className={`absolute h-0.5 w-6 transition-transform duration-300 ${onImage ? "bg-paper" : "bg-ink"} ${menu ? "rotate-45" : "-translate-y-[5px]"}`} />
              <span className={`absolute h-0.5 w-6 transition-transform duration-300 ${onImage ? "bg-paper" : "bg-ink"} ${menu ? "-rotate-45" : "translate-y-[5px]"}`} />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={menu} items={items} settings={settings} onClose={() => setMenu(false)} />
    </>
  );
}

function Underline({ active }: { active: boolean }) {
  return (
    <span
      aria-hidden
      className={`absolute bottom-1.5 left-1/2 h-[2px] w-full -translate-x-1/2 bg-yellow-400 transition-transform duration-200 ease-[var(--ease-out-expo)] ${
        active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
      }`}
    />
  );
}

function MobileMenu({ open, items, settings, onClose }: { open: boolean; items: NavItem[]; settings: SiteSettings; onClose: () => void }) {
  const [expanded, setExpanded] = useState<number | null>(null);
  const first = useRef<HTMLAnchorElement>(null);
  useEffect(() => {
    if (open) setTimeout(() => first.current?.focus(), 350);
  }, [open]);

  return (
    <div
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      className={`fixed inset-0 z-40 flex flex-col bg-porcelain transition-[clip-path,visibility] duration-700 ease-[var(--ease-out-expo)] lg:hidden ${
        open ? "visible [clip-path:inset(0_0_0_0)]" : "invisible [clip-path:inset(0_0_100%_0)]"
      }`}
      data-lenis-prevent
    >
      <div aria-hidden className="dot-field-light pointer-events-none absolute inset-0 opacity-60" />
      <nav aria-label="Mobile" className="relative flex-1 overflow-y-auto px-[var(--margin)] pb-8 pt-24">
        <ol className="border-t border-ink/10">
          {items.map((item, i) => (
            <li
              key={item.label}
              className="border-b border-ink/10"
              style={{ transition: "opacity .6s, transform .8s var(--ease-out-expo)", transitionDelay: open ? `${120 + i * 50}ms` : "0ms", opacity: open ? 1 : 0, transform: open ? "none" : "translateY(24px)" }}
            >
              <div className="flex items-center justify-between">
                <Link ref={i === 0 ? first : undefined} href={item.href} onClick={onClose} className="flex flex-1 items-baseline gap-4 py-4">
                  <span className="t-micro text-indigo-700">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-display text-[clamp(1.5rem,6.5vw,2.25rem)] font-semibold leading-tight tracking-[-0.02em] text-ink">{item.label}</span>
                </Link>
                {item.children ? (
                  <button
                    type="button"
                    aria-expanded={expanded === i}
                    aria-label={`${item.label} sections`}
                    onClick={() => setExpanded(expanded === i ? null : i)}
                    className="flex h-12 w-12 items-center justify-center text-ink"
                  >
                    <Icon name="plus" size={20} className={`transition-transform duration-300 ${expanded === i ? "rotate-45" : ""}`} />
                  </button>
                ) : null}
              </div>
              {item.children ? (
                <div className={`grid transition-[grid-template-rows] duration-500 ease-[var(--ease-out-expo)] ${expanded === i ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                  <ul className="overflow-hidden pl-9">
                    {item.children.map((c) => (
                      <li key={c.href}>
                        <Link href={c.href} onClick={onClose} className="block py-3 text-[0.9375rem] font-semibold text-steel-700">
                          {c.label}
                        </Link>
                      </li>
                    ))}
                    <li className="h-3" />
                  </ul>
                </div>
              ) : null}
            </li>
          ))}
        </ol>
      </nav>
      <div className="relative border-t border-ink/10 px-[var(--margin)] pb-[max(20px,env(safe-area-inset-bottom))] pt-5">
        <Link href="#enquire" onClick={onClose} className="flex h-[52px] w-full items-center justify-center gap-3 bg-yellow-400 text-[0.875rem] font-bold uppercase tracking-[0.05em] text-ink">
          Enquire leasing now <Icon name="arrow-right" size={18} />
        </Link>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex gap-2">
            <QuickIcon icon="phone" label="Call leasing team" href={settings.phone ? telHref(settings.phone) : null} />
            <QuickIcon icon="whatsapp" label="WhatsApp" href={settings.whatsapp ? `https://wa.me/${settings.whatsapp}` : null} />
          </div>
          <div className="flex gap-1">
            {settings.socials.map((s) => (
              <QuickIcon key={s.label} icon={s.icon} label={s.label} href={s.href} small />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickIcon({ icon, label, href, small }: { icon: import("@/lib/content/types").IconName; label: string; href: string | null; small?: boolean }) {
  const cls = `flex items-center justify-center border border-ink/15 text-ink ${small ? "h-10 w-10" : "h-12 w-12"}`;
  // Contact links are CMS values (not yet supplied) — render inert until set.
  return href ? (
    <a href={href} aria-label={label} className={cls}>
      <Icon name={icon} size={small ? 16 : 20} />
    </a>
  ) : (
    <span aria-label={`${label} (link to be supplied)`} role="img" className={`slot-annotation ${cls} opacity-50`} title={`${label} — to be supplied`}>
      <Icon name={icon} size={small ? 16 : 20} />
    </span>
  );
}
