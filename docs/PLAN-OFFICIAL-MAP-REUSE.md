# Plan — one official map across §03, §06.1 and §09

> 2026-10-16. Request: §09 "Inside Logicity" and §06.1 "Project at a glance" should use the same
> official master-plan map as §03 "Explore Path Logicity", with proper animation and motion flow.
> Scope rule: **only these two sections change.** §03 `MasterPlan` and every other file are untouched.

## Today

| Section | Map it shows | Problem |
|---|---|---|
| §03 Explore | The client's official plan with traced, hoverable zones (`officialZones.ts`) | Reference behaviour |
| §06.1 Project at a glance | Hand-drawn oblique schematic (`PlanSvg`, `AXO` transform) | Not the real plan; its zones do not match the official drawing |
| §09 Logicity360 | Hand-drawn perspective schematic (`PlanSvg`, 58° orbit) | Same, and it reads as a different site |

## Design

### 1. One shared component — `master-plan/OfficialPlanMap` (new file)
Renders the official drawing and overlays the traced zones exactly as §03 does (same data, same look):
- wash-out of everything except the lit zone, full-colour re-reveal of that zone, outline that draws itself, pulsing marker and name tag;
- optional hit targets (hover / tap) so the map is a control, not a picture;
- optional **markers**: small anchored dots positioned in image space (percent of the drawing), exposed by callback ref so §06.1 can keep drawing its leader lines to them;
- `useZoneTour` (same file): a scroll-triggered, one-shot sequence that lights the steps one by one, then hands over; it stops permanently on the first hover, focus, tap or key press, and does nothing under reduced motion.

### 2. §06.1 Project at a glance
- The oblique schematic is replaced by the official plan in the same centre column. Layout, copy, `Metric` callouts and the Phase 1 band are unchanged.
- Each figure is anchored to a real place on the drawing: ~400 acres (site centre), warehousing, commercial, rail terminal, 6 sidings (a point on the rail strip), customs-bonded (CFS shed / ICD).
- **Motion flow:** (1) the leader lines draw out from the figures to the map (existing animation, kept); (2) then the tour steps through the six figures — each figure lights up while its zone lights on the map and its marker pulses; (3) it settles and the visitor takes over. Hovering a figure lights its zone; hovering a zone on the map lights its figure (two-way).

### 3. §09 Logicity360 preview
- The perspective schematic is replaced by the official plan, full-width, with a slow camera drift so it never sits dead.
- **Camera transitions** (the concept note asks for them): choosing a chip, or clicking/tapping a zone on the map, lights the zone and glides the camera onto it (per-zone zoom, 1.4 s ease-out), then back out on "Explore".
- **Motion flow:** on entering view the camera tours Warehousing → Rail → ICD → Commercial → Roads → Green Areas, with the matching chip highlighting in step, then returns to the overview and hands over. Stops on first interaction.
- Chips, copy, the "Enter the 3D site tour" button and the asset-slot note are unchanged.

### 4. Accessibility and reduced motion
Chips and callouts stay real buttons (keyboard + `aria-pressed`); the map overlay is `aria-hidden` plus pointer hit targets, as in §03. Reduced motion: no tour, no drift, no camera glide — the plan is simply there and the controls still work.

### 5. Out of scope
§03 itself, the zone data/mapping (still pending client confirmation), `PlanSvg` (kept; no longer used by these two, left in place), content files, copy, fonts.

## Verification
Typecheck + production build; screenshots of both sections at rest, mid-tour and on a zone; hover both ways in §06.1; chip → camera in §09; keyboard; 390 px; reduced motion; no console errors.
