import type { IconName } from "@/lib/content/types";
import type { ReactNode, SVGProps } from "react";

/* Custom line set — 24px grid, 1.5px stroke, square caps. Every stroke carries
   pathLength=1 so icons can "draw" themselves (see .icon-draw in globals.css). */
const P = (d: string) => <path d={d} pathLength={1} />;
const C = (cx: number, cy: number, r: number) => <circle cx={cx} cy={cy} r={r} pathLength={1} />;

const ICONS: Record<IconName, ReactNode> = {
  road: <>{P("M5 21 9 3")}{P("M19 21 15 3")}{P("M12 5v2.5M12 10.75v2.5M12 16.5V19")}</>,
  rail: <>{P("M8.5 3 6 21")}{P("M15.5 3 18 21")}{P("M7.6 7.5h8.8M7 12h10M6.4 16.5h11.2")}</>,
  air: <>{P("M3 19C8 10 13.5 6.5 21 5")}{P("M16.5 2.8 21 5l-2.6 4.2")}{P("M3 19h3")}</>,
  port: <>{C(12, 4.75, 1.75)}{P("M12 6.5V21")}{P("M8 9.5h8")}{P("M5 13.5c0 4.1 3.1 7.5 7 7.5s7-3.4 7-7.5")}</>,
  warehouse: <>{P("M3 21V9l9-5 9 5v12")}{P("M7 21v-8h10v8")}{P("M7 17h10")}</>,
  container: <>{P("M3 7h18v11H3z")}{P("M7 9.5v6M11 9.5v6M15 9.5v6")}{P("M19 9.5v6")}</>,
  commercial: <>{P("M5 21V4h9v17")}{P("M14 9h5v12")}{P("M3 21h18")}{P("M8 8h3M8 12h3M8 16h3")}</>,
  yard: <>{P("M3 4h18v16H3z")}{P("M3 12h18")}{P("M9 4v16M15 4v16")}</>,
  green: <>{P("M12 21v-7")}{P("M12 14c-3.6 0-6-2.6-6-5.6C6 5.3 8.7 3 12 3s6 2.3 6 5.4c0 3-2.4 5.6-6 5.6Z")}{P("M9 21h6")}</>,
  crosshair: <>{C(12, 12, 7)}{C(12, 12, 1.5)}{P("M12 2v4M12 18v4M2 12h4M18 12h4")}</>,
  network: <>{P("M12 12 5.5 5.5M12 12l6.5-6.5M12 12l-6.5 6.5M12 12l6.5 6.5")}{C(12, 12, 2)}{C(4.5, 4.5, 1.5)}{C(19.5, 4.5, 1.5)}{C(4.5, 19.5, 1.5)}{C(19.5, 19.5, 1.5)}</>,
  legacy: <>{P("M3 19h18")}{P("M5 15h14")}{P("M7 11h10")}{P("M9 7h6")}{P("M12 3v1")}</>,
  scale: <>{P("M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5")}{P("M9 9h6v6H9z")}</>,
  solar: <>{P("M4 15 7 6h13l-3 9H4Z")}{P("M5.5 10.5h13M11 6l-2 9M16 6l-2 9")}{P("M10.5 15v4M7.5 21h6")}</>,
  rain: <>{P("M12 3s-6 6.8-6 11a6 6 0 0 0 12 0c0-4.2-6-11-6-11Z")}{P("M9 14.5a3 3 0 0 0 3 3")}</>,
  waste: <>{P("M6.4 8.2A7 7 0 0 1 18.6 9")}{P("M18.8 4v5h-5")}{P("M17.6 15.8A7 7 0 0 1 5.4 15")}{P("M5.2 20v-5h5")}</>,
  ev: <>{P("M9 3v5M15 3v5")}{P("M6 8h12v3a6 6 0 0 1-12 0V8Z")}{P("M12 17v4")}{P("M12.6 10 11 12.5h2L11.4 15")}</>,
  efficiency: <>{P("M4 17a8 8 0 1 1 16 0")}{P("M12 14.5 16 9")}{C(12, 15, 1.5)}{P("M4 20h16")}</>,
  truck: <>{P("M2 6h12v10H2z")}{P("M14 10h4l3 3v3h-7")}{C(6, 18, 2)}{C(17, 18, 2)}</>,
  food: <>{P("M5 8h11v4.5A5.5 5.5 0 0 1 10.5 18h0A5.5 5.5 0 0 1 5 12.5V8Z")}{P("M16 10h1.5a2 2 0 0 1 0 4H16")}{P("M8 3v2M11 3v2M14 3v2")}{P("M4 21h14")}</>,
  fuel: <>{P("M4 21V4h9v17")}{P("M3 21h11")}{P("M6.5 7h4v4h-4z")}{P("M13 9h3l3 3v6a1.5 1.5 0 0 1-3 0v-3h-3")}</>,
  wrench: <>{P("M14.7 4.2a5 5 0 0 0-4.4 6.6L4 17.1 6.9 20l6.3-6.3a5 5 0 0 0 6.6-4.4l-2.9 2.1-2.6-.9-.9-2.6 2.1-2.9Z")}</>,
  atm: <>{P("M3 6h18v12H3z")}{P("M3 10h18")}{P("M7 14.5h4")}</>,
  phone: <>{P("M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2")}</>,
  mail: <>{P("M3 5h18v14H3z")}{P("M3 6.5l9 6.5 9-6.5")}</>,
  whatsapp: <>{P("M3.5 20.5 5 16a8.5 8.5 0 1 1 3.1 3.1Z")}{P("M9 9c0 3.3 2.7 6 6 6")}</>,
  download: <>{P("M12 3v12")}{P("M7 10l5 5 5-5")}{P("M4 20h16")}</>,
  "arrow-right": <>{P("M4 12h15")}{P("M13.5 6.5 19 12l-5.5 5.5")}</>,
  "arrow-up": <>{P("M12 20V5")}{P("M6.5 10.5 12 5l5.5 5.5")}</>,
  play: <>{P("M7 4.5 19 12 7 19.5Z")}</>,
  pause: <>{P("M8.5 5v14M15.5 5v14")}</>,
  plus: <>{P("M12 4v16M4 12h16")}</>,
  expand: <>{P("M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5")}</>,
  check: <>{P("M4 12.5 9 17.5 20 6.5")}</>,
  linkedin: <>{P("M4 4h16v16H4z")}{P("M8 10.5V16M8 7.5v.5")}{P("M12 16v-5.5M12 13a2.5 2.5 0 0 1 5 0v3")}</>,
  youtube: <>{P("M3 8a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3Z")}{P("M10 9.2 15 12l-5 2.8Z")}</>,
  instagram: <>{P("M4 4h16v16H4z")}{C(12, 12, 3.75)}{P("M16.8 7.2h.01")}</>,
  x: <>{P("M4.5 4.5l15 15M19.5 4.5l-15 15")}</>,
};

type IconProps = Omit<SVGProps<SVGSVGElement>, "name"> & {
  name: IconName;
  size?: number;
  strokeWidth?: number;
  draw?: boolean;
  title?: string;
};

export function Icon({ name, size = 24, strokeWidth = 1.5, draw = false, title, className = "", ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      className={`${draw ? "icon-draw" : ""} ${className}`}
      {...rest}
    >
      {title ? <title>{title}</title> : null}
      {ICONS[name]}
    </svg>
  );
}
