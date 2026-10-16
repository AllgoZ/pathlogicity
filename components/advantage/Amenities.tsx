import Image from "next/image";
import type { Amenity } from "@/lib/content/types";
import { Icon } from "@/components/ui/Icon";
import { Rail } from "@/components/ui/Rail";
import { Reveal, RevealLines } from "@/components/ui/Reveal";

/**
 * §06.2 — Amenities. "Everything your business needs. And more." A free-scrolling rail of the
 * seven amenities (copy: concept note). A panel shows a photograph only when the client has
 * supplied one; otherwise it is a branded icon tile — never stock or a visible placeholder.
 */
export function Amenities({ items }: { items: Amenity[] }) {
  return (
    <section id="amenities" data-stage="understand" aria-labelledby="amenities-title" className="relative overflow-hidden bg-paper py-[clamp(88px,12vh,144px)]">
      <div className="shell grid-12 items-end gap-y-6">
        <div className="col-span-4 sm:col-span-8 lg:col-span-8">
          <p className="t-label text-ink">
            <span data-idx className="text-indigo-700">06.2 /</span> Amenities
          </p>
          <RevealLines id="amenities-title" lines={["Everything your", "business needs.", "*And more.*"]} className="t-xl mt-5 text-ink" />
        </div>
        <Reveal className="col-span-4 sm:col-span-8 lg:col-span-3 lg:col-start-10">
          <p className="t-body-l text-steel-700">Seven amenities, built into the logistics ecosystem.</p>
        </Reveal>
      </div>

      <Rail label="Amenities at Path Logicity" count={items.length} className="mt-12 lg:mt-14" trackClassName="gap-[clamp(14px,1.6vw,28px)]">
        {items.map((a, i) => (
          <li key={a.id} className="group w-[78vw] shrink-0 snap-start sm:w-[42vw] lg:w-[clamp(300px,25vw,400px)]">
            <article className="flex h-full flex-col bg-porcelain shadow-[var(--shadow-card)] transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:-translate-y-1.5">
              <div className="relative aspect-[4/3] overflow-hidden">
                {a.image?.src ? (
                  <>
                    <Image
                      src={a.image.src}
                      alt={a.image.alt}
                      fill
                      sizes="(min-width: 1024px) 25vw, 78vw"
                      draggable={false}
                      className="img-grade object-cover transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-[1.05]"
                    />
                    <span className="t-micro absolute bottom-3 left-3 max-w-[calc(100%-1.5rem)] bg-paper/90 px-2.5 py-1 text-steel-700">Illustrative{a.image.credit ? ` · ${a.image.credit}` : ""}</span>
                  </>
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-blue-50 to-paper">
                    {/* a route line crossing the tile: the brand device, quietly */}
                    <svg aria-hidden viewBox="0 0 100 75" className="absolute inset-0 h-full w-full" preserveAspectRatio="none" fill="none">
                      <path d="M -2 62 C 22 62, 30 30, 54 34 C 76 38, 82 12, 102 10" stroke="var(--color-indigo-700)" strokeOpacity="0.18" strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
                      <path d="M -2 70 C 28 70, 40 46, 64 50 C 84 53, 90 28, 102 24" stroke="var(--color-yellow-400)" strokeOpacity="0.55" strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="flex h-24 w-24 items-center justify-center bg-paper text-indigo-700 shadow-[var(--shadow-card)] transition-colors duration-300 group-hover:bg-indigo-700 group-hover:text-paper">
                        <Icon name={a.icon} size={44} strokeWidth={1.4} draw />
                      </span>
                    </div>
                  </div>
                )}
                <span aria-hidden className="t-micro tnum absolute left-3 top-3 bg-ink px-2.5 py-1 text-paper">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-6 lg:p-7">
                <div className="flex items-center gap-3">
                  {a.image?.src ? <Icon name={a.icon} size={22} className="shrink-0 text-indigo-700" /> : null}
                  <h3 className="t-s text-ink">{a.title}</h3>
                </div>
                <p className="mt-3 flex-1 text-[0.9375rem] leading-relaxed text-steel-700">{a.text}</p>
                <span aria-hidden className="mt-6 block h-[3px] w-10 bg-yellow-400 transition-[width] duration-500 ease-[var(--ease-out-expo)] group-hover:w-20" />
              </div>
            </article>
          </li>
        ))}
        <li aria-hidden className="w-px shrink-0 sm:w-[var(--margin)]" />
      </Rail>
    </section>
  );
}
