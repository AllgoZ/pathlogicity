import Image from "next/image";
import type { Vertical } from "@/lib/content/types";
import { Icon } from "@/components/ui/Icon";
import { Reveal, RevealLines } from "@/components/ui/Reveal";

/**
 * PATH Legacy — the group's verticals (client round 5: "showcase the different verticals of PATH Group,
 * including Wayside Amenities, the sporting venture, Drone Manufacturing"). Content: pathltd.com → Verticals.
 * Path Logicity itself is marked, so the page still reads as "this is where you are".
 */
export function PathVerticals({ items }: { items: Vertical[] }) {
  return (
    <div id="verticals" aria-labelledby="verticals-title">
      <div className="grid-12 items-end gap-y-6">
        <div className="col-span-4 sm:col-span-8 lg:col-span-7">
          <p className="t-label text-indigo-700">PATH Legacy</p>
          <RevealLines id="verticals-title" lines={["One group,", "*many verticals*"]} className="t-xl mt-4 text-ink" />
        </div>
        <p className="t-body-l col-span-4 max-w-[44ch] text-steel-700 sm:col-span-8 lg:col-span-4 lg:col-start-9">
          From highways and toll corridors to wayside amenities, drones, sport and logistics parks, three decades of building have grown into a group of businesses.
        </p>
      </div>

      <Reveal as="ul" stagger={0.07} className="mt-12 grid grid-cols-1 gap-x-[var(--gutter)] gap-y-10 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4">
        {items.map((v, i) => {
          const here = v.id === "logicity";
          const body = (
            <>
              <div className="relative aspect-[4/3] overflow-hidden bg-paper-2">
                <Image
                  src={v.image.src as string}
                  alt={v.image.alt}
                  fill
                  sizes="(min-width: 1024px) 24vw, (min-width: 640px) 46vw, 92vw"
                  className="img-grade object-cover transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-[1.05]"
                  style={{ objectPosition: "center 55%" }}
                />
                <span aria-hidden className="t-micro tnum absolute left-3 top-3 bg-ink px-2.5 py-1 text-paper">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {here ? <span className="t-micro absolute right-3 top-3 bg-yellow-400 px-2.5 py-1 text-ink">You are here</span> : null}
              </div>
              <div className="flex flex-1 flex-col pt-5">
                <p className="t-micro text-indigo-700">{v.brand}</p>
                <h3 className="t-m mt-1.5 text-ink">{v.title}</h3>
                <p className="mt-3 flex-1 text-[0.9375rem] leading-relaxed text-steel-700">{v.text}</p>
                <span aria-hidden className="mt-5 block h-[3px] w-10 bg-yellow-400 transition-[width] duration-500 ease-[var(--ease-out-expo)] group-hover:w-20" />
                {v.href ? (
                  <span className="t-micro mt-4 inline-flex items-center gap-2 text-indigo-700">
                    Visit pathltd.com
                    <Icon name="arrow-right" size={14} className="arrow-nudge" />
                  </span>
                ) : null}
              </div>
            </>
          );
          return (
            <li key={v.id} className="group flex">
              {v.href ? (
                <a
                  href={v.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${v.title} (${v.brand}) — opens pathltd.com in a new tab`}
                  className="flex w-full flex-col transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:-translate-y-1.5"
                >
                  {body}
                </a>
              ) : (
                <article className="flex w-full flex-col">{body}</article>
              )}
            </li>
          );
        })}
      </Reveal>
    </div>
  );
}
