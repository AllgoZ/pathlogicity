import type { Homepage } from "@/lib/content";
import type { Partner } from "@/lib/content/types";
import { ArrowLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Metric, PINWHEEL_TEXT } from "@/components/ui/Metric";
import { PartnerLogos } from "@/components/ui/PartnerLogos";
import { Reveal, RevealLines } from "@/components/ui/Reveal";

/** §07b — PM Gati Shakti: the network expands to the nation. A typographic equation + the authorities behind it. */
export function GatiShaktiBand({ data, partners }: { data: Homepage["gatiShakti"]; partners: Partner[] }) {
  return (
    <section id="pm-gati-shakti" data-stage="understand" aria-labelledby="gs-title" className="relative overflow-hidden bg-canvas-2 pb-[clamp(88px,12vh,160px)] pt-[clamp(72px,10vh,128px)]">
      <div className="shell">
        <div className="grid-12 gap-y-6">
          <div className="col-span-4 sm:col-span-8 lg:col-span-7">
            <p className="t-label text-ink">
              <span className="text-blue-500">07.1 /</span> PM Gati Shakti
            </p>
            <RevealLines id="gs-title" lines={data.headline} className="t-l mt-5 text-ink" />
          </div>
          <p className="t-body-l col-span-4 self-end text-steel-700 sm:col-span-8 lg:col-span-4 lg:col-start-9">{data.tagline}</p>
        </div>

        {/* ROAD + RAIL + WAREHOUSING + COMMERCIAL + ICD = ONE ECOSYSTEM */}
        <Reveal className="mt-14 flex flex-wrap items-stretch border border-ink/10 bg-paper lg:mt-16 lg:flex-nowrap" stagger={0.08}>
          {data.equation.map((t, i) => (
            <div key={t.label} className="group flex w-1/2 items-center sm:w-1/3 lg:w-auto lg:flex-1">
              <div className="flex flex-1 flex-col gap-3 border-b border-r border-ink/10 px-4 py-6 lg:border-b-0 lg:px-6 lg:py-8">
                <Icon name={t.icon} size={30} draw className="text-blue-500 transition-colors duration-300 group-hover:text-green-500" />
                <p className="font-display text-[clamp(1rem,1.3vw,1.25rem)] font-bold text-ink">{t.label}</p>
              </div>
              {i < data.equation.length - 1 ? (
                <span aria-hidden className="t-label hidden w-8 shrink-0 justify-center text-steel-500 lg:flex">
                  +
                </span>
              ) : null}
            </div>
          ))}
          <div className="flex w-full items-center gap-5 bg-yellow-400 px-6 py-6 text-ink sm:w-2/3 lg:w-auto lg:flex-[1.4] lg:py-8">
            <span aria-hidden className="font-display text-4xl font-light leading-none">=</span>
            <span className="relative flex h-10 w-10 shrink-0 items-center justify-center">
              <Icon name="crosshair" size={34} />
            </span>
            <p className="font-display text-[clamp(1.125rem,1.5vw,1.5rem)] font-extrabold leading-[1.1]">
              One
              <br />
              ecosystem
            </p>
          </div>
        </Reveal>

        <div className="mt-14 grid-12 gap-y-10">
          {/* National programme, in numbers (pathlogicity.com) */}
          <Reveal className="col-span-4 grid grid-cols-2 gap-x-[var(--gutter)] sm:col-span-8 lg:col-span-5">
            {data.facts.map((f, i) => (
              <div key={f.unit} className="border-t-2 border-ink/10 pt-5">
                <Metric data={f} size="m" valueClassName={PINWHEEL_TEXT[(i + 1) % PINWHEEL_TEXT.length]} />
              </div>
            ))}
          </Reveal>
          <Reveal as="ol" className="col-span-4 sm:col-span-8 lg:col-span-6 lg:col-start-7">
            {data.points.map((p, i) => (
              <li key={p} className="flex gap-4 border-t border-ink/10 py-4">
                <span className="t-micro pt-1 text-blue-500">{String(i + 1).padStart(2, "0")}</span>
                <p className="text-[1rem] leading-relaxed text-steel-700">{p}</p>
              </li>
            ))}
            <li className="flex items-center justify-between gap-6 border-t border-ink/10 pt-5">
              <p className="text-[0.9375rem] font-semibold text-ink">{data.mmlp}</p>
              <ArrowLink href="/logicity-advantage#pm-gati-shakti" className="shrink-0">
                PM Gati Shakti
              </ArrowLink>
            </li>
          </Reveal>
        </div>

        {/* Authorities + certification — the logos from the client's site */}
        <div className="mt-16 lg:mt-20">
          <p className="t-micro text-steel-500">In association with</p>
          <PartnerLogos partners={partners} className="mt-4" />
        </div>
      </div>
    </section>
  );
}
