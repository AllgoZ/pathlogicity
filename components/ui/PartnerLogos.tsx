import Image from "next/image";
import type { Partner } from "@/lib/content/types";

/**
 * Authority / partner logos from pathlogicity.com (+ the IGBC mark). Each mark
 * sits on its own white chip so it keeps its colours on any surface; the role
 * caption sits beneath the chip in the surface's text colour.
 * `marquee` (M9): the row drifts slowly and pauses on hover; under reduced
 * motion it stays still. The duplicate copy is aria-hidden.
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
  const item = (p: Partner, hidden = false) => (
    <li key={`${p.id}${hidden ? "-dup" : ""}`} aria-hidden={hidden || undefined} className={`flex flex-col ${marquee ? (compact ? "w-[180px] shrink-0" : "w-[280px] shrink-0 lg:w-[320px]") : ""}`}>
      <span className={`lift flex items-center justify-center rounded-[2px] bg-paper ${compact ? "h-16 px-4" : "h-28 px-6 lg:h-32"} ${tone === "light" ? "shadow-[var(--shadow-card)]" : ""}`}>
        <Image
          src={p.logo}
          alt={hidden ? "" : p.name}
          width={p.width}
          height={p.height}
          sizes="200px"
          className={`h-auto w-auto max-w-full object-contain ${compact ? "max-h-11 sm:max-w-[130px]" : "max-h-20 sm:max-w-[190px] lg:max-h-[88px] lg:max-w-[210px]"}`}
        />
      </span>
      {compact ? null : <p className={`t-micro mt-3 ${tone === "light" ? "text-steel-500" : "text-paper/55"}`}>{p.role}</p>}
    </li>
  );

  if (marquee) {
    return (
      <div className={`marquee overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)] ${className}`}>
        <ul className={`marquee-track flex w-max ${compact ? "gap-2" : "gap-4"}`} aria-label="In association with">
          {partners.map((p) => item(p))}
          {partners.map((p) => item(p, true))}
          {partners.map((p) => item(p, true))}
          {partners.map((p) => item(p, true))}
        </ul>
      </div>
    );
  }

  return <ul className={`grid grid-cols-2 sm:grid-cols-4 ${compact ? "gap-2" : "gap-x-3 gap-y-6 lg:gap-x-4"} ${className}`}>{partners.map((p) => item(p))}</ul>;
}
