import Link from "next/link";
import type { NavItem, SiteSettings } from "@/lib/content/types";
import { Icon } from "@/components/ui/Icon";
import { ContentSlot } from "@/components/ui/ContentSlot";
import { Logo } from "@/components/navigation/Logo";
import { Route } from "@/components/ui/Route";

/** The conclusion of the story — the route resolves onto the wordmark. */
export function Footer({ navigation, settings }: { navigation: NavItem[]; settings: SiteSettings }) {
  const groups = navigation.filter((n) => n.children);
  const simple = navigation.filter((n) => !n.children && n.href !== "/");

  return (
    <footer className="relative overflow-hidden bg-navy-950 pt-20 lg:pt-28">
      <div className="shell grid-12 gap-y-12">
        <div className="col-span-4 sm:col-span-8 lg:col-span-3">
          <Logo />
          <p className="t-micro mt-8 text-steel-300">India&apos;s largest multimodal logistics hub</p>
          <p className="t-micro mt-2 text-steel-500">Dobbaspet · Bengaluru</p>
        </div>

        <nav aria-label="Footer" className="col-span-4 grid grid-cols-2 gap-x-8 gap-y-10 sm:col-span-8 sm:grid-cols-4 lg:col-span-6">
          <div>
            <p className="t-micro text-steel-500">Navigate</p>
            <ul className="mt-5 space-y-3">
              <li>
                <Link href="/" className="text-sm text-paper/80 transition-colors hover:text-paper">
                  Home
                </Link>
              </li>
              {simple.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="text-sm text-paper/80 transition-colors hover:text-paper">
                    {n.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="#enquire" className="text-sm text-paper/80 transition-colors hover:text-paper">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          {groups.map((g) => (
            <div key={g.label}>
              <p className="t-micro text-steel-500">{g.label}</p>
              <ul className="mt-5 space-y-3">
                {g.children!.map((c) => (
                  <li key={c.href}>
                    <Link href={c.href} className="text-sm text-paper/80 transition-colors hover:text-paper">
                      {c.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="col-span-4 sm:col-span-8 lg:col-span-3">
          <p className="t-micro text-steel-500">Leasing contact</p>
          <div className="mt-5 space-y-2 text-sm text-paper/80">
            <p>{settings.leasingName ?? <ContentSlot>Leasing contact name</ContentSlot>}</p>
            <p>{settings.phone ? <a href={`tel:${settings.phone}`}>{settings.phone}</a> : <ContentSlot>Phone</ContentSlot>}</p>
            <p>{settings.email ? <a href={`mailto:${settings.email}`}>{settings.email}</a> : <ContentSlot>Email</ContentSlot>}</p>
          </div>
          <Link
            href="#enquire"
            className="group mt-8 inline-flex h-12 items-center gap-3 border border-yellow-400/70 px-5 text-[12.5px] font-semibold uppercase tracking-[0.07em] text-yellow-400 transition-colors hover:bg-yellow-400 hover:text-navy-950"
          >
            Enquire now <Icon name="arrow-right" size={16} className="arrow-nudge" />
          </Link>
          <div className="mt-6 flex gap-2">
            {settings.socials.map((s) =>
              s.href ? (
                <a key={s.label} href={s.href} aria-label={s.label} className="flex h-10 w-10 items-center justify-center border border-white/15 hover:border-paper">
                  <Icon name={s.icon} size={16} />
                </a>
              ) : (
                <span key={s.label} role="img" aria-label={`${s.label} (link to be supplied)`} className="flex h-10 w-10 items-center justify-center border border-white/10 text-paper/40">
                  <Icon name={s.icon} size={16} />
                </span>
              ),
            )}
          </div>
        </div>
      </div>

      {/* Final route → wordmark */}
      <div className="relative mt-20 lg:mt-28">
        <div className="relative h-16">
          <Route d="M 0 50 C 30 50, 40 50, 60 50 L 96 50" auto="enter" base />
        </div>
        <p
          aria-hidden
          className="select-none whitespace-nowrap px-[var(--margin)] font-display text-[15.2vw] font-extrabold uppercase leading-[0.78] tracking-[-0.06em] text-paper/[0.06] [margin-bottom:-0.12em]"
        >
          Path Logicity
        </p>
      </div>

      <div className="relative border-t border-white/10">
        <div className="shell flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="t-micro text-steel-500">
            © {new Date().getFullYear()} PATH · <ContentSlot>Privacy</ContentSlot> · <ContentSlot>Terms</ContentSlot>
          </p>
          <a href="#main" className="group t-micro flex items-center gap-2 text-steel-300 hover:text-paper">
            Back to top <Icon name="arrow-up" size={14} />
          </a>
        </div>
      </div>
    </footer>
  );
}
