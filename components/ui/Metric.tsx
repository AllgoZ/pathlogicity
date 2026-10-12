import type { MetricData } from "@/lib/content/types";
import { Counter } from "./Counter";

type Size = "xxl" | "xl" | "l" | "m";
const sizes: Record<Size, string> = {
  xxl: "t-xxl",
  xl: "font-display font-bold tracking-[-0.055em] leading-[0.82] text-[clamp(4rem,10vw,10rem)]",
  l: "font-display font-bold tracking-[-0.05em] leading-[0.85] text-[clamp(3rem,6vw,6.5rem)]",
  m: "font-display font-bold tracking-[-0.04em] leading-[0.88] text-[clamp(2.25rem,3.6vw,3.75rem)]",
};

/** Metric anatomy: ~ (raised, small) · value · suffix · unit (mono) · label (body) */
export function Metric({
  data,
  size = "l",
  tone = "dark",
  showLabel = true,
  className = "",
}: {
  data: MetricData;
  size?: Size;
  tone?: "dark" | "light";
  showLabel?: boolean;
  className?: string;
}) {
  const muted = tone === "light" ? "text-steel-700" : "text-steel-300";
  return (
    <div className={className}>
      <p className={`flex items-start ${sizes[size]}`}>
        {data.prefix ? <span className="mr-[0.04em] mt-[0.12em] text-[0.45em] font-semibold opacity-70">{data.prefix}</span> : null}
        <Counter value={data.value} decimals={data.decimals ?? 0} />
        {data.suffix ? <span className="text-[0.6em] leading-none opacity-90">{data.suffix}</span> : null}
      </p>
      {data.unit ? <p className={`t-label mt-3 ${tone === "light" ? "text-navy-950" : "text-paper"}`}>{data.unit}</p> : null}
      {showLabel && data.label ? <p className={`mt-1.5 max-w-[30ch] text-sm leading-snug ${muted}`}>{data.label}</p> : null}
    </div>
  );
}
