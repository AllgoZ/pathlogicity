/**
 * Seed content — every fact below comes from the client concept note
 * (reference/Concept Note for Path Logicity.pdf) or the client's live site
 * (pathlogicity.com, re-crawled 2026-10-15). Anything not supplied is
 * null / placeholder and renders as a labelled slot. Do not add facts here
 * without a client source.
 */
import type {
  Benefit,
  Destination,
  GalleryItem,
  Initiative,
  MediaAsset,
  MetricData,
  Milestone,
  NavItem,
  NewsItem,
  Partner,
  ScaleNode,
  SiteSettings,
  Zone,
} from "@/lib/content/types";

/** Contact + socials as published on pathlogicity.com (Contact section / footer). */
export const settings: SiteSettings = {
  leasingName: null,
  phone: "+91 98998 80388",
  whatsapp: null,
  email: "mmlp.blr@pathltd.com",
  brochureUrl: null,
  coordinates: null,
  address: ["76, Mall Road, Mhow", "Indore (M.P.) – 453441, India"],
  socials: [
    { label: "LinkedIn", icon: "linkedin", href: "https://www.linkedin.com/company/path-logicity/" },
    { label: "Instagram", icon: "instagram", href: "https://www.instagram.com/pathlogicity/" },
    { label: "YouTube", icon: "youtube", href: null },
    { label: "X", icon: "x", href: null },
  ],
};

/** Authority / partner logos, as shown on pathlogicity.com, plus the IGBC mark (igbc.in). */
export const partners: Partner[] = [
  { id: "nhlml", name: "National Highways Logistics Management Limited (NHLML)", role: "NHAI · Ministry of Road Transport & Highways", logo: "/client/partners/nhlml.webp", width: 611, height: 640 },
  { id: "rvnl", name: "Rail Vikas Nigam Limited (RVNL)", role: "Ministry of Railways", logo: "/client/partners/rvnl.webp", width: 333, height: 73 },
  { id: "kiadb", name: "Karnataka Industrial Areas Development Board (KIADB)", role: "Government of Karnataka", logo: "/client/partners/kiadb.webp", width: 206, height: 73 },
  { id: "igbc", name: "Indian Green Building Council (IGBC)", role: "Green building rating", logo: "/client/partners/igbc.png", width: 420, height: 666 },
];

export const navigation: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "Path Group",
    href: "/path-group",
    children: [
      { label: "Highlight", href: "/path-group#highlight", note: "27 years · 17+ states · 70+ locations" },
      { label: "About Path", href: "/path-group#about", note: "From infrastructure to logistics ecosystems" },
    ],
  },
  {
    label: "Logicity Advantage",
    href: "/logicity-advantage",
    children: [
      { label: "Project at a Glance", href: "/logicity-advantage#at-a-glance", note: "~400 acres, in numbers" },
      { label: "Amenities", href: "/logicity-advantage#amenities", note: "Everything your business needs" },
      { label: "Solutions", href: "/logicity-advantage#solutions", note: "Road · Rail · Air · Ports" },
      { label: "PM Gati Shakti", href: "/logicity-advantage#pm-gati-shakti", note: "Connecting India's logistics future" },
    ],
  },
  {
    label: "Sustainability",
    href: "/sustainability",
    children: [
      { label: "ESG", href: "/sustainability#esg", note: "IGBC Platinum Pre-Certification" },
      { label: "Business Value", href: "/sustainability#business-value", note: "Infrastructure that delivers value" },
    ],
  },
  { label: "Site Tour", href: "/site-tour" },
  { label: "News", href: "/news" },
  { label: "Blogs", href: "/blogs" },
];

