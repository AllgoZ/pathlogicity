import type { Homepage } from "@/lib/content";
import type { Partner } from "@/lib/content/types";
import { ArrowLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Metric } from "@/components/ui/Metric";
import { PartnerLogos } from "@/components/ui/PartnerLogos";
import { Reveal, RevealLines } from "@/components/ui/Reveal";

/** §07b — PM Gati Shakti on midnight: the national programme, a typographic equation, and the authorities behind it. */
export function GatiShaktiBand({ data, partners }: { data: Homepage["gatiShakti"]; partners: Partner[] }) {
  return (
    <section
      id="pm-gati-shakti"
      data-surface="dark"
      data-stage="understand"
      aria-labelledby="gs-title"
      className="on-dark grain glow-brand relative overflow-hidden bg-midnight text-paper section-pad"
    >
      <div aria-hidden className="pinwheel-stripe absolute inset-x-0 top-0 h-[2px]" />
      <div className="shell">
        <div className="grid-12 gap-y-6">
          <div className="col-span-4 sm:col-span-8 lg:col-span-7">
            <p className="t-label text-paper">
              <span className="text-yellow-400">07.1 /</span> PM Gati Shakti
            </p>
            <RevealLines id="gs-title" lines={data.headline} className="t-xl mt-5 text-paper" />
          </div>
          <p className="t-body-l col-span-4 self-end text-paper/70 sm:col-span-8 lg:col-span-4 lg:col-start-9">{data.tagline}</p>
        </div>

        {/* National programme, in numbers (pathlogicity.com) — gold numerals on midnight */}
        <Reveal className="mt-16 grid grid-cols-1 gap-y-10 border-t border-white/10 pt-10 sm:grid-cols-3 lg:mt-20 lg:pt-14">
          {data.facts.map((f) => (
            <div key={f.unit} className="sm:pr-8">
              <Metric data={f} size="l" tone="dark" valueClassName="text-yellow-400" />
            </div>
          ))}
          <div className="flex flex-col justify-between gap-6 sm:border-l sm:border-white/10 sm:pl-8">
            <p className="font-display text-[clamp(1.125rem,1.4vw,1.375rem)] font-medium leading-snug text-paper">{data.mmlp}</p>
            <ArrowLink href="/logicity-advantage#pm-gati-shakti" tone="light">
              PM Gati Shakti
            </ArrowLink>
          </div>
        </Reveal>

        {/* ROAD + RAIL + WAREHOUSING + COMMERCIAL + ICD = ONE ECOSYSTEM */}
        <Reveal className="mt-16 flex flex-wrap items-stretch gap-px bg-white/10 lg:mt-20 lg:flex-nowrap" stagger={0.08}>
          {data.equation.map((t) => (
            <div key={t.label} className="group flex grow basis-[calc(50%-1px)] flex-col gap-4 bg-midnight-2 px-5 py-7 sm:basis-[calc(33.333%-1px)] lg:basis-0 lg:px-7 lg:py-9">
              <Icon name={t.icon} size={30} draw className="text-yellow-400 transition-colors duration-300 group-hover:text-paper" />
              <p className="font-display text-[clamp(1rem,1.2vw,1.1875rem)] font-semibold text-paper">{t.label}</p>
            </div>
          ))}
          <div className="flex w-full items-center gap-5 bg-yellow-400 px-6 py-7 text-ink lg:w-auto lg:flex-[1.4] lg:py-9">
            <span aria-hidden className="font-display text-4xl font-light leading-none">=</span>
            <p className="font-display text-[clamp(1.125rem,1.5vw,1.5rem)] font-semibold leading-[1.1]">
              One
              <br />
              <em className="accent text-[1.15em] [--accent-color:var(--color-ink)]">ecosystem</em>
            </p>
          </div>
        </Reveal>

        <Reveal as="ol" className="mt-14 grid gap-x-[var(--gutter)] lg:grid-cols-3">
          {data.points.map((p, i) => (
            <li key={p} className="flex gap-4 border-t border-white/10 py-5">
              <span className="t-micro pt-1 text-yellow-400">{String(i + 1).padStart(2, "0")}</span>
              <p className="text-[1rem] leading-relaxed text-paper/75">{p}</p>
            </li>
          ))}
        </Reveal>

        {/* Authorities + certification — the logos from the client's site */}
        <div className="mt-16 lg:mt-24">
          <p className="t-micro text-paper/55">In association with</p>
          <PartnerLogos partners={partners} tone="dark" marquee className="mt-5" />
        </div>
      </div>
    </section>
  );
}
