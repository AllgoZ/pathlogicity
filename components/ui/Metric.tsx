import type { MetricData } from "@/lib/content/types";
import { Counter } from "./Counter";

type Size = "xxl" | "xl" | "l" | "m";
const sizes: Record<Size, string> = {
  xxl: "t-xxl",
  xl: "font-display font-medium tracking-[-0.05em] leading-[0.9] text-[clamp(3.25rem,6.5vw,6.5rem)]",
  l: "font-display font-medium tracking-[-0.045em] leading-[0.95] text-[clamp(2.5rem,4.2vw,4.25rem)]",
  m: "font-display font-medium tracking-[-0.04em] leading-none text-[clamp(2rem,2.8vw,2.875rem)]",
};


/** Metric anatomy: ~ (raised, small) · value · suffix · unit (mono) · label (body) */
export function Metric({
  data,
  size = "l",
  tone = "light",
  showLabel = true,
  valueClassName = "",
  className = "",
}: {
  data: MetricData;
  size?: Size;
  /** the SURFACE: "light" (default) or "dark" (photo / indigo) */
  tone?: "dark" | "light";
  showLabel?: boolean;
  /** colour for the numeral, e.g. one of PINWHEEL_TEXT */
  valueClassName?: string;
  className?: string;
}) {
  const muted = tone === "light" ? "text-steel-700" : "text-paper/80";
  return (
    <div className={className}>
      <p className={`flex items-start ${sizes[size]} ${valueClassName || (tone === "light" ? "text-ink" : "text-paper")}`}>
        {data.prefix ? <span className="mr-[0.04em] mt-[0.12em] text-[0.45em] font-semibold opacity-70">{data.prefix}</span> : null}
        <Counter value={data.value} decimals={data.decimals ?? 0} />
        {data.suffix ? <span className="text-[0.6em] leading-none opacity-90">{data.suffix}</span> : null}
      </p>
      {data.unit ? <p className={`t-label mt-3 ${tone === "light" ? "text-ink" : "text-paper"}`}>{data.unit}</p> : null}
      {showLabel && data.label ? <p className={`mt-1.5 max-w-[30ch] text-[0.9375rem] leading-snug ${muted}`}>{data.label}</p> : null}
    </div>
  );
}
