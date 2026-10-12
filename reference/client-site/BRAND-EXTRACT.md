# Path Logicity — Client Brand Extract

> Scraped from the live client site **https://www.pathlogicity.com/** on 2026-10-12.
> Purpose: adopt the client's exact brand colours + real project imagery/copy into our
> existing UI/UX (navy "technical drawing" system). **Do NOT change our layout, design
> language or animation — only the colour tokens, imagery and verified copy.**

---

## 1. Brand colour palette (exact, from the site's own CSS variables)

The live site defines a **4-colour pinwheel** (matches the logo) as CSS custom properties:

| Role on client site | Hex | RGB | Notes |
|---|---|---|---|
| `--bgcolor1` **Green** (primary / dominant) | `#449e35` | 68,158,53 | Most-used accent; primary action buttons use pure `#008000`; headings accent `#178a27` |
| `--bgcolor2` **Amber / Gold** | `#e7ac00` | 231,172,0 | Secondary accent |
| `--bgcolor3` **Blue** | `#0066b1` | 0,102,177 | Secondary accent (also used on some buttons) |
| `--bgcolor4` **Orange** | `#ff6600` | 255,102,0 | Secondary accent |
| Indigo (logo "Logicity" wordmark) | `#201f85` | 32,31,133 | Seen once as bg; deep indigo/violet |

**Neutrals**
- Body text: `#333333` (rgb 51,51,51) — dominant text colour
- Headings: `#000000` / `#333333`
- Light surface: `#ffffff`, `#f2f2f2`
- Grey text: `#808080`, `#9d9d9d`

**How the client uses colour (semantics)**
- **Green is the client's PRIMARY brand/action colour** (buttons = `#008000`/`#449e35`, white text).
- Stats/big numbers **cycle through the pinwheel**: green → orange → blue → green … (decorative rotation).
- Blue is the secondary button colour.
- Amber/gold + orange are supporting accents.
- Backgrounds are predominantly **light/white** on the client site (our design stays dark navy — we only borrow the accent hues).

### Mapping note for our token system (decision pending — see integration plan)
Our current system uses **yellow = sole action accent**, **green = sustainability/completed**.
The client's identity is **green-led with a yellow/blue/orange pinwheel**. The integration
must reconcile these without altering component structure. Candidate hues to drop into our
existing `@theme` tokens in `app/globals.css`:

```
--color-green-500 : #449e35   (client green — primary brand)
--color-green-700 : #178a27 / #2f6b22  (darker green text on light)
--color-yellow-400: #e7ac00   (client amber/gold — replaces mustard)
--color-indigo-700: #201f85   (client indigo wordmark)
--color-blue-500  : #0066b1   (NEW — client blue, for pinwheel/data)
--color-orange-500: #ff6600   (NEW — client orange, for pinwheel accents)
```

---

## 2. Typography (client site)

- Primary: **"Open Sans"**, Helvetica, Arial, sans-serif
- Fallback: Arial, Helvetica, sans-serif
- Headings: 25–36px, weight 500–700
- (Our design keeps Manrope / Inter / JetBrains Mono — client font is reference only.)

---

## 3. Logo

- `https://www.pathlogicity.com/public/img1/logo1.webp` (167×57) — "PATH LOGICITY" wordmark + pinwheel mark, class `toplogo`
- Pinwheel = green / amber / blue / orange petals (the source of the palette)

---

## 4. Verified project facts & copy (from the live site)

### Positioning
- "Warehouse for lease in Bengaluru — Grade A warehouse Bengaluru"
- India's largest MMLP at **Dobbaspet, Bengaluru**
- Built by **PATH India Ltd.** / Prakash Asphaltings & Toll Highways (PATH Group)

### PATH Group highlights ("Our Highlights")
- 17+ States · 27 Years Legacy · 70+ Locations · 4000+ Crores Turnover · ~5000 Workforce · 5.5Cr Toll Collection/Day

### PATH Group delivery ("Our Delivery")
- 35% Market Share of OMT Highway Projects in India · ~6500 Lane Kilometers Highways · 28+ Wayside Amenities Projects · 4 ROB (Rail Over Bridge) · 3 Multistorey Parkings · 40+ Toll Plaza · 6 HAM · 6 BOT · 31 TMS · 7 OMT · 15 EPC

### MMLP / Gati Shakti
- **35 MMLPs** to be built under PM Gati Shakti (PPP model master plan)
- **₹46,000 Crores** budgeted investment for MMLPs across the country
- Bengaluru is the largest amongst the MMLPs being built currently
- Part of MoRTH's Logistics Efficiency Enhancement Program (LEEP)

### Project scale ("Where Logistics Meets Efficiency")
- **~400 acres** area
- **First Phase in Q4 of 2026**
- **~40 acres** Rail Terminal Area
- **~5.2 million sq. ft.** Warehousing space
- **~1.76 million sq. ft.** Commercial space
- **0.78 million sq. ft.** Customs Bonded area