export const hero = {
  headline: ["India's", "Largest", "*Multimodal*", "Logistics Hub"],
  copy: "A connected logistics ecosystem at Dobbaspet, Bengaluru, built to move businesses faster.",
  location: { primary: "Dobbaspet", secondary: "Bengaluru", roads: ["NH 648", "NH 48", "STRR"] },
  siteTag: "Phase 1 · 138 Acres",
  video: {
    slot: "Project Video",
    spec: "Drone aerial of site · 1920×1080 + 4:5 mobile · MP4/WebM · 12–20s loop · ≤6 MB",
    src: null,
    // The client's key visual (pathlogicity.com main.webp, 1462×825): road, rail, air and sea freight.
    // An illustrative render, not footage of the site — labelled as such in the hero. Swap for drone footage when supplied.
    poster: "/client/hero-main.webp",
    alt: "Illustration of multimodal freight: a truck on the quay, a container ship, an aircraft overhead and a freight train beyond the water",
  } satisfies MediaAsset,
};

export const scale = {
  metric: { value: 400, unit: "Acres", label: "400-acre integrated development" } satisfies MetricData,
  result: ["Integrated", "Logistics", "Ecosystem"],
  nodes: [
    { id: "location", icon: "crosshair", label: "Location", text: "Strategic Dobbaspet, Bengaluru location", href: "#connectivity", image: "/client/345.webp" },
    { id: "connectivity", icon: "network", label: "Connectivity", text: "Road + Rail + Air + Ports", href: "#connectivity", image: "/client/image-1729245560924.webp" },
    { id: "ecosystem", icon: "warehouse", label: "Ecosystem", text: "Warehousing + Dry Port + Logistics + Commercial", href: "#explore", image: "/client/image-1729245699855.webp" },
    { id: "legacy", icon: "legacy", label: "Legacy", text: "PATH Group's infrastructure experience", href: "#path-group", image: "/client/image-1729245444632.webp" },
  ] satisfies ScaleNode[],
};

export const zones: Zone[] = [
  {
    id: "warehousing",
    index: "01",
    name: "Warehousing",
    short: "Grade-A warehousing at the core of the ecosystem.",
    facts: ["~5.2 Mn sq. ft. of Grade-A warehousing"],
    media: { slot: "Warehousing", spec: "Site photograph · 3:2", src: "/client/image-1729245699855.webp", alt: "Render of Grade-A warehousing rows" },
  },
  {
    id: "rail",
    index: "02",
    name: "Rail Terminal",
    short: "A state-of-the-art rail terminal inside the hub.",
    facts: ["~40 acres dedicated to a state-of-the-art rail terminal", "6 railway sidings enabling seamless multimodal movement"],
    media: { slot: "Rail Terminal", spec: "Site photograph · 3:2", src: "/client/image-1720613648983.webp", alt: "Aerial render of Path Logicity with the rail terminal" },
  },
  {
    id: "icd",
    index: "03",
    name: "Dry Port / ICD",
    short: "An Inland Container Depot within a single ecosystem.",
    facts: ["Inland Container Depot (ICD)"],
    pending: "Confirm whether ~0.78 Mn sq. ft. customs-bonded infrastructure belongs to this zone",
    media: { slot: "Dry Port / ICD", spec: "Site photograph · 3:2", src: "/client/image-1729245560924.webp", alt: "Inland Container Depot at Path Logicity" },
  },
  {
    id: "commercial",
    index: "04",
    name: "Commercial",
    short: "Commercial infrastructure serving the hub.",
    facts: ["~1.76 Mn sq. ft. of commercial space"],
    media: { slot: "Commercial", spec: "Render or photograph · 3:2", src: null, alt: "Commercial space at Path Logicity" },
  },
  {
    id: "yards",
    index: "05",
    name: "Yards",
    short: "Yard infrastructure for handling and movement.",
    facts: [],
    pending: "Zone description and figures to be supplied",
    media: { slot: "Yards", spec: "Site photograph · 3:2", alt: "Yards at Path Logicity" },
  },
  {
    id: "roads",
    index: "06",
    name: "Roads",
    short: "The internal network that keeps the hub moving.",
    facts: [],
    pending: "Internal road specification to be supplied",
    media: { slot: "Roads", spec: "Drone photograph · 3:2", src: "/client/image-1729245469753.webp", alt: "Render of the Path Logicity entry gate and approach road" },
  },
  {
    id: "green",
    index: "07",
    name: "Green Infrastructure",
    short: "Green and open spaces woven through the site.",
    facts: [],
    pending: "Green infrastructure details to be supplied",
    media: { slot: "Green Infrastructure", spec: "Site photograph · 3:2", alt: "Green spaces at Path Logicity" },
  },
];

