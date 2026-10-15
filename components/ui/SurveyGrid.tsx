/** Visible 12-column survey grid + dot field — the "technical drawing" texture. */
export function SurveyGrid({ tone = "light", dots = true, className = "" }: { tone?: "dark" | "light"; dots?: boolean; className?: string }) {
  const line = tone === "light" ? "border-ink/[0.05]" : "border-white/[0.06]";
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 ${className}`}>
      {dots ? <div className={`absolute inset-0 ${tone === "light" ? "dot-field-light" : "dot-field"} opacity-50`} /> : null}
      <div className="shell grid-12 h-full">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className={`h-full border-l ${line} ${
              i < 4 ? (i === 3 ? "border-r sm:border-r-0" : "") : i < 8 ? `hidden sm:block ${i === 7 ? "sm:border-r lg:border-r-0" : ""}` : `hidden lg:block ${i === 11 ? "border-r" : ""}`
            }`}
          />
        ))}
      </div>
    </div>
  );
}

/** Pulsing map/site marker */
export function Marker({ size = 10, tone = "yellow", pulse = true, className = "" }: { size?: number; tone?: "yellow" | "green" | "paper"; pulse?: boolean; className?: string }) {
  const bg = tone === "green" ? "bg-green-500" : tone === "paper" ? "bg-paper" : "bg-yellow-400";
  return (
    <span aria-hidden className={`relative inline-block ${className}`} style={{ width: size, height: size }}>
      {pulse ? <span className={`absolute inset-0 rounded-full ${bg} animate-pulse-soft`} /> : null}
      <span className={`absolute inset-0 rounded-full ${bg}`} />
    </span>
  );
}
