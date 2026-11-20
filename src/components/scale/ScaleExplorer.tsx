"use client";

import { useEffect, useId, useRef, useState, type FocusEvent, type KeyboardEvent } from "react";
import { LuArrowDown, LuArrowUp } from "react-icons/lu";
import WebThreads from "@/components/backgrounds/WebThreads";
import { useInView, usePageVisible, useReducedMotion } from "@/components/motion/hooks";
import type { Foundation, ScaleStage } from "@/content/home";

/** How long each stage stays lit before the next takes over */
const TOUR_MS = 5000;

/** The weave's threads, first to last: one per foundation */
const THREAD_COLORS = ["#bcaeff", "#795df5", "#8a70f7", "#a996fb"];
/**
 * How much wider each next thread swings (WebThreads' taper). This large, the first thread is
 * all but straight: the spine the stage stations sit on, with the other four evenly spaced out.
 */
const TAPER = 8;
/** Gap kept between the weave and the heading and lead paragraph (px) */
const CLEARANCE = 28;
/** How far the lower edge of the weave climbs on its way across (radians) */
const BASE_RISE = (1.5 * Math.PI) / 180;
/** How far above the band's base the threads pinch (px), from lg and below it */
const PINCH_LIFT = { wide: 76, narrow: 44 };
/** Steepest the weave's upper edge may climb (rise over run), which keeps it under the "Business value" label */
const MAX_TOP_SLOPE = 0.45;
/** Most canvas pixels the weave may shade per frame; wide screens draw at a lower pixel ratio to stay under it */
const PIXEL_BUDGET = 2.6e6;
/** The zone the weave is drawn in overhangs the heading-and-band block by this much (px): -top-16, -bottom-24 */
const ZONE_ABOVE = 64;

/** The foundations row deepens stage by stage: the foundations compound */
const ROW_TONE = ["bg-violet/0", "bg-violet/[0.09]", "bg-violet/[0.2]"];
/** Hairlines of the outlined grid, in the primary palette */
const HAIRLINE = "border-violet-soft/15";

type Point = { x: number; y: number };

/** The weave in the zone's own pixels, plus the same shape as WebThreads props */
type Geometry = {
  w: number;
  h: number;
  /** Where the threads converge: the first use case */
  pinch: Point;
  /** Slope of the weave's upper edge (rise over run) */
  topSlope: number;
  /** One station per stage on the spine; empty while the stage tabs are hidden */
  stations: Point[];
  /** Where the band ends and the stage tabs begin */
  floor: number;
  threads: { pinch: number; position: number; angle: number; spread: number };
};

const round = (value: number) => Math.round(value * 100) / 100;

/** Right and bottom edges of an element's text lines (its box is wider than the lines when they wrap) */
function textExtent(element: Element) {
  const range = document.createRange();
  range.selectNodeContents(element);
  let right = -Infinity;
  let bottom = -Infinity;
  for (const rect of range.getClientRects()) {
    right = Math.max(right, rect.right);
    bottom = Math.max(bottom, rect.bottom);
  }
  return { right, bottom };
}

const sameGeometry = (a: Geometry, b: Geometry) =>
  a.w === b.w &&
  a.h === b.h &&
  a.floor === b.floor &&
  a.pinch.x === b.pinch.x &&
  a.pinch.y === b.pinch.y &&
  a.topSlope === b.topSlope &&
  a.stations.length === b.stations.length &&
  a.stations.every((station, index) => station.x === b.stations[index].x);

export type ScaleExplorerProps = {
  /** id for the heading, which labels the section */
  titleId: string;
  eyebrow: string;
  heading: { lead: string; accent: string };
  description: string;
  valueLabel: string;
  foundationsLabel: string;
  stages: ScaleStage[];
  foundations: Foundation[];
};

/**
 * The operating-model heading, graphic and stage explorer.
 *
 * A weave of threads (one per foundation) runs across the whole screen: a single strand comes in
 * from the left edge, pinches at the first use case, then fans out and climbs to the right edge.
 * The heading and lead paragraph sit in the open corner above the pinch; the weave is sized from
 * their measured text so it always clears them, and opens as wide as that allows.
 *
 * From lg the three stages are stations on the weave's spine, each dropping a line onto its cell
 * in the outlined box below: three stages over five foundations, hairlines between (the grid
 * system of the Testimonials, Why and Delivery sections). The lit stage moves along on its own
 * and loops; picking one jumps there. The foundations row shows the lit stage's five values and
 * deepens in tone stage by stage. The tour pauses under the pointer, for keyboard focus, off
 * screen and in background tabs, and stays off for reduced motion. Below lg the section lists
 * the stages one under another instead (see OperatingModelSection).
 */
