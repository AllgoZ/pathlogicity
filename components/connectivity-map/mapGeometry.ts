/**
 * SCHEMATIC connectivity diagram — relative positions only, NOT TO SCALE and
 * not survey-accurate. No national boundary is drawn (Survey of India
 * compliance). World space: 0–1000 × 0–1000.
 */
import type { Mode } from "@/lib/content/types";

export type Level = "site" | "region" | "india";

export const VIEWS: Record<Level, [number, number, number, number]> = {
  site: [394, 444, 116, 72.5],
  region: [285, 362, 430, 268.75],
  india: [40, 218, 960, 600],
};

export const SITE = { x: 452, y: 478 };

export type RouteGeom = { d: string; mode: Mode; label?: { text: string; x: number; y: number; levels: Level[]; anchor?: "start" | "middle" | "end" } };

export const ROUTES: Record<string, RouteGeom> = {
  nh48: {
    d: "M 300 385 C 360 420, 410 450, 452 478 C 485 500, 515 527, 548 548 C 590 575, 640 610, 720 660",
    mode: "road",
    label: { text: "NH 48", x: 392, y: 456, levels: ["region"], anchor: "end" },
  },
  nh648: {
    d: "M 452 478 C 490 440, 540 418, 600 422 C 650 426, 690 446, 720 468",
    mode: "road",
    label: { text: "NH 648", x: 655, y: 410, levels: ["region"], anchor: "middle" },
  },
  strr: {
    d: "M 673 548 A 125 109 0 1 1 423 548 A 125 109 0 1 1 673 548",
    mode: "road",
    label: { text: "STRR", x: 680, y: 560, levels: ["region"], anchor: "start" },
  },
  kia: { d: "M 452 478 Q 520 402 600 452", mode: "air" },
  mangalore: { d: "M 452 478 C 380 470, 300 520, 230 530 C 180 538, 140 545, 112 545", mode: "port" },
  chennai: { d: "M 452 478 C 560 500, 700 600, 820 580 C 870 572, 900 565, 928 560", mode: "port" },
  sidings: {
    d: Array.from({ length: 6 })
      .map((_, k) => `M 433 ${470.5 + k * 2.1} L 471 ${469.5 + k * 2.1}`)
      .join(" "),
    mode: "rail",
  },
};

export type Place = { id: string; text: string; sub?: string; x: number; y: number; levels: Level[]; kind: "site" | "city" | "airport" | "port" | "label"; anchor?: "start" | "middle" | "end"; dx?: number; dy?: number };

export const PLACES: Place[] = [
  { id: "site", text: "Path Logicity", sub: "Dobbaspet", x: SITE.x, y: SITE.y, levels: ["region", "india"], kind: "site", anchor: "end", dx: -14, dy: -12 },
  { id: "site-label", text: "Path Logicity · rail terminal", x: 427, y: 461, levels: ["site"], kind: "label", anchor: "start", dx: 0, dy: -6 },
  { id: "blr", text: "Bengaluru", x: 548, y: 548, levels: ["region", "india"], kind: "city", anchor: "start", dx: 10, dy: 4 },
  { id: "kia", text: "Kempegowda Int'l Airport", x: 600, y: 452, levels: ["region"], kind: "airport", anchor: "start", dx: 12, dy: -6 },
  { id: "mangalore", text: "Mangalore Port", x: 112, y: 545, levels: ["india"], kind: "port", anchor: "start", dx: 0, dy: 22 },
  { id: "chennai", text: "Chennai Port", x: 928, y: 560, levels: ["india"], kind: "port", anchor: "end", dx: 0, dy: 22 },
];

/** Main rail line drawn past the site at SITE level (schematic) */
export const RAIL_MAIN = "M 360 472 L 560 467";
export const SITE_OUTLINE = "M 428 465 L 478 463 L 480 492 L 426 494 Z";
