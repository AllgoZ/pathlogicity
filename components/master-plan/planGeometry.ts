/**
 * ILLUSTRATIVE SCHEMATIC — NOT THE REAL MASTER PLAN.
 * Placeholder geometry until the client's CAD/vector master plan is supplied
 * and traced (one path per zone + roads layer + Phase 1 boundary).
 * viewBox 0 0 1000 640
 */
export const PLAN_W = 1000;
export const PLAN_H = 640;
export const GATE = { x: 632, y: 600 };

export const boundary = "M 60 92 L 940 70 L 962 300 L 905 562 L 520 602 L 118 572 L 38 330 Z";

const rect = (x: number, y: number, w: number, h: number) => `M ${x} ${y} h ${w} v ${h} h ${-w} Z`;

const warehouseBlocks: [number, number, number, number][] = [];
for (const y of [194, 298, 402]) for (const x of [122, 290, 458]) warehouseBlocks.push([x, y, 150, 76]);

export type ZoneGeom = {
  id: string;
  d: string;
  anchor: { x: number; y: number };
  route: string;
  grid: string;
  detail?: string;
};

export const zoneGeom: Record<string, ZoneGeom> = {
  warehousing: {
    id: "warehousing",
    d: warehouseBlocks.map(([x, y, w, h]) => rect(x, y, w, h)).join(" "),
    detail: warehouseBlocks.map(([x, y, w, h]) => `M ${x + 8} ${y + h / 2} H ${x + w - 8}`).join(" "),
    anchor: { x: 365, y: 336 },
    route: "M 632 600 L 632 388 L 365 388",
    grid: "C–E / 3–5",
  },
  rail: {
    id: "rail",
    d: "M 92 104 L 922 86 L 925 150 L 95 166 Z",
    detail: Array.from({ length: 6 })
      .map((_, k) => `M 128 ${118 + k * 7.6} L 892 ${101 + k * 7.6}`)
      .join(" "),
    anchor: { x: 510, y: 128 },
    route: "M 632 600 L 632 174 L 510 176",
    grid: "A–J / 1–2",
  },
  icd: {
    id: "icd",
    d: "M 652 188 L 926 182 L 934 304 L 660 308 Z",
    detail: [0, 1, 2, 3]
      .flatMap((r) => [0, 1, 2, 3, 4, 5].map((c) => rect(676 + c * 40, 202 + r * 25, 32, 14)))
      .join(" "),
    anchor: { x: 795, y: 245 },
    route: "M 632 600 L 632 316 L 795 313",
    grid: "G–J / 2–3",
  },
  yards: {
    id: "yards",
    d: "M 660 330 L 936 322 L 918 420 L 660 428 Z",
    detail: Array.from({ length: 12 })
      .map((_, k) => `M ${680 + k * 20} 410 L ${694 + k * 20} 342`)
      .join(" "),
    anchor: { x: 795, y: 375 },
    route: "M 632 600 L 632 438 L 795 436",
    grid: "G–J / 4–5",
  },
  commercial: {
    id: "commercial",
    d: "M 660 452 L 912 444 L 900 548 L 660 572 Z",
    detail: [rect(680, 466, 64, 40), rect(756, 464, 54, 74), rect(822, 462, 62, 34), rect(680, 516, 64, 40)].join(" "),
    anchor: { x: 780, y: 505 },
    route: "M 632 600 L 632 522 L 780 518",
    grid: "G–I / 5–6",
  },
  green: {
    id: "green",
    d: "M 122 502 L 608 502 L 608 560 L 520 590 L 132 562 Z M 48 196 L 100 192 L 112 478 L 84 478 L 44 330 Z",
    detail: Array.from({ length: 18 })
      .map((_, k) => `M ${150 + k * 25} ${528 + (k % 2) * 12} m -3 0 a 3 3 0 1 0 6 0 a 3 3 0 1 0 -6 0`)
      .join(" "),
    anchor: { x: 365, y: 530 },
    route: "M 632 600 L 632 492 L 365 492",
    grid: "A–F / 5–7",
  },
  roads: {
    id: "roads",
    d: "M 632 600 L 632 172 M 104 178 L 930 168 M 106 286 L 632 284 M 106 390 L 632 388 M 110 492 L 632 490 M 632 316 L 936 310 M 632 438 L 930 434 M 420 640 C 520 612, 560 600, 632 600",
    anchor: { x: 632, y: 400 },
    route: "M 632 600 L 632 172",
    grid: "Network",
  },
};

export const ZONE_ORDER = ["warehousing", "rail", "icd", "commercial", "yards", "roads", "green"];