### Connectivity ("Seamless Connectivity")
- Northwest quadrant of Bengaluru; adjacent to **STRR (NH648)**
- **6 Railway sidings** in the facility
- **Dodbele Railway Station 3.5 km** away
- Connected to **NH 648 / NH 48** multi-lane national highways
- 4-lane Satellite Town Ring Road (STRR) in the south-west
- **~339 km Mangalore Port**
- **~376 km Chennai Port**
- **~55 km Kempegowda International Airport, Bengaluru**

### Services — Grade-A Facility
- Grade-A Facility · Built-to-suit Model · Multi-user Model · Custom Office and Exim Clearance

### City Beyond Logistics (Commercial)
- Office and Retail · Employees Accommodation · Skill Development Centre · Trucker Amenities · Mess/Canteen · Dispensary/Crèche · Restaurants and Food Courts · Fuel Stations

### Solutions / Zones
- Bonded Warehousing · Designated Yards · Standard Warehousing · Inter-modal Area · Cold Storage · Vehicle Parking and Service Area
- Also listed: Multimodal Logistics Park · Inland Container Depot · Standard & Bonded Warehouses · Cold Storage · Rail Sidings · Commercial Spaces · Yards

### Sustainability — "Initiatives For Better Tomorrow"
- Solar panels · Rainwater harvesting · Waste management & recycling · Green building standards · EV charging stations · **GRIHA — Green Rating for Integrated Habitat Assessment**
  (Note: client site says "AGRIHA" but the standard is GRIHA — confirm. Our concept note said IGBC Platinum — reconcile with client.)

### Updates (news)
- **India Warehousing Show, 2024** — 11–13 July 2024 at Yashobhoomi, Delhi
- **In-principle Approval** — obtained in-principle master plan approval from authorities
- **Long Term Vision** — harnessing logistics cost & streamlining last-mile delivery

### Contact
- Address: 76, Mall Road, Mhow, Indore (M.P.) – 453441, India
- Phone: 9899880388
- Email: mmlp.blr@pathltd.com

### Site navigation (client)
- Home · Path Group · MMLP · About Us · Service · Sustainability · Updates · Contact

---

## 5. Key imagery (download candidates)

Base path: `https://www.pathlogicity.com/public/img1/`

**Primary**
- `logo1.webp` — logo (167×57)
- `main.webp` — hero: warehouse/ship/plane/truck composite (1462×825)
- `main2.webp` — (657×818)
- `image-1731136566206.webp` — class `imgmap` → **connectivity map / site map** (2774×1583)

**Large project renders / aerials (Logistic park)**
- `image-1729245154858.webp` (4485×3301)
- `image-1729245352630.webp` (2800×1865)
- `image-1729245444632.webp` (4914×3301)
- `image-1729245469753.webp` (3301×1750)
- `image-1729245560924.webp` (3301×1750)
- `image-1729245608818.webp` (4939×3301) `imagsize`
- `image-1729245699855.webp` (4485×3301) `imagsize`
- `image-1731136096535.webp` (359×483)
- `image-1720613648983.webp` (1143×702) `imagsize`
- `345.webp` (1320×1232)

**Updates / news images**
- `image-1721036617308.webp` — India Warehousing Show 2024 (1272×763)
- `image-1721036670474.webp` — master plan approval (1268×864)
- `image-1721036870213.webp` — long term vision (1253×778)
- `image-1721195843393.webp` — logistics hub update (1272×763)
- `image-1720613738402.webp` — infrastructure update (398×482)

**Pinwheel / brand elements**
- `Logo Element with Lens Flare.webp` / `-1.webp` (1120×1293)
- `Logo Element (Arrow).webp` / `-1.webp` (1204×727)

**Stat / service icons** (small webp): `2.webp` (27yrs), `011.webp` (70+), `3.webp` (4000cr), `4.webp`, `5.webp`, `6.webp`–`30.webp`, `timeline (1).webp`, `residential-2.webp`, `building.webp`, `Multiple Location .webp`

---

## 6. Reconciliation flags (client site vs our concept note)

| Topic | Our concept note | Client live site | Action |
|---|---|---|---|
| Legacy years | "30+ Years" | "27 Years Legacy" | Use client: **27** |
| States | "18 States" | "17+ States" | Use client: **17+** |
| Workforce | "~6,100+" | "~5000" | Use client: **~5000** |
| Turnover | (not in note) | "4000+ Crores" | NEW fact available |
| Phase 1 | "138 Acres" | "First Phase Q4 2026" (no 138 figure on live) | Keep 138 (concept) + add Q4 2026 |
| Green rating | "IGBC Platinum Pre-Cert" | "GRIHA" (site says AGRIHA) | **Confirm with client** |
| Ports/airport dist. | (null — unverified) | Mangalore ~339km · Chennai ~376km · KIA ~55km | NEW verified distances |
| Rail station | (not in note) | Dodbele 3.5 km | NEW fact |

These distances were previously `null` placeholders in our content — the client site now
supplies verified figures we can fill in.
