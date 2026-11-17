import { Fragment, type CSSProperties } from "react";
import Image from "next/image";
import type { Partner } from "@/lib/content/types";

/** copies of the whole set in the track; the loop slides half of them, so half of them must be wider than the widest screen */
const COPIES = 8;

/**
 * Authority / partner logos from pathlogicity.com (+ the IGBC mark). Each mark
 * sits on its own white chip so it keeps its colours on any surface; the role
 * caption sits beneath the chip in the surface's text colour.
 *
 * `marquee` (M9, client round 8): the row scrolls slowly from left to right, always (even for three marks), and
 * pauses on hover / focus. The set is repeated enough times to fill any width; the copies are aria-hidden. Under
 * reduced motion the copies are hidden by CSS and the row is one still set.
 */
export function PartnerLogos({
  partners,
  compact = false,
  tone = "light",
  marquee = false,
  className = "",
}: {
  partners: Partner[];
  compact?: boolean;
  tone?: "light" | "dark";
  marquee?: boolean;
  className?: string;
}) {
  const loop = marquee && partners.length > 0;
  const item = (p: Partner, hidden = false) => (
    <li
      key={`${p.id}${hidden ? "-dup" : ""}`}
      aria-hidden={hidden || undefined}
      data-dup={hidden || undefined}
      className={`flex flex-col ${loop ? `marquee-item ${compact ? "w-[180px] shrink-0" : "w-[280px] shrink-0 lg:w-[320px]"}` : ""}`}
    >
      <span className={`lift flex items-center justify-center rounded-[2px] bg-paper ${compact ? "h-16 px-4" : "h-28 px-6 lg:h-32"} ${tone === "light" ? "shadow-[var(--shadow-card)]" : ""}`}>
        {p.logo && p.width && p.height ? (
          <Image
            src={p.logo}
            alt={hidden ? "" : p.name}
            width={p.width}
            height={p.height}
            sizes="200px"
            className={`h-auto w-auto max-w-full object-contain ${compact ? "max-h-11 sm:max-w-[130px]" : "max-h-20 sm:max-w-[190px] lg:max-h-[88px] lg:max-w-[210px]"}`}
          />
        ) : (
          // no logo supplied yet: the name, set in the chip
          <span className={`text-center font-bold leading-tight text-ink ${compact ? "text-[0.75rem]" : "text-[0.9375rem] lg:text-base"}`}>{p.name}</span>
        )}
      </span>
      {compact || !p.role ? null : <p className={`t-micro mt-3 ${tone === "light" ? "text-steel-500" : "text-paper/55"}`}>{p.role}</p>}
    </li>
  );

  if (loop) {
    return (
      <div className={`marquee overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)] ${className}`}>
        <ul className={`marquee-track flex w-max ${compact ? "gap-2" : "gap-4"}`} style={{ "--lap": `${Math.round((COPIES / 2) * partners.length * (compact ? 4.7 : 8.4))}s` } as CSSProperties} aria-label="In association with">
          {partners.map((p) => item(p))}
          {Array.from({ length: COPIES - 1 }, (_, c) => (
            <Fragment key={c}>{partners.map((p) => item(p, true))}</Fragment>
          ))}
        </ul>
      </div>
    );
  }

  return <ul aria-label="In association with" className={`grid grid-cols-2 sm:grid-cols-4 ${compact ? "gap-2" : "gap-x-3 gap-y-6 lg:gap-x-4"} ${className}`}>{partners.map((p) => item(p))}</ul>;
}