export function ScaleExplorer({
  titleId,
  eyebrow,
  heading,
  description,
  valueLabel,
  foundationsLabel,
  stages,
  foundations,
}: ScaleExplorerProps) {
  const uid = useId();
  const [active, setActive] = useState(0);
  const [pointerOver, setPointerOver] = useState(false);
  const [keyboardFocus, setKeyboardFocus] = useState(false);
  const [geometry, setGeometry] = useState<Geometry | null>(null);

  const rootRef = useRef<HTMLDivElement>(null);
  const zoneRef = useRef<HTMLDivElement>(null);
  const bandRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const leadRef = useRef<HTMLParagraphElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const reducedMotion = useReducedMotion();
  const pageVisible = usePageVisible();
  const inView = useInView(rootRef, 0.35);

  const count = stages.length;
  const last = count - 1;
  const threadCount = foundations.length;
  const tourRunning = !reducedMotion && inView && pageVisible && !pointerOver && !keyboardFocus;

  useEffect(() => {
    if (!tourRunning) return;
    const timer = window.setTimeout(() => setActive((index) => (index + 1) % count), TOUR_MS);
    return () => window.clearTimeout(timer);
  }, [tourRunning, active, count]);

  useEffect(() => {
    const zone = zoneRef.current;
    const band = bandRef.current;
    const title = headingRef.current;
    const lead = leadRef.current;
    if (!zone || !band || !title || !lead) return;

    const measure = () => {
      const zoneRect = zone.getBoundingClientRect();
      const w = zoneRect.width;
      const h = zoneRect.height;
      if (w === 0 || h === 0) return;

      const wide = window.matchMedia("(min-width: 64rem)").matches;
      const floor = round(band.getBoundingClientRect().bottom - zoneRect.top);
      const pinch = {
        x: round(lead.getBoundingClientRect().left - zoneRect.left),
        y: round(floor - (wide ? PINCH_LIFT.wide : PINCH_LIFT.narrow)),
      };

      // The upper edge may climb until it meets the top of the heading at the right screen edge,
      // and must pass under the lower right corner of the heading and of the lead paragraph
      const limits = [(pinch.y - ZONE_ABOVE) / (w - pinch.x)];
      for (const element of [title, lead]) {
        const text = textExtent(element);
        const run = text.right - zoneRect.left + CLEARANCE - pinch.x;
        if (run > 0) limits.push((pinch.y - (text.bottom - zoneRect.top) - CLEARANCE) / run);
      }
      const topAngle = Math.atan(Math.max(0.08, Math.min(MAX_TOP_SLOPE, ...limits)));
      // The weave opens by `half` either side of a spine that climbs at `tilt`
      const half = (topAngle - BASE_RISE) / 2;
      const tilt = half + BASE_RISE;

      // The same point and angles in WebThreads' own space: rotated about the canvas centre, in
      // units of the canvas height, with its x axis squeezed back to 0..1
      const aspect = w / h;
      const qx = (pinch.x - w / 2) / h;
      const qy = (h / 2 - pinch.y) / h;
      const cos = Math.cos(tilt);
      const sin = Math.sin(tilt);
      const threads = {
        pinch: (qx * cos + qy * sin) / aspect + 0.5,
        position: -qx * sin + qy * cos + 0.5,
        angle: (tilt * 180) / Math.PI,
        spread: (Math.tan(half) * aspect) / (1 + (threadCount - 1) * TAPER),
      };

      const slope = Math.tan(tilt);
      const stations = tabRefs.current
        .filter((tab): tab is HTMLButtonElement => tab !== null && tab.offsetParent !== null)
        .map((tab) => {
          // Half a pixel in: the centre of the cell's left hairline, which the drop line runs into
          const x = round(tab.getBoundingClientRect().left - zoneRect.left + 0.5);
          return { x, y: round(pinch.y - (x - pinch.x) * slope) };
        });

      const next: Geometry = { w, h, pinch, topSlope: Math.tan(topAngle), stations, floor, threads };
      setGeometry((previous) => (previous && sameGeometry(previous, next) ? previous : next));
    };

    const observer = new ResizeObserver(measure);
    observer.observe(zone);
    observer.observe(title);
    observer.observe(lead);
    window.addEventListener("resize", measure);
    // The text's extent shifts once the webfont arrives
    let live = true;
    document.fonts.ready.then(() => {
      if (live) measure();
    });
    return () => {
      live = false;
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [threadCount]);

  const tabId = (index: number) => `${uid}-tab-${index}`;
  const panelId = `${uid}-panel`;

  const onTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const keys: Record<string, number> = {
      ArrowRight: active === last ? 0 : active + 1,
      ArrowLeft: active === 0 ? last : active - 1,
      Home: 0,
      End: last,
    };
    if (!(event.key in keys)) return;
    event.preventDefault();
    const next = keys[event.key];
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  const onFocus = (event: FocusEvent<HTMLDivElement>) => {
    if (event.target.matches(":focus-visible")) setKeyboardFocus(true);
  };

  const onBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setKeyboardFocus(false);
  };

  const hover = {
    onMouseEnter: () => setPointerOver(true),
    onMouseLeave: () => setPointerOver(false),
  };

  return (
    <div ref={rootRef} onFocus={onFocus} onBlur={onBlur}>
      <div className="relative">
        {/*
         * The weave runs edge to edge. Its zone overhangs this block (above, so the canvas has no
         * visible edge beside the heading; below, so the strand coming in from the left has room)
         * and fades out over both overhangs.
         */}
        <div
          ref={zoneRef}
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-16 -bottom-24 [mask-image:linear-gradient(to_bottom,transparent,black_4rem,black_calc(100%-6rem),transparent)]"
        >
          {geometry && (
            <>
              <WebThreads
                colors={THREAD_COLORS}
                coreColor="#ffffff"
                threadCount={threadCount}
                taper={TAPER}
                pinch={geometry.threads.pinch}
                position={geometry.threads.position}
                angle={geometry.threads.angle}
                spread={geometry.threads.spread}
                frequency={5}
                speed={0.16}
                thickness={1}
                glow={0.016}
                falloff={0.66}
                brightness={0.6}
                depth={0.5}
                grain={0.04}
                pulseOnClick={false}
                mouseStrength={0.4}
                dpr={Math.min(2, Math.sqrt(PIXEL_BUDGET / (geometry.w * geometry.h)))}
              />
              <Stations geometry={geometry} active={active} />
            </>
          )}
        </div>

        <div className="relative mx-auto max-w-[78rem] px-5 sm:px-8">
          <p className="flex items-center gap-2.5 text-[0.9375rem] font-medium text-violet-soft">
            <span aria-hidden className="size-1.5 rounded-xs bg-violet-soft" />
            {eyebrow}
          </p>
          <div className="@container mt-6 max-w-[52rem]">
            <h2 ref={headingRef} id={titleId} className="type-section text-white">
              {heading.lead} <span className="text-violet-soft">{heading.accent}</span>
            </h2>
          </div>
        </div>

        <div ref={bandRef} className="relative mt-7 lg:mt-8 lg:h-[24rem]">
          <div className="relative mx-auto h-full max-w-[78rem] px-5 sm:px-8">
            <p ref={leadRef} className="type-lead max-w-[31rem] text-violet-soft/80">
              {description}
            </p>
            {/* Below lg the band has no fixed height: this is the weave's room under the text */}
            <div className="h-52 sm:h-60 lg:hidden" />
            {/* Sits just above the pinch (PINCH_LIFT from the band's base), clear of the weave's upper edge */}
            <p className="absolute bottom-[7.25rem] flex items-center gap-1.5 text-[0.8125rem] text-violet-soft/75 lg:bottom-[9.25rem]">
              {valueLabel}
              <LuArrowUp aria-hidden className="size-3.5 text-violet-soft" />
            </p>
          </div>
        </div>
      </div>

      <div className="relative mx-auto hidden max-w-[78rem] px-8 lg:block">
        {/* One outlined box, three stages over five foundations; each station's drop line lands on its stage's left hairline */}
        <div className="border border-violet-soft/20">
          <div
            role="tablist"
            aria-label="Operating model stages"
            className="grid"
            style={{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }}
            {...hover}
          >
            {stages.map((stage, index) => {
              const selected = index === active;
              return (
                <button
                  key={stage.number}
                  ref={(element) => {
                    tabRefs.current[index] = element;
                  }}
                  id={tabId(index)}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls={panelId}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActive(index)}
                  onKeyDown={onTabKeyDown}
                  className={`group relative flex cursor-pointer flex-col items-start px-6 pt-7 pb-8 text-left transition-colors duration-500 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-violet-soft xl:px-8 ${HAIRLINE} ${
                    index > 0 ? "border-l" : ""
                  } ${selected ? "bg-violet/[0.16]" : "hover:bg-violet-soft/[0.06]"}`}
                >
                  {/* A light glides along the top of the lit stage */}
                  <span
                    aria-hidden
                    className={`absolute -top-px right-0 -left-px h-px origin-left bg-violet-soft transition-transform duration-700 ease-out-soft motion-reduce:transition-none ${
                      selected ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
                  <span
                    className={`text-[0.8125rem] tabular-nums transition-colors duration-300 ${
                      selected ? "text-violet-soft" : "text-violet-soft/50"
                    }`}
                  >
                    Stage {stage.number}
                  </span>
                  <span
                    className={`mt-2 text-[1.375rem] leading-tight font-[560] tracking-[-0.015em] transition-colors duration-300 [font-stretch:108%] ${
                      selected ? "text-white" : "text-violet-soft/55 group-hover:text-violet-soft"
                    }`}
                  >
                    {stage.name}
                  </span>
                  <span
                    className={`mt-2.5 max-w-[20rem] text-[0.875rem] leading-relaxed transition-colors duration-300 ${
                      selected ? "text-violet-soft/85" : "text-violet-soft/45 group-hover:text-violet-soft/70"
                    }`}
                  >
                    {stage.description}
                  </span>
                </button>
              );
            })}
          </div>

          <div
            id={panelId}
            role="tabpanel"
            aria-labelledby={tabId(active)}
            className={`border-t transition-colors duration-700 ${HAIRLINE} ${ROW_TONE[active] ?? ROW_TONE[0]}`}
            {...hover}
          >
            <p className={`flex items-center gap-1.5 border-b px-6 py-3.5 text-[0.8125rem] text-violet-soft/75 xl:px-8 ${HAIRLINE}`}>
              {foundationsLabel}
              <LuArrowDown aria-hidden className="size-3.5 text-violet-soft" />
            </p>

            <dl className="grid" style={{ gridTemplateColumns: `repeat(${foundations.length}, minmax(0, 1fr))` }}>
              {foundations.map((foundation, index) => (
                <div
                  key={foundation.name}
                  className={`group relative grid grid-rows-[auto_auto_1fr] px-6 pt-7 pb-8 transition-colors duration-500 hover:bg-violet-soft/[0.07] xl:px-8 ${HAIRLINE} ${
                    index > 0 ? "border-l" : ""
                  }`}
                >
                  <span
                    aria-hidden
                    className="absolute -top-px right-0 -left-px h-px origin-left scale-x-0 bg-violet-soft transition-transform duration-500 ease-out-soft group-hover:scale-x-100 motion-reduce:transition-none"
                  />
                  {/* One square per stage reached */}
                  <span aria-hidden className="flex gap-1">
                    {stages.map((step, stepIndex) => (
                      <span
                        key={step.number}
                        className={`size-1.5 rounded-xs transition-colors duration-500 ${
                          stepIndex <= active ? "bg-violet-soft" : "bg-violet-soft/20"
                        }`}
                      />
                    ))}
                  </span>
                  <dt className="mt-6 text-[0.8125rem] text-violet-soft/80">{foundation.name}</dt>
                  {/* The three stages' values share one cell; only the lit stage's shows */}
                  {foundation.stages.map((value, stageIndex) => {
                    const selected = stageIndex === active;
                    return (
                      <dd
                        key={stageIndex}
                        aria-hidden={!selected}
                        className={`col-start-1 row-start-3 mt-1.5 text-[1.0625rem] leading-snug font-medium text-pretty text-white transition-[opacity,translate,visibility] duration-500 ease-out-soft motion-reduce:transition-none xl:text-[1.125rem] ${
                          selected ? "visible translate-y-0 opacity-100" : "invisible translate-y-1.5 opacity-0"
                        }`}
                        style={{ transitionDelay: selected ? `${index * 55}ms` : "0ms" }}
                      >
                        {value}
                      </dd>
                    );
                  })}
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

/** A station per stage where it meets the weave's spine, each with a drop line to its tab */
function Stations({ geometry, active }: { geometry: Geometry; active: number }) {
  const { w, h, stations, floor } = geometry;
  if (stations.length === 0) return null;

  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      className="pointer-events-none absolute inset-0 overflow-visible"
    >
      {stations.map((station, index) => {
        const selected = index === active;
        // Stages already reached stay lit; the ones ahead are hollow
        const reached = index < active;
        return (
          <g key={index}>
            <line
              x1={station.x}
              x2={station.x}
              y1={station.y}
              y2={floor}
              stroke="#bcaeff"
              strokeOpacity={selected ? 0.8 : 0.28}
              strokeDasharray="2 4"
              className="transition-[stroke-opacity] duration-500"
            />
            <circle
              cx={station.x}
              cy={station.y}
              r={selected ? 14 : 8}
              fill="#795df5"
              fillOpacity={selected ? 0.4 : 0.22}
              className="transition-[r,fill-opacity] duration-500"
            />
            <circle
              cx={station.x}
              cy={station.y}
              r={selected ? 5 : 3.5}
              fill={selected ? "#ffffff" : reached ? "#bcaeff" : "#0f1033"}
              stroke={selected ? "#795df5" : reached ? "#0f1033" : "#bcaeff"}
              strokeWidth={selected ? 2.5 : 1.5}
              className="transition-[r,fill,stroke] duration-500"
            />
          </g>
        );
      })}
    </svg>
  );
}
