# Plan — §07.1 PM Gati Shakti gets the §07 location map

> 2026-10-16. Request: in §07.1, use the same image as §07 Solutions · Connectivity, connect it
> properly with the points, and connect the Path Logicity location.

## Today
§07.1 shows a schematic "MMLP network" (35 abstract nodes, Bengaluru as the biggest). It is not a
real place, so it says nothing about *where* Path Logicity connects.

## Change
Replace the schematic with the client's own location map (`/client/345.webp`, the same image and the
same traced routes as §07), as a Gati Shakti picture of multimodal connectivity:

- **Hub:** the Path Logicity site pin (pulsing gold) at the site parcel.
- **Points:** NH 648, STRR, NH 48 (road), Dodbele station (rail), Kempegowda Airport (air), Mangalore
  and Chennai ports (port, at the map edges), each a pin with a short label (distance shown when the
  client supplied one — never invented).
- **Connections:** the existing route geometry (`connectivity-map/mapGeometry.ts`, in the image's
  pixel space) draws from the site to every point, in the §07 mode styles (road solid, rail dashed,
  air dotted, port long-dashed), so lines sit on the roads the map shows.
- **Motion flow:** on first view the site pin pops, the routes draw out one by one, each point and
  label arrives as its route lands. Hover or tap a point to emphasise its route and dim the rest.
- **Legend** under the map (mode line styles + the site).
- **Phones:** points stay as tappable dots; a label shows for the one you tap (the map is too small
  for eight labels).

## Not changed
§07 itself, `mapGeometry.ts`, the 35 MMLPs / ₹46,000 Cr facts, the five-part "one ecosystem" row, the six
points, "The impact", partner logos. The old `MmlpNetwork` file is left in place, now unused.
