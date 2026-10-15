import Image from "next/image";
import type { Partner } from "@/lib/content/types";

/**
 * Authority / partner logos from pathlogicity.com (+ the IGBC mark), on white
 * tiles so every mark keeps its own colours on any surface.
 */
export function PartnerLogos({ partners, compact = false, tone = "light", className = "" }: { partners: Partner[]; compact?: boolean; tone?: "light" | "dark"; className?: string }) {
  const rules = tone === "light" ? "border-ink/10 bg-ink/10" : "border-paper/20 bg-paper/20";
  return (
    <ul className={`grid grid-cols-2 gap-px border sm:grid-cols-4 ${rules} ${className}`}>
      {partners.map((p) => (
        <li key={p.id} className={`flex flex-col items-center justify-center bg-paper text-center ${compact ? "gap-0 px-4 py-4" : "gap-4 px-5 py-8"}`}>
          <Image
            src={p.logo}
            alt={p.name}
            width={p.width}
            height={p.height}
            sizes="200px"
            className={`h-auto w-auto max-w-full object-contain ${compact ? "max-h-12 sm:max-w-[140px]" : "max-h-20 sm:max-w-[200px] lg:max-h-24 lg:max-w-[220px]"}`}
          />
          {compact ? null : <p className="t-micro max-w-[22ch] text-steel-500">{p.role}</p>}
        </li>
      ))}
    </ul>
  );
}