const progressMedia = (n: string, src: string | null, alt: string, credit: string | null): MediaAsset => ({
  slot: "Constra site capture",
  spec: `Milestone ${n} · Constra timelapse (MP4) or progress photo · 16:9`,
  src,
  alt,
  credit,
});

/**
 * Milestones from pathlogicity.com. Media: the client's own imagery where it
 * matches the milestone. CONSTRA collaterals (timelapse / progress photos) are
 * awaited from the client — drop them in public/constra/ and point `src` at
 * them (MP4/WebM plays inline). The in-progress milestone uses representative
 * stock until then and is labelled as such — never presented as the actual site.
 */
export const milestones: Milestone[] = [
  {
    id: "m1",
    status: "completed",
    phase: "Approvals",
    title: "In-principle master plan approval obtained from the concerned authorities",
    date: null,
    media: progressMedia("01", "/client/image-1731136566206.webp", "The approved Path Logicity master plan", "Official master plan"),
  },
  {
    id: "m2",
    status: "completed",
    phase: "Launch",
    title: "Path Logicity presented at the India Warehousing Show, Yashobhoomi, Delhi",
    date: "11–13 Jul 2024",
    media: progressMedia("02", "/client/image-1721036670474.webp", "The Path Logicity team at the India Warehousing Show 2024", "India Warehousing Show 2024"),
  },
  {
    id: "m3",
    status: "in-progress",
    phase: "Phase 1 · 138 acres",
    title: "Phase 1 site development",
    date: null,
    media: progressMedia("03", "/construction/progress-03-building.webp", "Representative construction progress", "Representative imagery · Constra site capture to follow"),
  },
  {
    id: "m4",
    status: "upcoming",
    phase: "Phase 1",
    title: "First phase operational",
    date: "Q4 2026",
    media: progressMedia("04", "/client/image-1720613648983.webp", "Aerial render of Path Logicity with the rail terminal and warehousing", "Project render"),
  },
];
export const statusLastUpdated: string | null = null;

export const pathGroup = {
  headline: { from: "From building infrastructure", to: ["To connecting", "India's *supply chains*"] },
  metrics: [
    { value: 27, unit: "Years", label: "of infrastructure legacy" },
    { value: 17, suffix: "+", unit: "States", label: "pan-India presence" },
    { value: 70, suffix: "+", unit: "Locations", label: "across the country" },
    { prefix: "~", value: 5000, unit: "Workforce", label: "across the group" },
  ] satisfies MetricData[],
  story:
    "With nearly three decades of experience in building India's infrastructure, PATH has evolved from developing critical infrastructure to creating integrated logistics ecosystems for the future.",
  sectors: ["Infrastructure", "Highways", "Logistics"],
  evolution: ["PATH Legacy", "Infrastructure", "Logistics", "PATH Logicity"],
  photo: {
    slot: "PATH Group Photography",
    spec: "Real PATH infrastructure project · 21:9 · ≥2560px wide",
    src: "/client/image-1729245444632.webp",
    alt: "Aerial view of large-scale warehousing and logistics infrastructure",
  } satisfies MediaAsset,
};

/** Project at a glance — exact client facts. `zone` links a callout to the plan. */
export const glance: (MetricData & { id: string; zone: string })[] = [
  { id: "acres", zone: "site", prefix: "~", value: 400, unit: "Acres", label: "of integrated logistics infrastructure" },
  { id: "warehousing", zone: "warehousing", prefix: "~", value: 5.2, decimals: 1, unit: "Mn sq. ft.", label: "of Grade-A warehousing" },
  { id: "commercial", zone: "commercial", prefix: "~", value: 1.76, decimals: 2, unit: "Mn sq. ft.", label: "of commercial space" },
  { id: "rail", zone: "rail", prefix: "~", value: 40, unit: "Acres", label: "dedicated to a state-of-the-art rail terminal" },
  { id: "sidings", zone: "rail", value: 6, unit: "Railway sidings", label: "enabling seamless multimodal movement" },
  { id: "bonded", zone: "icd", prefix: "~", value: 0.78, decimals: 2, unit: "Mn sq. ft.", label: "of customs-bonded infrastructure" },
  { id: "phase1", zone: "phase1", value: 138, unit: "Acres · Phase 1", label: "the first phase, targeted for Q4 2026" },
];

