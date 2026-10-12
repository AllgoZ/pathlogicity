/**
 * Seed content — every fact below comes from the client concept note
 * (reference/Concept Note for Path Logicity.pdf). Anything not supplied is
 * null / placeholder and renders as a labelled slot. Do not add facts here
 * without a client source.
 */
import type {
  Benefit,
  Destination,
  Initiative,
  MediaAsset,
  MetricData,
  Milestone,
  NavItem,
  NewsItem,
  ScaleNode,
  SiteSettings,
  Zone,
} from "@/lib/content/types";

export const settings: SiteSettings = {
  leasingName: null,
  phone: null,
  whatsapp: null,
  email: null,
  brochureUrl: null,
  coordinates: null,
  socials: [
    { label: "LinkedIn", icon: "linkedin", href: null },
    { label: "YouTube", icon: "youtube", href: null },
    { label: "Instagram", icon: "instagram", href: null },
    { label: "X", icon: "x", href: null },
  ],
};

export const navigation: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "Path Group",
    href: "/path-group",
    children: [
      { label: "Highlight", href: "/path-group#highlight", note: "30+ years · 18 states · 70+ locations" },
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
  headline: ["India's", "Largest", "Multimodal", "Logistics Hub"],
  copy: "A connected logistics ecosystem at Dobbaspet, Bengaluru, built to move businesses faster.",
  location: { primary: "Dobbaspet", secondary: "Bengaluru", roads: ["NH 648", "NH 48", "STRR"] },
  siteTag: "Phase 1 · 138 Acres",
  video: {
    slot: "Project Video",
    spec: "Drone aerial of site · 1920×1080 + 4:5 mobile · MP4/WebM · 12–20s loop · ≤6 MB",
    src: null,
    // Client key visual used as the hero still until drone footage is supplied.
    poster: "/client/main.webp",
    alt: "Multimodal logistics — road, rail, air and port connectivity at Path Logicity",
  } satisfies MediaAsset,
};

export const scale = {
  metric: { value: 400, unit: "Acres", label: "400-acre integrated development" } satisfies MetricData,
  result: ["Integrated", "Logistics", "Ecosystem"],
  nodes: [
    { id: "location", icon: "crosshair", label: "Location", text: "Strategic Dobbaspet, Bengaluru location", href: "#connectivity" },
    { id: "connectivity", icon: "network", label: "Connectivity", text: "Road + Rail + Air + Ports", href: "#connectivity" },
    { id: "ecosystem", icon: "warehouse", label: "Ecosystem", text: "Warehousing + Dry Port + Logistics + Commercial", href: "#explore" },
    { id: "legacy", icon: "legacy", label: "Legacy", text: "PATH Group's infrastructure experience", href: "#path-group" },
  ] satisfies ScaleNode[],
};

