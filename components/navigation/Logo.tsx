import Link from "next/link";
import Image from "next/image";

/**
 * Official Path Logicity logo: the brand pinwheel mark + wordmark, from the
 * client's own assets (public/client/). `tone` is the TEXT colour: "dark" =
 * full-colour wordmark for light surfaces (default), "light" = white wordmark
 * for the indigo footer / photography.
 */
export function Logo({ tone = "dark", className = "" }: { tone?: "light" | "dark"; className?: string }) {
  const textSrc = tone === "light" ? "/client/logo-text-white.png" : "/client/logo-text.png";
  return (
    <Link href="/" aria-label="Path Logicity — home" className={`group inline-flex items-center gap-2.5 ${className}`} data-slot="logo">
      <Image src="/client/logo-mark.png" alt="" width={1120} height={1293} priority className="h-10 w-auto shrink-0" sizes="44px" />
      <Image src={textSrc} alt="Path Logicity" width={218} height={84} priority className="h-[30px] w-auto" sizes="110px" />
    </Link>
  );
}
