import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
const require = createRequire("D:/Nagul/2026/path logicity/site/package.json");
const { chromium } = require("playwright-core");

const BASE = "http://localhost:3100";
const OUT = "C:/Users/navin/AppData/Local/Temp/claude/d--Nagul-2026-path-logicity-site/1f4f6c1c-2886-4004-8670-62dfab04154f/scratchpad/shots";
fs.mkdirSync(OUT, { recursive: true });
const exe = path.join(process.env.LOCALAPPDATA, "ms-playwright/chromium-1248/chrome-win64/chrome.exe");
const browser = await chromium.launch({ executablePath: exe, headless: true });
const R = {};

async function ctx(w, h, opts = {}) {
  return browser.newContext({ viewport: { width: w, height: h }, ...opts });
}

// ---- 1. Whole-site text sweep for banned words, on every page
const pages = ["/", "/path-group", "/logicity-advantage", "/sustainability", "/site-tour", "/news", "/blogs"];
R.sweep = {};
{
  const c = await ctx(1440, 900);
  for (const p of pages) {
    const pg = await c.newPage();
    await pg.goto(BASE + p, { waitUntil: "networkidle" });
    const html = await pg.content();
    const text = await pg.evaluate(() => document.body.innerText);
    R.sweep[p] = {
      phase1: /phase\s*1/i.test(text) || /phase\s*1/i.test(html.replace(/<script[\s\S]*?<\/script>/g, "")),
      yashobhoomi: /yashobhoomi/i.test(html),
      openSans: /open[\s_-]?sans/i.test(html),
      lorem: (text.match(/lorem ipsum/gi) || []).length,
      status: (await pg.title()),
    };
    await pg.close();
  }
  await c.close();
}

// ---- 2. Hero (desktop + mobile)
R.hero = {};
for (const [name, w, h] of [["desktop", 1440, 900], ["mobile", 390, 844]]) {
  const c = await ctx(w, h, name === "mobile" ? { isMobile: true, hasTouch: true, deviceScaleFactor: 2 } : {});
  const pg = await c.newPage();
  const failed = [];
  pg.on("response", (r) => { if (r.status() >= 400) failed.push(`${r.status()} ${r.url()}`); });
  const errs = [];
  pg.on("console", (m) => { if (m.type() === "error") errs.push(m.text()); });
  await pg.goto(BASE + "/", { waitUntil: "networkidle" });
  await pg.waitForTimeout(2500);
  const info = await pg.evaluate(() => {
    const s = document.querySelector("#top");
    const h1 = document.querySelector("#hero-title");
    const cs = (el) => (el ? getComputedStyle(el) : null);
    const img = s.querySelector("img");
    const drift = s.querySelector(".hero-drift");
    const rise = s.querySelector(".hero-rise");
    const ping = s.querySelector(".hero-ping");
    const fade = s.querySelector(".hero-fade");
    return {
      h1: h1.innerText.replace(/\n/g, " / "),
      h1Font: cs(h1).fontFamily, h1Size: cs(h1).fontSize, h1Weight: cs(h1).fontWeight,
      bodyFont: cs(document.body).fontFamily, bodySize: cs(document.body).fontSize,
      imgSrc: img ? decodeURIComponent(img.currentSrc || img.src) : null,
      imgAlt: img?.alt,
      driftAnim: drift && cs(drift).animationName, driftDur: drift && cs(drift).animationDuration,
      riseAnim: rise && cs(rise).animationName,
      fadeAnim: fade && cs(fade).animationName,
      pingAnim: ping && cs(ping).animationName,
      tag: s.querySelector(".t-label.mt-0\\.5")?.innerText ?? null,
      reticleTagVisible: !!s.querySelector("[data-hero-reticle]") && getComputedStyle(s.querySelector("[data-hero-reticle]")).display !== "none",
      caption: [...s.querySelectorAll("p")].map((p) => p.innerText).filter((t) => /render|photograph/i.test(t)),
      fonts: [...document.fonts].filter((f) => f.status === "loaded").map((f) => f.family),
      textHasPhase: /phase/i.test(s.innerText),
    };
  });
  // does the image actually move over time?
  const t1 = await pg.evaluate(() => getComputedStyle(document.querySelector(".hero-drift")).transform);
  await pg.waitForTimeout(3000);
  const t2 = await pg.evaluate(() => getComputedStyle(document.querySelector(".hero-drift")).transform);
  info.driftMoves = t1 !== t2; info.t1 = t1; info.t2 = t2;
  info.failed = failed; info.consoleErrors = errs;
  R.hero[name] = info;
  await pg.screenshot({ path: `${OUT}/hero-${name}.png` });
  await c.close();
}

