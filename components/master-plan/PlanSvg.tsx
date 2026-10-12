import type { KeyboardEvent, Ref } from "react";
import { boundary, GATE, PLAN_H, PLAN_W, ZONE_ORDER, zoneGeom } from "./planGeometry";

type Props = {
  active?: string | null;
  hover?: string | null;
  names?: Record<string, string>;
  interactive?: boolean;
  onEnter?: (id: string) => void;
  onLeave?: () => void;
  onSelect?: (id: string) => void;
  routeRef?: Ref<SVGPathElement>;
  routeTrailRef?: Ref<SVGPathElement>;
  headRef?: Ref<SVGGElement>;
  routeD?: string;
  showGrid?: boolean;
  markerRefs?: (id: string) => Ref<SVGCircleElement>;
  showMarkers?: boolean;
  /** Render as a nested <svg> with intrinsic size (for use inside a transformed parent) */
  nested?: boolean;
  className?: string;
};

/** Schematic master plan. Zones light up on hover/selection; others dim. */
export function PlanSvg({
  active = null,
  hover = null,
  names = {},
  interactive = false,
  onEnter,
  onLeave,
  onSelect,
  routeRef,
  routeTrailRef,
  headRef,
  routeD,
  showGrid = true,
  markerRefs,
  showMarkers = false,
  nested = false,
  className = "",
}: Props) {
  const focus = hover ?? active;
  const key = (id: string) => (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect?.(id);
    }
  };

  return (
    <svg
      viewBox={`0 0 ${PLAN_W} ${PLAN_H}`}
      width={nested ? PLAN_W : undefined}
      height={nested ? PLAN_H : undefined}
      className={nested ? className : `block h-auto w-full ${className}`} fill="none" role={interactive ? "group" : "img"} aria-label="Illustrative schematic of the Path Logicity master plan">
      <defs>
        <pattern id="plan-hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <path d="M0 0v8" stroke="rgb(255 255 255 / 0.06)" strokeWidth="1" />
        </pattern>
      </defs>

      {showGrid ? (
        <g aria-hidden stroke="rgb(255 255 255 / 0.05)" strokeWidth="1">
          {Array.from({ length: 11 }).map((_, i) => (
            <path key={`v${i}`} d={`M ${i * 100} 0 V ${PLAN_H}`} />
          ))}
          {Array.from({ length: 8 }).map((_, i) => (
            <path key={`h${i}`} d={`M 0 ${i * 91.4} H ${PLAN_W}`} />
          ))}
        </g>
      ) : null}

      {/* rail line beyond the site */}
      <path aria-hidden d="M 0 124 L 1000 102" stroke="rgb(147 187 230 / 0.25)" strokeWidth="1" strokeDasharray="2 6" />

      {/* site boundary */}
      <path aria-hidden d={boundary} fill="url(#plan-hatch)" stroke="rgb(255 255 255 / 0.35)" strokeWidth="1.2" strokeDasharray="10 5" />

      {ZONE_ORDER.map((id) => {
        const g = zoneGeom[id];
        const isFocus = focus === id;
        const dim = focus !== null && !isFocus;
        const isRoad = id === "roads";
        return (
          <g
            key={id}
            data-zone={id}
            className={`transition-opacity duration-500 ${interactive ? "cursor-pointer outline-none" : ""}`}
            opacity={dim ? 0.28 : 1}
            tabIndex={interactive ? 0 : undefined}
            role={interactive ? "button" : undefined}
            aria-label={interactive ? names[id] ?? id : undefined}
            aria-pressed={interactive ? active === id : undefined}
            onMouseEnter={interactive ? () => onEnter?.(id) : undefined}
            onMouseLeave={interactive ? () => onLeave?.() : undefined}
            onFocus={interactive ? () => onEnter?.(id) : undefined}
            onBlur={interactive ? () => onLeave?.() : undefined}
            onClick={interactive ? () => onSelect?.(id) : undefined}
            onKeyDown={interactive ? key(id) : undefined}
          >
            {isRoad ? (
              <>
                <path d={g.d} stroke="transparent" strokeWidth="22" />
                <path d={g.d} stroke={isFocus ? "rgb(231 172 0 / 0.4)" : "rgb(255 255 255 / 0.1)"} strokeWidth="9" className="transition-[stroke] duration-300" />
                <path d={g.d} stroke={isFocus ? "rgb(231 172 0 / 0.9)" : "rgb(255 255 255 / 0.28)"} strokeWidth="1" strokeDasharray="6 6" className="transition-[stroke] duration-300" />
              </>
            ) : (
              <>
                <path
                  d={g.d}
                  fill={isFocus ? (id === "green" ? "rgb(68 158 53 / 0.55)" : "rgb(32 31 133 / 0.78)") : id === "green" ? "rgb(68 158 53 / 0.16)" : "rgb(90 138 210 / 0.12)"}
                  stroke={isFocus ? "var(--color-yellow-400)" : "rgb(255 255 255 / 0.3)"}
                  strokeWidth={isFocus ? 1.5 : 1}
                  className="transition-[fill,stroke] duration-300"
                />
                {g.detail ? (
                  <path
                    aria-hidden
                    d={g.detail}
                    stroke={isFocus ? "rgb(243 239 230 / 0.6)" : "rgb(255 255 255 / 0.18)"}
                    strokeWidth="1"
                    fill={id === "icd" || id === "commercial" ? (isFocus ? "rgb(243 239 230 / 0.08)" : "none") : "none"}
                    className="pointer-events-none transition-[stroke] duration-300"
                  />
                ) : null}
              </>
            )}
            {showMarkers && markerRefs ? <circle ref={markerRefs(id)} cx={g.anchor.x} cy={g.anchor.y} r="4" fill="var(--color-yellow-400)" opacity={isFocus ? 1 : 0.0} /> : null}
          </g>
        );
      })}

      {/* gate */}
      <g aria-hidden transform={`translate(${GATE.x} ${GATE.y})`}>
        <rect x="-9" y="-9" width="18" height="18" fill="var(--color-navy-950)" stroke="rgb(243 239 230 / 0.8)" />
        <path d="M -4 0 H 4 M 0 -4 V 4" stroke="var(--color-yellow-400)" />
      </g>

      {/* route from gate to the selected zone */}
      {routeD !== undefined ? (
        <g aria-hidden className="pointer-events-none">
          <path ref={routeRef} d={routeD} stroke="none" />
          <path ref={routeTrailRef} d={routeD} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1} stroke="var(--color-yellow-400)" strokeWidth="2.5" strokeLinecap="round" />
          <g ref={headRef} opacity={0}>
            <circle r="11" fill="rgb(231 172 0 / 0.18)" />
            <circle r="4.5" fill="var(--color-yellow-400)" />
          </g>
        </g>
      ) : null}
    </svg>
  );
}