export const zones: Zone[] = [
  {
    id: "warehousing",
    index: "01",
    name: "Warehousing",
    short: "Grade-A warehousing at the core of the ecosystem.",
    facts: ["~5.2 Mn sq. ft. of Grade-A warehousing"],
    media: { slot: "Warehousing", spec: "Site photograph · 3:2", src: "/client/image-1729245154858.webp", alt: "Grade-A warehousing at Path Logicity" },
  },
  {
    id: "rail",
    index: "02",
    name: "Rail Terminal",
    short: "A state-of-the-art rail terminal inside the hub.",
    facts: ["~40 acres dedicated to a state-of-the-art rail terminal", "6 railway sidings enabling seamless multimodal movement"],
    media: { slot: "Rail Terminal", spec: "Site photograph · 3:2", src: "/client/image-1729245469753.webp", alt: "Rail terminal and sidings at Path Logicity" },
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
    media: { slot: "Commercial", spec: "Render or photograph · 3:2", src: "/client/image-1729245352630.webp", alt: "Commercial space at Path Logicity" },
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
    media: { slot: "Roads", spec: "Drone photograph · 3:2", alt: "Internal roads at Path Logicity" },
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

const progressMedia = (n: string, src: string, alt: string): MediaAsset => ({
  slot: "Construction Progress",
  spec: `Milestone ${n} · Constra timelapse / drone · 16:9`,
  src,
  alt,
});

/**
 * Milestone titles and dates are still supplied by the client/CMS (placeholders).
 * Media are representative construction-progress images (stock, Unsplash) until the
 * client supplies real site/Constra footage — never presented as the actual site.
 */
export const milestones: Milestone[] = [
  { id: "m1", status: "completed", phase: null, title: null, date: null, media: progressMedia("01", "/construction/progress-01-groundwork.webp", "Site groundwork and foundations under construction") },
  { id: "m2", status: "completed", phase: null, title: null, date: null, media: progressMedia("02", "/construction/progress-02-structure.webp", "Structural works rising on a construction site") },
  { id: "m3", status: "in-progress", phase: null, title: null, date: null, media: progressMedia("03", "/construction/progress-03-building.webp", "Buildings under construction") },
  { id: "m4", status: "upcoming", phase: null, title: null, date: null, media: progressMedia("04", "/construction/progress-04-scale.webp", "Large-scale construction development with tower cranes") },
];
export const statusLastUpdated: string | null = null;

export const pathGroup = {
  headline: { from: "From building infrastructure", to: ["To connecting", "India's supply chains"] },
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
    src: "/client/image-1729245608818.webp",
    alt: "Path Logicity logistics park development",
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

export const destinations: Destination[] = [
  { id: "nh648", name: "NH 648", subtitle: "National Highway", mode: "road", kind: "corridor", level: "region", distanceKm: null, durationText: null, note: null },
  { id: "nh48", name: "NH 48", subtitle: "National Highway", mode: "road", kind: "corridor", level: "region", distanceKm: null, durationText: null, note: null },
  { id: "strr", name: "STRR", subtitle: "Satellite Town Ring Road", mode: "road", kind: "corridor", level: "region", distanceKm: null, durationText: null, note: null },
  { id: "sidings", name: "6 Railway Sidings", subtitle: "On-site rail terminal", mode: "rail", kind: "onsite", level: "site", distanceKm: null, durationText: null, note: "~40 acres dedicated to a state-of-the-art rail terminal" },
  { id: "dodbele", name: "Dodbele Railway Station", subtitle: "Nearest railway station", mode: "rail", kind: "destination", level: "region", distanceKm: 3.5, durationText: null, note: null },
  { id: "kia", name: "Kempegowda International Airport", subtitle: "Airport", mode: "air", kind: "destination", level: "region", distanceKm: 55, durationText: null, note: null },
  { id: "mangalore", name: "Mangalore Port", subtitle: "Port", mode: "port", kind: "destination", level: "india", distanceKm: 339, durationText: null, note: null },
  { id: "chennai", name: "Chennai Port", subtitle: "Port", mode: "port", kind: "destination", level: "india", distanceKm: 376, durationText: null, note: null },
];

export const gatiShakti = {
  headline: ["Connecting India's", "logistics future"],
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
  mmlp: "Strategically located at Dobbaspet, Bengaluru, the largest MMLP zone.",
};

export const sustainability = {
  headline: ["Moving business forward.", "Responsibly."],
  certification: { body: "IGBC", level: "Platinum", type: "Pre-Certification" },
  initiatives: [
    { id: "solar", icon: "solar", name: "Solar Energy", text: null, metric: null },
    { id: "rain", icon: "rain", name: "Rainwater Harvesting", text: null, metric: null },
    { id: "waste", icon: "waste", name: "Waste Management", text: null, metric: null },
    { id: "ev", icon: "ev", name: "EV Infrastructure", text: null, metric: null },
    { id: "efficiency", icon: "efficiency", name: "Resource Efficiency", text: null, metric: null },
  ] satisfies Initiative[],
  story: ["More efficient infrastructure", "Smarter logistics", "More sustainable growth"],
  media: { slot: "Sustainability Imagery", spec: "Solar / green spaces on site · 4:5", src: "/client/image-1720613648983.webp", alt: "Green, sustainable logistics infrastructure at Path Logicity" } satisfies MediaAsset,
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
  headline: ["Let's build", "your", "logistics", "advantage"],
  copy: ["Tell us about your business requirements.", "Let's explore the right solution at Path Logicity."],
  industries: ["FMCG", "E-commerce", "Retail", "Automotive", "Pharma", "Logistics", "Others"],
};
