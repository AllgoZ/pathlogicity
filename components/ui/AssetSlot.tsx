import { contourPaths } from "@/lib/contours";
import Image from "next/image";
import type { ReactNode } from "react";
import { RevealMedia } from "./RevealMedia";

type Props = {
  slot: string;
  spec?: string;
  id?: string;
  ratio?: string; // CSS aspect-ratio, e.g. "16/9". Omit to fill parent.
  tone?: "navy" | "ink" | "paper";
  variant?: number;
  animated?: boolean;
  compact?: boolean;
  annotate?: boolean;
  className?: string;
  children?: ReactNode;
  label?: string; // accessible description of the intended asset
  /** Real supplied asset. When set, the framed slot shows the image (registration
      corners kept) instead of the contour placeholder — same design, real photo. */
  src?: string | null;
  /** object-position for the cover image, e.g. "center", "top" */
  focus?: string;
  /** Hint for the responsive image width; defaults to a full-width frame. */
  sizes?: string;
  priority?: boolean;
  /** M4 wipe + settle + parallax on scroll (default on; off for the hero and keyed viewers) */
  reveal?: boolean;
};

const hasImageCorner = (src?: string | null) => Boolean(src);

/**
 * Deliberate placeholder for client imagery/video (docs/UI-PLAN.md §4.6).
 * Registration corners + contour art + mono annotations. Annotations hide with
 * ?annotations=off; the art direction stays.
 */
export function AssetSlot({
  slot,
  spec,
  id,
  ratio,
  tone = "paper",
  variant = 0,
  animated = true,
  compact = false,
  annotate = true,
  className = "",
  children,
  label,
  src,
  focus = "center",
  sizes = "(min-width: 1024px) 100vw, 100vw",
  priority = false,
  reveal = true,
}: Props) {
  const paths = contourPaths(variant);
  // Light theme: every placeholder is a light frame; "ink"/"navy" kept as aliases for a deeper grey.
  const bg = tone === "paper" ? "bg-paper-2" : "bg-paper-3";
  const stroke = "rgb(32 31 133 / 0.10)";
  const text = "text-ink/60";
  const corner = hasImageCorner(src) ? "border-paper/80" : "border-ink/30";
  const hasImage = Boolean(src);

  return (
    <div
      role="img"
      aria-label={label ?? `${slot} — client asset to be supplied`}
      className={`relative isolate overflow-hidden ${bg} ${className}`}
      style={ratio ? { aspectRatio: ratio } : undefined}
    >
      {hasImage ? (
        reveal ? (
          <RevealMedia>
            <Image
              src={src as string}
              alt=""
              fill
              sizes={sizes}
              priority={priority}
              className="img-grade object-cover"
              style={{ objectPosition: focus }}
            />
          </RevealMedia>
        ) : (
          <Image
            src={src as string}
            alt=""
            fill
            sizes={sizes}
            priority={priority}
            className="img-grade object-cover"
            style={{ objectPosition: focus }}
          />
        )
      ) : (
        <svg
          aria-hidden
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 1600 900"
          preserveAspectRatio="xMidYMid slice"
        >
          <g
            fill="none"
            stroke={stroke}
            strokeWidth={1.2}
            style={animated ? { animation: "drift 38s ease-in-out infinite alternate", transformOrigin: "50% 50%" } : undefined}
          >
            {paths.map((d, i) => (
              <path key={i} d={d} />
            ))}
          </g>
        </svg>
      )}
      {/* light sweep (placeholder only) */}
      {animated && !hasImage ? (
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/[0.5] to-transparent"
            style={{ animation: "sweep 9s ease-in-out infinite" }}
          />
        </div>
      ) : null}

      {annotate && !hasImage ? (
        <span aria-hidden className="slot-annotation">
          {/* registration corners — review-only, placeholders only */}
          <span aria-hidden className={`absolute left-3 top-3 h-4 w-4 border-l border-t ${corner}`} />
          <span aria-hidden className={`absolute right-3 top-3 h-4 w-4 border-r border-t ${corner}`} />
          <span aria-hidden className={`absolute bottom-3 left-3 h-4 w-4 border-b border-l ${corner}`} />
          <span aria-hidden className={`absolute bottom-3 right-3 h-4 w-4 border-b border-r ${corner}`} />
        </span>
      ) : null}

      {annotate && !hasImage ? (
      <div aria-hidden className={`slot-annotation pointer-events-none absolute inset-0 ${compact ? "p-4" : "p-5 lg:p-7"} ${text}`}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="t-micro">{id ? `Asset slot ${id}` : "Asset slot"}</p>
            <p className="t-label mt-1 text-ink/80">{slot}</p>
          </div>
          {ratio ? <p className="t-micro">{ratio.replace("/", " : ")}</p> : null}
        </div>
        {spec && !compact ? (
          <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4 lg:inset-x-7 lg:bottom-7">
            <p className="t-micro max-w-[42ch] normal-case tracking-[0.04em]">{spec}</p>
            <p className="t-micro shrink-0">Client</p>
          </div>
        ) : null}
      </div>
      ) : null}
      {children}
    </div>
  );
}