// banner motion on load: frame sequence at 0ms/400ms/1200ms
{
  const c = await ctx(1440, 900);
  const pg = await c.newPage();
  await pg.goto(BASE + "/", { waitUntil: "commit" });
  await pg.waitForTimeout(150);
  await pg.screenshot({ path: `${OUT}/hero-load-a.png` });
  await pg.waitForTimeout(500);
  await pg.screenshot({ path: `${OUT}/hero-load-b.png` });
  await pg.waitForTimeout(1500);
  await pg.screenshot({ path: `${OUT}/hero-load-c.png` });
  await c.close();
}
// reduced motion
{
  const c = await ctx(1440, 900, { reducedMotion: "reduce" });
  const pg = await c.newPage();
  await pg.goto(BASE + "/", { waitUntil: "networkidle" });
  R.hero.reduced = await pg.evaluate(() => ({
    drift: getComputedStyle(document.querySelector(".hero-drift")).animationName,
    ping: getComputedStyle(document.querySelector(".hero-ping")).animationName,
    h1Visible: document.querySelector("#hero-title").getBoundingClientRect().height > 0,
  }));
  await c.close();
}

// ---- 3. Font sizes across headings: desktop + mobile
R.type = {};
for (const [name, w, h] of [["desktop", 1440, 900], ["mobile", 390, 844]]) {
  const c = await ctx(w, h);
  const pg = await c.newPage();
  await pg.goto(BASE + "/", { waitUntil: "networkidle" });
  R.type[name] = await pg.evaluate(() => {
    const out = {};
    for (const sel of [".t-hero", ".t-xl", ".t-l", ".t-m", ".t-s", ".t-body-l", ".t-label", ".t-micro", ".t-xxl"]) {
      const el = document.querySelector(sel);
      if (el) { const s = getComputedStyle(el); out[sel] = `${s.fontFamily.split(",")[0]} ${s.fontSize} w${s.fontWeight}`; }
    }
    // any element still using a non-brand family?
    const bad = new Set();
    document.querySelectorAll("body *").forEach((el) => {
      const f = getComputedStyle(el).fontFamily.split(",")[0].replace(/["']/g, "").trim();
      if (!/manrope|inter|__manrope|__inter/i.test(f)) bad.add(f);
    });
    out.otherFamilies = [...bad];
    return out;
  });
  await c.close();
}

// ---- 4. Phases / status
{
  const c = await ctx(1440, 900);
  const pg = await c.newPage();
  await pg.goto(BASE + "/", { waitUntil: "networkidle" });
  R.status = await pg.evaluate(() => {
    const s = document.querySelector("#status");
    const items = [...s.querySelectorAll("[data-milestone]")].map((e) => e.innerText.replace(/\s+/g, " ").trim());
    return { items, header: s.querySelector("#status-title")?.innerText, body: s.innerText.slice(0, 600) };
  });
  await pg.locator("#status").scrollIntoViewIfNeeded();
  await pg.waitForTimeout(1500);
  await pg.locator("#status").screenshot({ path: `${OUT}/status-desktop.png` });
  await c.close();
}

// ---- 5. PATH Group
for (const [name, w, h] of [["desktop", 1440, 900], ["mobile", 390, 844]]) {
  const c = await ctx(w, h, name === "mobile" ? { isMobile: true, hasTouch: true } : {});
  const pg = await c.newPage();
  await pg.goto(BASE + "/path-group", { waitUntil: "networkidle" });
  // scroll through so counters/reveals finish
  const H = await pg.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < H; y += 500) { await pg.evaluate((y) => window.scrollTo(0, y), y); await pg.waitForTimeout(120); }
  await pg.waitForTimeout(2500);
  R["pathgroup_" + name] = await pg.evaluate(() => {
    const g = document.querySelector("#path-group") || document.body;
    const hl = document.querySelector("#highlight");
    const about = document.querySelector("#about");
    const v = document.querySelector("#verticals");
    const imgs = [...g.querySelectorAll("img")].map((i) => decodeURIComponent(i.currentSrc || i.src).replace(location.origin, "")).slice(0, 20);
    return {
      highlight: hl?.innerText.replace(/\s+/g, " ").trim(),
      aboutLen: about?.innerText.length, about: about?.innerText.replace(/\s+/g, " ").trim().slice(0, 1800),
      verticals: v ? [...v.querySelectorAll("h3,h4,li")].map((e) => e.innerText.replace(/\s+/g, " ").trim()).slice(0, 40) : null,
      verticalLinks: v ? [...v.querySelectorAll("a")].map((a) => a.href) : null,
      imgs,
      brokenImgs: [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.src),
      hasLegacyTimeline: /legacy/i.test(g.innerText),
      legacyText: [...g.querySelectorAll("p,h2,h3")].filter((e) => /legacy/i.test(e.innerText)).map((e) => e.innerText.slice(0, 120)),
      overflowX: document.documentElement.scrollWidth > innerWidth,
    };
  });
  await pg.screenshot({ path: `${OUT}/pathgroup-${name}-full.png`, fullPage: true });
  await c.close();
}

// image natural size of highway photo
{
  const c = await ctx(1440, 900);
  const pg = await c.newPage();
  const res = await pg.request.get(BASE + "/client/path-group/highway.webp");
  R.highwayBytes = (await res.body()).length;
  await pg.goto(BASE + "/", { waitUntil: "networkidle" });
  R.highwayNatural = await pg.evaluate(() => new Promise((r) => { const i = new Image(); i.onload = () => r([i.naturalWidth, i.naturalHeight]); i.src = "/client/path-group/highway.webp"; }));
  const w17 = await pg.request.get(BASE + "/client/warehouse-17.webp");
  R.warehouse17Status = w17.status();
  await c.close();
}

// ---- 6. Constra / availability
for (const [name, w, h] of [["desktop", 1440, 900], ["mobile", 390, 844]]) {
  const c = await ctx(w, h, name === "mobile" ? { isMobile: true, hasTouch: true } : {});
  const pg = await c.newPage();
  await pg.goto(BASE + "/", { waitUntil: "networkidle" });
  await pg.locator("#availability").scrollIntoViewIfNeeded();
  await pg.waitForTimeout(2000);
  R["constra_" + name] = await pg.evaluate(() => {
    const a = document.querySelector("#availability");
    return {
      text: a.innerText.replace(/\s+/g, " ").trim(),
      externalLinks: [...a.querySelectorAll("a")].map((x) => x.href),
      annotationsOffHidden: [...a.querySelectorAll(".slot-annotation")].every((e) => getComputedStyle(e).display === "none"),
      anyConstraHref: [...document.querySelectorAll("a")].filter((x) => /constra/i.test(x.href)).map((x) => x.href),
      anyConstraText: [...document.querySelectorAll("body *")].filter((e) => e.children.length === 0 && /constra/i.test(e.textContent)).map((e) => e.textContent.trim().slice(0, 80)).slice(0, 12),
    };
  });
  await pg.locator("#availability").screenshot({ path: `${OUT}/availability-${name}.png` });
  await c.close();
}
// annotations view
{
  const c = await ctx(1440, 900);
  const pg = await c.newPage();
  await pg.goto(BASE + "/?annotations=on", { waitUntil: "networkidle" });
  await pg.locator("#availability").scrollIntoViewIfNeeded();
  await pg.waitForTimeout(1500);
  R.constra_annotations = await pg.evaluate(() => document.querySelector("#availability").innerText.replace(/\s+/g, " ").trim());
  await pg.locator("#availability").screenshot({ path: `${OUT}/availability-annotations.png` });
  await c.close();
}

// ---- 7. Overflow / smoke on every page at 390 and 1440
R.overflow = {};
for (const w of [390, 1440]) {
  const c = await ctx(w, 900);
  for (const p of pages) {
    const pg = await c.newPage();
    const errs = [];
    pg.on("pageerror", (e) => errs.push(e.message));
    pg.on("console", (m) => m.type() === "error" && errs.push(m.text()));
    await pg.goto(BASE + p, { waitUntil: "networkidle" });
    R.overflow[`${p}@${w}`] = { overflow: await pg.evaluate(() => document.documentElement.scrollWidth > innerWidth), errs };
    await pg.close();
  }
  await c.close();
}

await browser.close();
fs.writeFileSync(path.join(OUT, "..", "audit.json"), JSON.stringify(R, null, 2));
console.log(JSON.stringify(R, null, 2));