/** §05.5 — the client's own renders (pathlogicity.com), shown as a pinned horizontal gallery. Illustrative. */
const render = (src: string, alt: string): MediaAsset => ({ slot: "Render", spec: "Client render · 16:10", src, alt });
export const renders: GalleryItem[] = [
  { id: "gate", title: "The entry gate", caption: "Arrival from the approach road", media: render("/client/image-1729245469753.webp", "Render of the Path Logicity entry gate") },
  { id: "icd", title: "Container yard & ICD", caption: "Gantry cranes at the inland container depot", media: render("/client/image-1729245560924.webp", "Render of the container yard with gantry cranes") },
  { id: "aerial", title: "Rail terminal & warehousing", caption: "The park from above", media: render("/client/image-1720613648983.webp", "Aerial render of Path Logicity with the rail terminal") },
  { id: "warehousing", title: "Grade-A warehousing", caption: "~5.2 million sq. ft. of warehousing space", media: render("/client/image-1729245699855.webp", "Render of Grade-A warehousing rows") },
  { id: "green", title: "Solar roofs, green belts", caption: "Sustainability built into the layout", media: render("/client/image-1729245154858.webp", "Render of warehouses with rooftop solar and green belts") },
  { id: "plan", title: "The master plan", caption: "Official layout of the park", media: render("/client/image-1731136566206.webp", "Official Path Logicity master plan"), fit: "contain" },
];

export const destinations: Destination[] = [
  { id: "nh648", name: "NH 648", subtitle: "Adjacent · towards Devanahalli", mode: "road", kind: "corridor", level: "region", distanceKm: null, durationText: null, note: null },
  { id: "nh48", name: "NH 48", subtitle: "Multi-lane · via Nelamangala to Bengaluru", mode: "road", kind: "corridor", level: "region", distanceKm: null, durationText: null, note: null },
  { id: "strr", name: "STRR", subtitle: "4-lane Satellite Town Ring Road · south-west", mode: "road", kind: "corridor", level: "region", distanceKm: null, durationText: null, note: null },
  { id: "sidings", name: "6 Railway Sidings", subtitle: "On-site rail terminal", mode: "rail", kind: "onsite", level: "site", distanceKm: null, durationText: null, note: "~40 acres dedicated to a state-of-the-art rail terminal" },
  { id: "dodbele", name: "Dodbele Railway Station", subtitle: "Nearest railway station", mode: "rail", kind: "destination", level: "region", distanceKm: 3.5, durationText: null, note: null },
  { id: "kia", name: "Kempegowda International Airport", subtitle: "Bengaluru", mode: "air", kind: "destination", level: "region", distanceKm: 55, durationText: null, note: null },
  { id: "mangalore", name: "Mangalore Port", subtitle: "Port", mode: "port", kind: "destination", level: "india", distanceKm: 339, durationText: null, note: null },
  { id: "chennai", name: "Chennai Port", subtitle: "Port", mode: "port", kind: "destination", level: "india", distanceKm: 376, durationText: null, note: null },
];

export const gatiShakti = {
  headline: ["Connecting India's", "*logistics future*"],
  tagline: "Driving India's vision for integrated and efficient logistics.",
  equation: [
    { label: "Road", icon: "road" },
    { label: "Rail", icon: "rail" },
    { label: "Warehousing", icon: "warehouse" },
    { label: "Commercial", icon: "commercial" },
    { label: "ICD", icon: "container" },
  ] as const,
  points: [
    "Strengthening multimodal connectivity through integrated infrastructure",
    "Supporting the PM Gati Shakti vision of seamless logistics movement",
    "Enabling faster movement of goods across key economic corridors",
  ],
  mmlp: "Bengaluru is the largest amongst the MMLPs being built currently.",
  /** pathlogicity.com — "The Future of Indian Logistics is here" */
  facts: [
    { prefix: "", value: 35, unit: "MMLPs", label: "to be built under PM Gati Shakti, on the PPP model" },
    { prefix: "₹", value: 46000, unit: "Crores", label: "budgeted investment for MMLPs across the country" },
  ] satisfies MetricData[],
};

