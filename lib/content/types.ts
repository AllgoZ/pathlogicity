/**
 * Content models — these mirror the future CMS schema (docs/UI-PLAN.md §10).
 * Every optional *fact* is nullable: the UI renders a ContentSlot or hides the
 * element when it is null, so an unverified value can never appear by accident.
 */

export type IconName =
  | "road"
  | "rail"
  | "air"
  | "port"
  | "warehouse"
  | "container"
  | "commercial"
  | "yard"
  | "green"
  | "crosshair"
  | "network"
  | "legacy"
  | "scale"
  | "solar"
  | "rain"
  | "waste"
  | "ev"
  | "efficiency"
  | "truck"
  | "food"
  | "fuel"
  | "wrench"
  | "atm"
  | "phone"
  | "mail"
  | "whatsapp"
  | "download"
  | "arrow-right"
  | "arrow-up"
  | "play"
  | "pause"
  | "plus"
  | "expand"
  | "linkedin"
  | "youtube"
  | "instagram"
  | "x"
  | "check";

export type Mode = "road" | "rail" | "air" | "port";

export interface NavChild {
  label: string;
  href: string;
  note?: string;
}
export interface NavItem {
  label: string;
  href: string;
  children?: NavChild[];
}

export interface MediaAsset {
  /** e.g. "PROJECT VIDEO", "SITE AERIAL" — shown on the placeholder slot */
  slot: string;
  /** Asset spec shown on the placeholder so the client knows what to supply */
  spec: string;
  /** Image, or an .mp4/.webm video (e.g. a Constra timelapse) where the component supports it */
  src?: string | null;
  poster?: string | null;
  alt: string;
  /** Source/credit line shown on the frame, e.g. "Constra site capture · 12 Oct 2026" */
  credit?: string | null;
}

export interface MetricData {
  prefix?: string; // "~"
  value: number;
  decimals?: number;
  suffix?: string; // "+"
  unit?: string; // "MN SQ. FT."
  label: string;
}

export interface ScaleNode {
  id: string;
  icon: IconName;
  label: string;
  text: string;
  href: string;
  /** hover preview image (desktop) */
  image?: string;
}

export interface Zone {
  id: string;
  index: string;
  name: string;
  short: string;
  facts: string[];
  /** Copy still to be supplied by the client */
  pending?: string;
  media: MediaAsset;
}

export type MilestoneStatus = "completed" | "in-progress" | "upcoming";
export interface Milestone {
  id: string;
  status: MilestoneStatus;
  phase: string | null;
  title: string | null;
  date: string | null;
  media: MediaAsset;
}

export interface Destination {
  id: string;
  name: string;
  subtitle?: string;
  mode: Mode;
  kind: "corridor" | "destination" | "onsite";
  level: "site" | "region" | "india";
  distanceKm: number | null;
  durationText: string | null;
  note: string | null;
}

export interface Initiative {
  id: string;
  icon: IconName;
  name: string;
  text: string | null;
  metric: MetricData | null;
}

export interface Benefit {
  id: "tat" | "cost" | "connectivity" | "efficiency" | "scalability";
  title: string;
  text: string;
}

export type NewsType = "news" | "media" | "update" | "event";
export interface NewsItem {
  id: string;
  type: NewsType;
  source: string | null;
  date: string | null;
  headline: string | null;
  href: string | null;
  image: MediaAsset;
  /** true = CMS demo placeholder, never a real article */
  placeholder: boolean;
}

export interface SiteSettings {
  leasingName: string | null;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  brochureUrl: string | null;
  /** Only rendered when verified — never fabricated */
  coordinates: { lat: number; lng: number } | null;
  /** Registered office lines, as published by the client */
  address: string[] | null;
  socials: { label: string; icon: IconName; href: string | null }[];
}

export interface Partner {
  id: string;
  name: string;
  role: string;
  logo: string;
  width: number;
  height: number;
}

/** A blog article. CMS-ready: the site never invents posts, so an empty list renders the designed empty state. */
export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readMinutes: number | null;
  href: string;
  image: MediaAsset;
}

/** An amenity panel (Concept Note: Logicity Advantage → Amenities). `image` stays null until a real site photograph is supplied. */
export interface Amenity {
  id: string;
  icon: IconName;
  title: string;
  text: string;
  image: MediaAsset | null;
}

/** One business vertical of PATH Group (pathltd.com → Verticals). `href` is the vertical's own site, when it has one. */
export interface Vertical {
  id: string;
  /** the group brand, e.g. "PATH Recharge" */
  brand: string;
  /** what it does, e.g. "Wayside Amenities" */
  title: string;
  text: string;
  image: MediaAsset;
  href: string | null;
}

export type SpaceStatus = "leased" | "available" | "reserved";
/** A leasable building or block in the park, as held in Constra. */
export interface SpaceUnit {
  id: string;
  name: string;
  areaSqFt: number | null;
  status: SpaceStatus;
}
/**
 * Leased / available space, linked to Constra. Every figure is null until the client supplies it (or the
 * Constra feed is connected); the UI then shows a designed enquiry fallback instead of numbers.
 */
export interface Leasing {
  totalSqFt: number | null;
  leasedSqFt: number | null;
  availableSqFt: number | null;
  units: SpaceUnit[];
  updatedAt: string | null;
}
/** A Constra collateral (dashboard, timelapse, drone capture, report). `href` stays null until the link is supplied. */
export interface ConstraLink {
  id: string;
  label: string;
  text: string;
  href: string | null;
}

/** A card in the renders gallery */
export interface GalleryItem {
  id: string;
  title: string;
  caption: string;
  media: MediaAsset;
  /** "contain" for drawings (e.g. the master plan) shown whole on a white card */
  fit?: "cover" | "contain";
}
