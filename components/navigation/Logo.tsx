import Link from "next/link";
import Image from "next/image";

/**
 * Official Path Logicity logo: the brand pinwheel mark + wordmark, from the
 * client's own assets (public/client/). The wordmark is rendered paper-white on
 * dark surfaces and in full brand colour on light ones. Layout unchanged.
 */
export function Logo({ tone = "light", className = "" }: { tone?: "light" | "dark"; className?: string }) {
  const textSrc = tone === "light" ? "/client/logo-text-white.png" : "/client/logo-text.png";
  return (
    <Link href="/" aria-label="Path Logicity — home" className={`group inline-flex items-center gap-2.5 ${className}`} data-slot="logo">
      <Image src="/client/logo-mark.png" alt="" width={1120} height={1293} priority className="h-9 w-auto shrink-0" sizes="40px" />
      <Image src={textSrc} alt="Path Logicity" width={218} height={84} priority className="h-[26px] w-auto" sizes="110px" />
    </Link>
  );
}
