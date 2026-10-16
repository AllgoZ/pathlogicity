import type { Homepage } from "@/lib/content";
import type { Partner } from "@/lib/content/types";
import { ArrowLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Metric } from "@/components/ui/Metric";
import { MmlpNetwork } from "./MmlpNetwork";
import { PartnerLogos } from "@/components/ui/PartnerLogos";
import { Reveal, RevealLines } from "@/components/ui/Reveal";

/** §07b — PM Gati Shakti: the national programme, a typographic equation, and the authorities behind it. Light, with brand-colour numerals. */
export function GatiShaktiBand({ data, partners }: { data: Homepage["gatiShakti"]; partners: Partner[] }) {
  return (
    <section id="pm-gati-shakti" data-stage="understand" aria-labelledby="gs-title" className="relative overflow-hidden bg-stone text-ink section-pad">
      <div aria-hidden className="pinwheel-stripe absolute inset-x-0 top-0 h-[3px]" />
      <div className="shell">
        <div className="grid-12 gap-y-6">
          <div className="col-span-4 sm:col-span-8 lg:col-span-7">
            <p className="t-label text-ink">
              <span data-idx className="text-indigo-700">07.1 /</span> PM Gati Shakti
            </p>
            <RevealLines id="gs-title" lines={data.headline} className="t-xl mt-5 text-ink" />
          </div>
          <p className="t-body-l col-span-4 self-end text-steel-700 sm:col-span-8 lg:col-span-4 lg:col-start-9">{data.tagline}</p>
        </div>

        {/* National programme in numbers (pathlogicity.com) beside the network it describes */}
        <div className="mt-16 grid items-center gap-12 border-t border-ink/10 pt-10 lg:mt-20 lg:grid-cols-12 lg:gap-16 lg:pt-14">
          <Reveal className="grid gap-10 lg:col-span-5">
            {data.facts.map((f, i) => (
              <Metric key={f.unit} data={f} size="l" valueClassName={i === 0 ? "text-indigo-700" : "text-blue-500"} />
            ))}
            <div className="border-l-[3px] border-yellow-400 pl-5">
              <p className="text-[clamp(1.125rem,1.4vw,1.375rem)] font-semibold leading-snug text-ink">{data.mmlp}</p>
              <ArrowLink href="/logicity-advantage#pm-gati-shakti" className="mt-2">
                PM Gati Shakti
              </ArrowLink>
            </div>
          </Reveal>
          <div className="lg:col-span-7">
            <MmlpNetwork hubLabel="Bengaluru" />
          </div>
        </div>

        {/* ROAD + RAIL + WAREHOUSING + COMMERCIAL + ICD = ONE ECOSYSTEM */}
        <Reveal className="mt-16 flex flex-wrap items-stretch gap-px bg-ink/10 shadow-[var(--shadow-card)] lg:mt-20 lg:flex-nowrap" stagger={0.08}>
          {data.equation.map((t) => (
            <div key={t.label} className="group flex grow basis-[calc(50%-1px)] flex-col gap-4 bg-paper px-5 py-7 transition-colors duration-300 hover:bg-indigo-50 sm:basis-[calc(33.333%-1px)] lg:basis-0 lg:px-7 lg:py-9">
              <Icon name={t.icon} size={30} draw className="text-indigo-700" />
              <p className="text-[clamp(1rem,1.2vw,1.1875rem)] font-bold text-ink">{t.label}</p>
            </div>
          ))}
          <div className="flex w-full items-center gap-5 bg-yellow-400 px-6 py-7 text-ink lg:w-auto lg:flex-[1.4] lg:py-9">
            <span aria-hidden className="text-4xl font-light leading-none">=</span>
            <p className="text-[clamp(1.125rem,1.5vw,1.5rem)] font-bold leading-[1.1]">
              One
              <br />
              <em className="accent [--accent-color:var(--color-ink)]">ecosystem</em>
            </p>
          </div>
        </Reveal>

        {/* Contributing to India's growth story */}
        <p className="t-label mt-16 text-ink lg:mt-20">Contributing to India&apos;s growth story</p>
        <Reveal as="ol" className="mt-4 grid gap-x-[var(--gutter)] sm:grid-cols-2 lg:grid-cols-3">
          {data.points.map((p, i) => (
            <li key={p} className="flex gap-4 border-t border-ink/10 py-5">
              <span className="t-micro tnum pt-1 text-indigo-700">{String(i + 1).padStart(2, "0")}</span>
              <p className="text-[1rem] leading-relaxed text-steel-700">{p}</p>
            </li>
          ))}
        </Reveal>

        <Reveal className="mt-10 border-l-[3px] border-yellow-400 pl-6 lg:mt-14 lg:max-w-[62ch]">
          <p className="t-label text-indigo-700">The impact</p>
          <p className="mt-2 text-[clamp(1.25rem,1.9vw,1.75rem)] font-semibold leading-snug tracking-[-0.01em] text-ink">{data.impact}</p>
        </Reveal>

        {/* Authorities + certification — the logos from the client's site */}
        <div className="mt-16 lg:mt-24">
          <p className="t-label text-steel-700">In association with</p>
          <PartnerLogos partners={partners} marquee className="mt-5" />
        </div>
      </div>
    </section>
  );
}
