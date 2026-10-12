"use client";

import { useRef } from "react";
import { gsap, MQ } from "@/lib/motion/gsap";
import { useMotion } from "@/lib/motion/hooks";

const W = 1600;
const H = 900;
const CX = 800;
const CY = 450;

/** Deterministic routes converging from every edge onto one hub. */
const ROUTES = (() => {
  const pts: [number, number][] = [];
  for (let i = 0; i < 7; i++) pts.push([90 + i * 236, -10]);
  for (let i = 0; i < 7; i++) pts.push([150 + i * 220, H + 10]);
  for (let i = 0; i < 4; i++) pts.push([-10, 110 + i * 230]);
  for (let i = 0; i < 4; i++) pts.push([W + 10, 160 + i * 200]);
  return pts.map(([x, y], i) => {
    const bend = ((i * 37) % 11) / 11 - 0.5;
    const mx = (x + CX) / 2 + (CY - y) * bend * 0.35;
    const my = (y + CY) / 2 + (x - CX) * bend * 0.35;
    // stop short of the hub so the type has air
    const ang = Math.atan2(CY - my, CX - mx);
    const ex = CX - Math.cos(ang) * 46;
    const ey = CY - Math.sin(ang) * 46;
    const tone = i % 9 === 0 ? "y" : i % 3 === 0 ? "i" : "p";
    return { d: `M ${x} ${y} Q ${mx.toFixed(1)} ${my.toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}`, tone };
  });
})();

/** §06a — ONE HUB. EVERY ROUTE. */
export function HubOpener() {
  const ref = useRef<HTMLElement>(null);

  useMotion(ref, (mm) => {
    const q = gsap.utils.selector(ref);
    mm.add(MQ.desktop, () => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: ref.current, start: "top 85%", end: "center 45%", scrub: 0.6 } });
      tl.from(q("[data-hub-route]"), { strokeDashoffset: 1, ease: "none", stagger: { each: 0.02, from: "random" }, duration: 0.7 }, 0)
        .from(q("[data-hub-node]"), { scale: 0, opacity: 0, transformOrigin: "50% 50%", duration: 0.2 }, 0.62)
        .from(q("[data-hub-type]"), { opacity: 0, y: (i) => (i === 0 ? 30 : -30), duration: 0.3 }, 0.55);
    });
    mm.add(MQ.mobile, () => {
      gsap.from(q("[data-hub-route]"), {
        strokeDashoffset: 1,
        duration: 1.6,
        ease: "power2.inOut",
        stagger: { each: 0.03, from: "random" },
        scrollTrigger: { trigger: ref.current, start: "top 70%", once: true },
      });
    });
  });

  return (
    <section ref={ref} id="advantage" data-stage="understand" aria-labelledby="advantage-title" className="relative flex min-h-[86svh] items-center overflow-hidden bg-ink lg:min-h-[110vh]">
      <svg aria-hidden className="absolute inset-0 h-full w-full" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" fill="none">
        {ROUTES.map((r, i) => (
          <path
            key={i}
            data-hub-route
            d={r.d}
            pathLength={1}
            strokeDasharray="1 1"
            stroke={r.tone === "y" ? "var(--color-yellow-400)" : r.tone === "i" ? "rgb(147 187 230 / 0.55)" : "rgb(243 239 230 / 0.28)"}
            strokeWidth={r.tone === "y" ? 1.6 : 1.1}
            className={i >= 12 ? "max-lg:hidden" : ""}
          />
        ))}
        <g data-hub-node>
          <circle cx={CX} cy={CY} r="34" stroke="var(--color-yellow-400)" strokeOpacity="0.5" />
          <circle cx={CX} cy={CY} r="20" stroke="var(--color-yellow-400)" />
          <circle cx={CX} cy={CY} r="5" fill="var(--color-yellow-400)" />
          <path d={`M ${CX} ${CY - 48} V ${CY - 26} M ${CX} ${CY + 26} V ${CY + 48} M ${CX - 48} ${CY} H ${CX - 26} M ${CX + 26} ${CY} H ${CX + 48}`} stroke="var(--color-yellow-400)" />
        </g>
      </svg>
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_0%,transparent_30%,rgb(4_8_26/0.75)_80%)]" />

      <div className="shell absolute inset-x-0 top-14 lg:top-20">
        <p className="t-label">
          <span className="text-yellow-400">06 /</span> The Logicity Advantage
        </p>
      </div>
      <div className="shell relative w-full text-center">
        <h2 id="advantage-title" className="t-xl">
          <span data-hub-type className="block">One hub.</span>
          <span aria-hidden className="block h-[clamp(90px,16vh,170px)]" />
          <span data-hub-type className="block">Every route.</span>
        </h2>
      </div>
    </section>
  );
}
