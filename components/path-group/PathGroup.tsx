import type { Homepage } from "@/lib/content";
import { AssetSlot } from "@/components/ui/AssetSlot";
import { ArrowLink } from "@/components/ui/Button";
import { Metric, PINWHEEL_TEXT } from "@/components/ui/Metric";
import { Reveal, RevealLines } from "@/components/ui/Reveal";
import { EvolutionLine } from "./EvolutionLine";

/** §05 — PATH Group: editorial, legacy-led chapter on the light-grey surface. */
export function PathGroup({ data }: { data: Homepage["pathGroup"] }) {
  return (
    <section id="path-group" data-stage="believe" aria-labelledby="pg-title" className="relative bg-canvas-2 section-pad">
      <div className="shell">
        <p className="t-label flex items-center gap-3 text-ink">
          <span className="text-blue-500">05 /</span> PATH Group
        </p>
        <h2 id="pg-title" className="mt-5">
          <RevealLines as="span" lines={[data.headline.from]} className="t-l block font-normal text-steel-700 [&_[data-line]]:font-normal" />
          <RevealLines as="span" lines={data.headline.to} className="t-xl mt-1 block text-ink" />
        </h2>
      </div>

      {/* Infrastructure photography, then the numbers on a white band */}
      <div className="shell mt-12 lg:mt-16">
        <AssetSlot slot={data.photo.slot} spec={data.photo.spec} ratio="21/9" id="05" variant={3} className="min-h-[220px] w-full lg:min-h-[440px]" label={data.photo.alt} src={data.photo.src} focus="center" sizes="(min-width: 1600px) 1600px, 100vw" />
        <Reveal className="grid grid-cols-2 border-x border-b border-ink/10 bg-paper lg:grid-cols-4" stagger={0.1}>
          {data.metrics.map((m, i) => (
            <div key={m.unit} className={`px-5 py-7 lg:px-8 lg:py-10 ${i % 2 === 1 ? "border-l border-ink/10" : ""} ${i > 1 ? "border-t border-ink/10 lg:border-t-0" : ""} ${i === 2 ? "lg:border-l" : ""}`}>
              <Metric data={m} size="l" valueClassName={PINWHEEL_TEXT[i % PINWHEEL_TEXT.length]} />
            </div>
          ))}
        </Reveal>
      </div>

      <div className="shell mt-16 grid-12 gap-y-10 lg:mt-20">
        <Reveal className="col-span-4 sm:col-span-8 lg:col-span-8">
          <p className="t-micro text-blue-500">About PATH</p>
          <blockquote className="mt-4 font-display text-[clamp(1.25rem,1.9vw,1.75rem)] font-normal leading-[1.45] text-ink">
            <span aria-hidden className="text-yellow-400">“</span>
            {data.story}
            <span aria-hidden className="text-yellow-400">”</span>
          </blockquote>
        </Reveal>
        <Reveal className="col-span-4 self-end sm:col-span-8 lg:col-span-3 lg:col-start-10">
          <p className="t-micro text-steel-500">Experience across</p>
          <ul className="mt-4 border-t border-ink/15">
            {data.sectors.map((s, i) => (
              <li key={s} className="t-label flex items-center justify-between border-b border-ink/15 py-3.5 text-ink">
                {s}
                <span aria-hidden className={`h-2 w-2 ${["bg-green-500", "bg-blue-500", "bg-yellow-400"][i % 3]}`} />
              </li>
            ))}
          </ul>
        </Reveal>
      </div>

      <div className="shell mt-16 lg:mt-24">
        <EvolutionLine steps={data.evolution} />
        <div className="mt-12 flex justify-end">
          <ArrowLink href="/path-group">Know more about PATH</ArrowLink>
        </div>
      </div>
    </section>
  );
}
