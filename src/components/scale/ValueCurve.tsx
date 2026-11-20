"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useInView } from "@/components/motion/hooks";

const VIOLET = "#795df5";
const VIOLET_SOFT = "#bcaeff";
/** How sharply value compounds: the curve is an exponential from the left screen edge to the right */
const GROWTH = 2.2;
/** Curve height at the left and right screen edges, as fractions of the zone height from the top */
const Y_START = 0.94;
const Y_END = 0.02;
const SAMPLES = 48;

type Layout = {
  w: number;
  h: number;
  /** Distance from the zone to the left and right screen edges */
  left: number;
  right: number;
  /** Left edge of each stage column, inside the zone */
  anchors: number[];
};

const round = (value: number) => Math.round(value * 100) / 100;

/**
 * The "business value" chart above the operating-model table: a curve that climbs from the left
 * screen edge, through a dot above each stage column, and out past the right edge, where it glows.
 * A light runs up the curve and flares as it leaves the screen. The zone is a three-column grid
 * on the table's columns; the curve is drawn in real pixels from its measured layout.
 */
export function ValueCurve({ className = "" }: { className?: string }) {
  const zoneRef = useRef<HTMLDivElement>(null);
  const anchorRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [layout, setLayout] = useState<Layout | null>(null);
  const inView = useInView(zoneRef, 0.2);
  const areaId = useId();
  const lineId = useId();
  const glowId = useId();

  useEffect(() => {
    const zone = zoneRef.current;
    if (!zone) return;
    const measure = () => {
      const rect = zone.getBoundingClientRect();
      const anchors = anchorRefs.current.map((anchor) =>
        anchor ? anchor.getBoundingClientRect().left - rect.left : 0,
      );
      const next: Layout = {
        w: rect.width,
        h: rect.height,
        left: rect.left,
        right: document.documentElement.clientWidth - rect.right,
        anchors,
      };
      setLayout((previous) =>
        previous &&
        previous.w === next.w &&
        previous.h === next.h &&
        previous.left === next.left &&
        previous.right === next.right &&
        previous.anchors.every((value, index) => value === next.anchors[index])
          ? previous
          : next,
      );
    };
    const observer = new ResizeObserver(measure);
    observer.observe(zone);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  let chart = null;
  if (layout && layout.w > 0) {
    const { w, h, left, right, anchors } = layout;
    const x0 = -left - 2;
    const x1 = w + right + 2;
    const yAt = (x: number) => {
      const t = (x - x0) / (x1 - x0);
      const grown = (Math.exp(GROWTH * t) - 1) / (Math.exp(GROWTH) - 1);
      return h * (Y_START - (Y_START - Y_END) * grown);
    };

    const points = Array.from({ length: SAMPLES + 1 }, (_, index) => {
      const x = x0 + ((x1 - x0) * index) / SAMPLES;
      return `${round(x)} ${round(yAt(x))}`;
    });
    const line = `M ${points.join(" L ")}`;
    const area = `${line} L ${round(x1)} ${round(h)} L ${round(x0)} ${round(h)} Z`;
    const endY = round(yAt(x1));
    const glowX = round(Math.min(140, Math.max(36, right * 0.8)));

    chart = (
      <svg
        aria-hidden
        width={w}
        height={h}
        viewBox={`0 0 ${w} ${h}`}
        className="pointer-events-none absolute inset-0 overflow-visible"
      >
        <defs>
          <linearGradient id={areaId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={VIOLET} stopOpacity={0.4} />
            <stop offset="1" stopColor={VIOLET} stopOpacity={0} />
          </linearGradient>
          <linearGradient id={lineId} gradientUnits="userSpaceOnUse" x1={x0} y1={0} x2={x1} y2={0}>
            <stop offset="0" stopColor={VIOLET_SOFT} stopOpacity={0.15} />
            <stop offset="0.45" stopColor={VIOLET} stopOpacity={0.9} />
            <stop offset="1" stopColor={VIOLET_SOFT} />
          </linearGradient>
          <radialGradient id={glowId}>
            <stop offset="0" stopColor={VIOLET_SOFT} stopOpacity={0.95} />
            <stop offset="0.35" stopColor={VIOLET} stopOpacity={0.5} />
            <stop offset="1" stopColor={VIOLET} stopOpacity={0} />
          </radialGradient>
        </defs>

        <path d={area} fill={`url(#${areaId})`} />

        {/* A drop line from each stage's dot to its column below */}
        {anchors.map((x, index) => (
          <line
            key={index}
            x1={round(x)}
            x2={round(x)}
            y1={round(yAt(x))}
            y2={h}
            stroke="#ffffff"
            strokeOpacity={0.18}
            strokeDasharray="2 4"
          />
        ))}

        <path d={line} fill="none" stroke={`url(#${lineId})`} strokeWidth={1.75} />

        {/* Centred on the right screen edge, so only its inner half shows */}
        <ellipse
          cx={round(x1 - 2)}
          cy={endY}
          rx={glowX}
          ry={round(glowX * 0.5)}
          fill={`url(#${glowId})`}
          opacity={0.45}
          className="motion-safe:animate-value-glow"
        />

        {/* The travelling light: two violet halos under a white core, all on the same dash */}
        <g strokeDasharray="14 200" strokeLinecap="round" fill="none">
          {[
            { stroke: VIOLET, opacity: 0.16, width: 14 },
            { stroke: VIOLET_SOFT, opacity: 0.4, width: 6 },
            { stroke: "#ffffff", opacity: 1, width: 2 },
          ].map((layer) => (
            <path
              key={layer.width}
              d={line}
              pathLength={100}
              stroke={layer.stroke}
              strokeOpacity={layer.opacity}
              strokeWidth={layer.width}
              className="motion-safe:animate-value-run motion-reduce:hidden"
            />
          ))}
        </g>

        {anchors.map((x, index) => (
          <g key={index}>
            <circle cx={round(x)} cy={round(yAt(x))} r={9} fill={VIOLET} fillOpacity={0.22} />
            <circle
              cx={round(x)}
              cy={round(yAt(x))}
              r={4}
              fill="#ffffff"
              stroke={VIOLET}
              strokeWidth={2}
            />
          </g>
        ))}
      </svg>
    );
  }

  return (
    <div ref={zoneRef} className={`relative grid grid-cols-3 ${inView ? "" : "motion-paused"} ${className}`}>
      {[0, 1, 2].map((index) => (
        <span
          key={index}
          ref={(element) => {
            anchorRefs.current[index] = element;
          }}
        />
      ))}
      {chart}
    </div>
  );
}
