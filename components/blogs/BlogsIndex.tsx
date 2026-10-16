import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "@/lib/content/types";
import { ArrowLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

/**
 * Blogs — featured story + supporting articles (category, date, reading time).
 * CMS-ready and honest: with no published posts it shows a designed empty state, never filler.
 */
export function BlogsIndex({ posts }: { posts: BlogPost[] }) {
  const [featured, ...rest] = posts;

  if (!featured) {
    return (
      <section aria-labelledby="blogs-title" className="relative bg-porcelain section-pad">
        <div className="shell grid-12 items-center gap-y-10">
          <div className="col-span-4 sm:col-span-8 lg:col-span-7">
            <h2 id="blogs-title" className="t-l text-ink">
              Our first stories are on their way.
            </h2>
            <p className="t-body-l mt-5 max-w-[46ch] text-steel-700">Articles, insights and updates will be published here. In the meantime, follow the project as it takes shape.</p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:gap-8">
              <ArrowLink href="/news">Project news and updates</ArrowLink>
              <ArrowLink href="/#status">Follow project status</ArrowLink>
            </div>
          </div>
          <div className="col-span-4 sm:col-span-8 lg:col-span-4 lg:col-start-9" aria-hidden>
            <div className="relative aspect-[4/5] border border-ink/10 bg-paper shadow-[var(--shadow-card)]">
              <div className="absolute inset-6 flex flex-col justify-between">
                <span className="h-[3px] w-12 bg-yellow-400" />
                <div className="space-y-3">
                  <span className="block h-3 w-4/5 bg-ink/10" />
                  <span className="block h-3 w-3/5 bg-ink/10" />
                  <span className="block h-3 w-2/3 bg-ink/10" />
                </div>
                <Icon name="legacy" size={40} className="text-indigo-700/40" />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section aria-labelledby="blogs-title" className="relative bg-porcelain section-pad">
      <div className="shell">
        <h2 id="blogs-title" className="sr-only">
          Articles
        </h2>
        <div className="grid-12 gap-y-12">
          <article className={`group col-span-4 sm:col-span-8 ${rest.length ? "lg:col-span-7" : "lg:col-span-12"}`}>
            <Link href={featured.href}>
              <div className="relative aspect-[16/10] overflow-hidden bg-paper-3">
                {featured.image.src ? (
                  <Image src={featured.image.src} alt={featured.image.alt} fill sizes="(min-width: 1024px) 55vw, 100vw" className="img-grade object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.03]" />
                ) : null}
              </div>
              <Meta post={featured} />
              <h3 className="t-m mt-3 max-w-[24ch] text-ink">{featured.title}</h3>
              <p className="mt-3 max-w-[52ch] text-steel-700">{featured.excerpt}</p>
            </Link>
          </article>
          {rest.length ? (
            <ul className="col-span-4 sm:col-span-8 lg:col-span-5">
              {rest.map((p) => (
                <li key={p.id} className="group border-b border-ink/15 py-6 first:border-t first:pt-6 lg:first:border-t-0 lg:first:pt-0">
                  <Link href={p.href} className="block">
                    <Meta post={p} />
                    <p className="t-s mt-2 max-w-[30ch] text-ink">{p.title}</p>
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function Meta({ post }: { post: BlogPost }) {
  return (
    <p className="t-micro mt-5 flex flex-wrap gap-x-3 text-indigo-700">
      <span>{post.category}</span>
      <span aria-hidden>·</span>
      <span>{post.date}</span>
      {post.readMinutes ? (
        <>
          <span aria-hidden>·</span>
          <span>{post.readMinutes} min read</span>
        </>
      ) : null}
    </p>
  );
}
