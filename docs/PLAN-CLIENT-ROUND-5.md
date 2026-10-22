# Client round 5 — plan

Source: [`prompts/client.md`](../prompts/client.md) (client "Website Revision Feedback"). Sources for new content:
the client's main site **pathltd.com** (fetched 2026-10-22) and the client's own numbers in the feedback.

## Decisions taken

| Question | Decision |
|---|---|
| Which font? | The client's own brief says "a contemporary sans-serif such as Inter/Manrope … bold, architectural headlines and concise copy". **Manrope** for headlines and numerals, **Inter** for body and labels. Type scale reduced about 8–10%. Replaces Open Sans |
| Warehouse 17 photo | Not supplied. The hero is wired to `/client/warehouse-17.webp` and uses it **as soon as the file exists**; until then the current render stays and keeps its "Illustrative render" label |
| Constra | No URL or space figures supplied. Build the leasing/availability block and the Constra link buttons from content fields; empty values show a designed fallback (visitors) / review slots (`?annotations=on`) |

## Work items

| # | Feedback | Change | Files |
|---|---|---|---|
| 1 | Home 1 — remove Phase 1, real photo of Warehouse 17, highlight the MMLP concept | Hero tag "Phase 1 · 138 Acres" becomes **MMLP · Multimodal Logistics Park**. Hero image reads the Warehouse 17 photo when present (and then labels it "Warehouse 17 · site photograph"). The "Phase 1" band in §06.1 becomes an **MMLP concept** band; the `phase1` glance figure is removed | `content/home.ts`, `lib/content/index.ts`, `hero/Hero.tsx`, `advantage/SpecDrawing.tsx` |
| 2 | Home 2 — font style and size | Manrope + Inter via `next/font`; tokens and the type scale in `globals.css` | `app/layout.tsx`, `app/globals.css` |
| 3 | Home 3 — motion on the top banner | Slow drift on the render, headline lines rise on load, the bottom bar fades up, a radar ping on the site reticle. Pure CSS (no flash before hydration), nothing under reduced motion, and the desktop scroll scene is untouched | `Hero.tsx`, `globals.css` |
| 4 | Phases 1–2 — drop Yashobhoomi, phases as Lorem Ipsum | Milestone titles and phase labels are Lorem ipsum, dates cleared; the Yashobhoomi name is removed everywhere (milestone, news image alt) | `content/home.ts` |
| 5 | PATH Group 1 — highway photo from the main site | `proj-1.jpg` from pathltd.com (a highway aerial) saved as `public/client/path-group-highway.webp` | `public/client/`, `content/home.ts` |
| 6 | PATH Group 2 — new figures | 31 years · 18 states · 6,500 lane km · ~6,000 workforce (nav note and "nearly three decades" copy updated to match) | `content/home.ts` |
| 7 | PATH Group 3 — expand About PATH | Overview paragraphs, mission and vision, and a track-record strip, all from pathltd.com, with a link to the full overview | `PathGroup.tsx`, `content/home.ts`, `types.ts` |
| 8 | PATH Legacy — show the verticals | The four-step legacy timeline is replaced by **PathVerticals**: Highway Construction, Toll Operations, Wayside Amenities (PATH Recharge), Logistics Parks (Path Logicity), Engineering, Drone Manufacturing (VU Dynamics), Sports (Majhi Mumbai), IT Solutions | new `path-group/PathVerticals.tsx`; `EvolutionLine.tsx` removed |
| 9 | Constra 1–2 — link leased/available space and collaterals | New **SpaceAvailability** block in §04 (leased / available / total, unit list) and Constra collateral links; the section copy links to Constra once a URL exists | new `project-status/SpaceAvailability.tsx`, `ProjectStatus.tsx`, `content/home.ts`, `types.ts` |
| 10 | Docs and QA | HANDOVER (status, change log, new "waiting on client" rows), ARCHITECTURE (fonts, sections), typecheck, build, screenshots at 1440 and 390 | `architecture files/` |

## Waiting on the client after this round

1. The **Warehouse 17 site photograph** (drop `public/client/warehouse-17.webp`, about 2000 px wide).
2. **Constra**: the project/dashboard URL, the leased / available / total figures (or the feed), and which collaterals to link.
3. Confirm the PATH Group figures copied from pathltd.com (track record strip) and the "more than three decades" wording.
4. Approve the Manrope + Inter pairing.
