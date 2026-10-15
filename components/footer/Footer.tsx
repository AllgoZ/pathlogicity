import Image from "next/image";
import Link from "next/link";
import { getPartners, telHref } from "@/lib/content";
import type { NavItem, SiteSettings } from "@/lib/content/types";
import { Icon } from "@/components/ui/Icon";
import { ContentSlot } from "@/components/ui/ContentSlot";
import { PartnerLogos } from "@/components/ui/PartnerLogos";
import { Route } from "@/components/ui/Route";

/** The conclusion of the story — brand indigo, as on pathlogicity.com. The route resolves onto the wordmark. */
export function Footer({ navigation, settings }: { navigation: NavItem[]; settings: SiteSettings }) {
  const groups = navigation.filter((n) => n.children);
  const simple = navigation.filter((n) => !n.children && n.href !== "/");
  const link = "text-[0.9375rem] text-paper/80 transition-colors hover:text-paper";

  return (
    <footer className="on-dark relative overflow-hidden bg-indigo-700 pt-16 text-paper lg:pt-24">
      <div className="shell grid-12 gap-y-12">
        <div className="col-span-4 sm:col-span-8 lg:col-span-3">
          <Link href="/" aria-label="Path Logicity — home" className="inline-block">
            {/* The client's own footer lockup (white on brand indigo) */}
            <Image src="/client/logo-lockup-indigo.webp" alt="Path Logicity Bengaluru" width={256} height={91} className="h-14 w-auto" sizes="160px" />
          </Link>
          <p className="mt-6 text-[0.9375rem] text-paper/85">India&apos;s largest multimodal logistics hub</p>
          <p className="t-micro mt-2 text-paper/60">Dobbaspet · Bengaluru</p>
        </div>

        <nav aria-label="Footer" className="col-span-4 grid grid-cols-2 gap-x-8 gap-y-10 sm:col-span-8 sm:grid-cols-4 lg:col-span-6">
          <div>
            <p className="t-micro text-yellow-400">Navigate</p>
            <ul className="mt-5 space-y-3">
              <li>
                <Link href="/" className={link}>
                  Home
                </Link>
              </li>
              {simple.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className={link}>
                    {n.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="#enquire" className={link}>
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          {groups.map((g) => (
            <div key={g.label}>
              <p className="t-micro text-yellow-400">{g.label}</p>
              <ul className="mt-5 space-y-3">
                {g.children!.map((c) => (
                  <li key={c.href}>
                    <Link href={c.href} className={link}>
                      {c.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="col-span-4 sm:col-span-8 lg:col-span-3">
          <p className="t-micro text-yellow-400">Contact</p>
          <div className="mt-5 space-y-2 text-[0.9375rem] text-paper/85">
            {settings.leasingName ? <p>{settings.leasingName}</p> : null}
            <p>{settings.phone ? <a href={telHref(settings.phone)} className="hover:text-paper">{settings.phone}</a> : <ContentSlot tone="dark">Phone</ContentSlot>}</p>
            <p>{settings.email ? <a href={`mailto:${settings.email}`} className="hover:text-paper">{settings.email}</a> : <ContentSlot tone="dark">Email</ContentSlot>}</p>
            {settings.address ? (
              <address className="pt-2 not-italic leading-relaxed text-paper/70">
                {settings.address.map((l) => (
                  <span key={l} className="block">
                    {l}
                  </span>
                ))}
              </address>
            ) : null}
          </div>
          <Link
            href="#enquire"
            className="group mt-7 inline-flex h-12 items-center gap-3 bg-yellow-400 px-5 text-[0.8125rem] font-bold uppercase tracking-[0.05em] text-ink transition-colors hover:bg-paper"
          >
            Enquire now <Icon name="arrow-right" size={16} className="arrow-nudge" />
          </Link>
          <div className="mt-6 flex gap-2">
            {settings.socials.map((s) =>
              s.href ? (
                <a key={s.label} href={s.href} aria-label={s.label} target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center border border-paper/25 transition-colors hover:border-paper hover:bg-paper hover:text-indigo-700">
                  <Icon name={s.icon} size={16} />
                </a>
              ) : (
                <span key={s.label} role="img" aria-label={`${s.label} (link to be supplied)`} className="flex h-10 w-10 items-center justify-center border border-paper/15 text-paper/40">
                  <Icon name={s.icon} size={16} />
                </span>
              ),
            )}
          </div>
        </div>
      </div>

      {/* Authorities + certification */}
      <div className="shell mt-14 lg:mt-16">
        <p className="t-micro text-paper/60">In association with</p>
        <PartnerLogos partners={getPartners()} compact tone="dark" className="mt-4" />
      </div>

      {/* Final route → wordmark */}
      <div className="relative mt-14 lg:mt-20">
        <div className="relative h-16">
          <Route d="M 0 50 C 30 50, 40 50, 60 50 L 96 50" auto="enter" base tone="dark" />
        </div>
        <p
          aria-hidden
          className="select-none whitespace-nowrap px-[var(--margin)] font-display text-[13vw] font-extrabold leading-[0.8] tracking-[-0.04em] text-paper/[0.07] [margin-bottom:-0.1em]"
        >
          Path Logicity
        </p>
      </div>

      <div className="relative border-t border-paper/15">
        <div className="shell flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="t-micro text-paper/60">
            © {new Date().getFullYear()} PATH India Ltd. · <ContentSlot tone="dark">Privacy</ContentSlot> · <ContentSlot tone="dark">Terms</ContentSlot>
          </p>
          <a href="#main" className="group t-micro flex items-center gap-2 text-paper/75 hover:text-paper">
            Back to top <Icon name="arrow-up" size={14} />
          </a>
        </div>
      </div>
    </footer>
  );
}
