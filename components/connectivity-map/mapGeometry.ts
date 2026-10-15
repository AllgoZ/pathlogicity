/**
 * Connectivity overlay drawn on the CLIENT'S OWN location map
 * (public/client/345.webp, from pathlogicity.com). All coordinates are in that
 * image's pixel space (1320 × 1232) so routes sit on the roads the map shows.
 * Routes are schematic traces of those roads — not survey-accurate.
 */
import type { Mode } from "@/lib/content/types";

export const MAP = { src: "/client/345.webp", w: 1320, h: 1232 } as const;

export type Level = "map" | "site";

/** Camera viewBoxes (same aspect as the image) */
export const VIEWS: Record<Level, [number, number, number, number]> = {
  map: [0, 0, MAP.w, MAP.h],
  site: [300, 170, 420, 392],
};

type Pt = [number, number];

/** Catmull-Rom → cubic Bézier, so hand-placed road points read as smooth roads. */
function smooth(pts: Pt[]) {
  if (pts.length < 3) return `M ${pts.map((p) => p.join(" ")).join(" L ")}`;
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1: Pt = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2: Pt = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C ${c1[0].toFixed(1)} ${c1[1].toFixed(1)}, ${c2[0].toFixed(1)} ${c2[1].toFixed(1)}, ${p2[0]} ${p2[1]}`;
  }
  return d;
}

/** The Path Logicity parcel (blue/green shape under the logo pin) */
export const SITE = { x: 492, y: 345 };
/** Where the site meets the STRR / NH 648 ring */
const GATE: Pt = [474, 290];

/* Road points traced from the map, starting at the site */
const RING_EAST: Pt[] = [[SITE.x, SITE.y], GATE, [540, 254], [600, 233], [700, 222], [785, 222], [870, 222], [925, 248], [985, 280], [1015, 298]];
const RING_WEST: Pt[] = [[SITE.x, SITE.y], GATE, [430, 298], [380, 322], [342, 346], [318, 372], [300, 430], [299, 500], [285, 575], [270, 632], [259, 720], [262, 810], [262, 910], [268, 1040], [296, 1150], [318, 1225]];

export type RouteGeom = {
  d: string;
  mode: Mode;
  /** destination point (pin + callout) */
  end: { x: number; y: number };
  /** callout anchor relative to the end point */
  side?: "left" | "right";
  /** true = destination lies beyond the map edge (arrow + "off map" callout) */
  offMap?: boolean;
};

export const ROUTES: Record<string, RouteGeom> = {
  nh648: { d: smooth(RING_EAST), mode: "road", end: { x: 1015, y: 298 }, side: "left" },
  strr: { d: smooth(RING_WEST), mode: "road", end: { x: 262, y: 910 }, side: "right" },
  nh48: {
    d: smooth([[SITE.x, SITE.y], [515, 410], [540, 470], [562, 545], [610, 600], [660, 645], [700, 676]]),
    mode: "road",
    end: { x: 700, y: 676 },
    side: "right",
  },
  dodbele: { d: smooth([[SITE.x, SITE.y], [512, 382], [538, 410]]), mode: "rail", end: { x: 538, y: 410 }, side: "right" },
  sidings: {
    // six short parallel sidings across the parcel
    d: Array.from({ length: 6 })
      .map((_, k) => `M ${470 + k * 3} ${330 + k * 9} L ${524 + k * 3} ${372 + k * 9}`)
      .join(" "),
    mode: "rail",
    end: { x: 500, y: 352 },
    side: "right",
  },
  kia: { d: smooth([...RING_EAST.slice(0, 8), [932, 300], [917, 374]]), mode: "air", end: { x: 917, y: 374 }, side: "left" },
  mangalore: { d: smooth([...RING_WEST.slice(0, 6), [250, 392], [150, 410], [60, 425], [6, 432]]), mode: "port", end: { x: 6, y: 432 }, side: "right", offMap: true },
  chennai: {
    d: smooth([...RING_EAST, [1040, 330], [1120, 372], [1199, 398], [1260, 410], [1314, 418]]),
    mode: "port",
    end: { x: 1314, y: 418 },
    side: "left",
    offMap: true,
  },
};