export const sustainability = {
  headline: ["Moving business forward.", "*Responsibly.*"],
  certification: { body: "IGBC", level: "Platinum", type: "Pre-Certification" },
  initiatives: [
    { id: "solar", icon: "solar", name: "Solar Energy", text: null, metric: null },
    { id: "rain", icon: "rain", name: "Rainwater Harvesting", text: null, metric: null },
    { id: "waste", icon: "waste", name: "Waste Management", text: null, metric: null },
    { id: "ev", icon: "ev", name: "EV Infrastructure", text: null, metric: null },
    { id: "efficiency", icon: "efficiency", name: "Resource Efficiency", text: null, metric: null },
  ] satisfies Initiative[],
  story: ["More efficient infrastructure", "Smarter logistics", "More sustainable growth"],
  media: { slot: "Sustainability Imagery", spec: "Solar / green spaces on site · 4:5", src: "/client/image-1729245154858.webp", alt: "Render of warehouses with rooftop solar and green belts" } satisfies MediaAsset,
};

export const benefits: Benefit[] = [
  { id: "tat", title: "Faster TAT", text: "Integrated infrastructure designed to streamline movement and handling." },
  { id: "cost", title: "Lower Logistics Cost", text: "Multimodal connectivity and integrated facilities designed to improve supply-chain efficiency." },
  { id: "connectivity", title: "Faster Connectivity", text: "Strategic access to highways, rail and major economic centres." },
  { id: "efficiency", title: "Greater Operational Efficiency", text: "Multiple logistics capabilities within one connected ecosystem." },
  { id: "scalability", title: "Scalability", text: "Infrastructure designed to evolve with business requirements." },
];

export const siteTour = {
  title: "Logicity360",
  kicker: "Inside Logicity",
  chips: ["Explore", "Warehousing", "Rail", "ICD", "Commercial", "Roads", "Green Areas"],
  media: { slot: "3D Site Tour", spec: "Interactive 3D model embed · full-screen viewport", alt: "Interactive 3D model of Path Logicity" } satisfies MediaAsset,
};

/** Real project updates, from the client site. Other tabs show the designed empty state. */
export const news: NewsItem[] = [
  {
    id: "u1",
    type: "update",
    source: "India Warehousing Show, Delhi",
    date: "11–13 Jul 2024",
    headline: "Path Logicity at the India Warehousing Show 2024",
    href: null,
    image: { slot: "Update", spec: "", src: "/client/image-1721036617308.webp", alt: "Path Logicity at the India Warehousing Show 2024, Yashobhoomi, Delhi" },
    placeholder: false,
  },
  {
    id: "u2",
    type: "update",
    source: "Path Logicity",
    date: null,
    headline: "In-principle master plan approval obtained from the concerned authorities",
    href: null,
    image: { slot: "Update", spec: "", src: "/client/image-1721036670474.webp", alt: "Path Logicity warehouse master plan approval" },
    placeholder: false,
  },
  {
    id: "u3",
    type: "update",
    source: "Path Logicity",
    date: null,
    headline: "A long-term vision to harness logistics cost and streamline last-mile delivery",
    href: null,
    image: { slot: "Update", spec: "", src: "/client/image-1721036870213.webp", alt: "Path Logicity long-term logistics infrastructure vision" },
    placeholder: false,
  },
];

export const enquiry = {
  headline: ["Let's build", "your", "*logistics*", "advantage"],
  copy: ["Tell us about your business requirements.", "Let's explore the right solution at Path Logicity."],
  industries: ["FMCG", "E-commerce", "Retail", "Automotive", "Pharma", "Logistics", "Others"],
};
