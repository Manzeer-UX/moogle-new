"use client";

import { useEffect, useId, useRef, useState, type FocusEvent, type KeyboardEvent } from "react";
import { LuArrowRight, LuSparkles } from "react-icons/lu";
import { MarkTile } from "@/components/brand/MarkTile";
import { useInView, usePageVisible, useReducedMotion } from "@/components/motion/hooks";
import type { Industry } from "@/content/home";
import { INDUSTRY_ICONS, pad2 } from "./industryIcons";

/** How long each sector stays lit. Matches the 4s packet cycle (route-out / route-in in globals.css). */
const TOUR_MS = 4000;
/** Horizontal position of the AI core inside the fan-out zone (fraction of its width) */
const CORE_X = 0.4;
/** Data streams entering from the screen's left edge, as offsets from the core (fraction of the zone height) */
const INPUT_STREAMS = [-0.32, -0.16, 0, 0.16, 0.32];

const VIOLET = "#795df5";
const VIOLET_SOFT = "#bcaeff";

/** Zone size, plus its distance from the left and right edges of the screen (where the routes start and end) */
type Box = { w: number; h: number; left: number; right: number };

export type IndustryExplorerProps = {
  items: Industry[];
  useCasesLabel: string;
  cta: { label: string; href: string };
};

/**
 * Measures a zone so its connectors are drawn in real pixels. The window listener catches wide
 * screens, where the zone keeps its size but moves away from the screen edge.
 */
function useBox() {
  const ref = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState<Box | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const measure = () => {
      const rect = element.getBoundingClientRect();
      const right = document.documentElement.clientWidth - rect.right;
      setBox((previous) =>
        previous &&
        previous.w === rect.width &&
        previous.h === rect.height &&
        previous.left === rect.left &&
        previous.right === right
          ? previous
          : { w: rect.width, h: rect.height, left: rect.left, right },
      );
    };
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  return [ref, box] as const;
}

const round = (value: number) => Math.round(value * 100) / 100;

/** Vertical centre of row `index` when `count` equal rows fill `height` */
const rowCenter = (index: number, count: number, height: number) => ((index + 0.5) * height) / count;

/**
 * A short bright dash that travels the route, glowing: two widening violet halos under a white
 * core (layered strokes rather than a blur filter, which would vanish on the flat exit line).
 * All layers run the same dash-offset animation and mount together (keyed by the active
 * sector), so they stay in step.
 */
function Packet({ d, animation }: { d: string; animation: string }) {
  const dash = `motion-reduce:hidden ${animation}`;
  return (
    <g strokeDasharray="14 200" strokeLinecap="round" fill="none">
      <path d={d} pathLength={100} stroke={VIOLET} strokeOpacity={0.16} strokeWidth={14} className={dash} />
      <path d={d} pathLength={100} stroke={VIOLET_SOFT} strokeOpacity={0.4} strokeWidth={6} className={dash} />
      <path d={d} pathLength={100} stroke="#ffffff" strokeWidth={2} className={dash} />
    </g>
  );
}

/**
 * Left side of the flow: data streams run in from the screen edge to the AI core, and the core
 * fans out to every sector row. The active route is lit; a hovered row brightens its route.
 */
function FanOut({ box, count, active, hovered }: { box: Box; count: number; active: number; hovered: number | null }) {
  const routeGradient = useId();
  const streamGradient = useId();
  const { w, h, left } = box;
  const cx = w * CORE_X;
  const cy = h / 2;
  const span = w - cx;

  const routes = Array.from({ length: count }, (_, index) => {
    const y = rowCenter(index, count, h);
    return `M ${round(cx)} ${round(cy)} C ${round(cx + span * 0.55)} ${round(cy)}, ${round(cx + span * 0.45)} ${round(y)}, ${round(w)} ${round(y)}`;
  });

  // Streams run flat from just past the screen edge, then bend into the core
  const edge = -left - 2;
  const bend = Math.min(cx * 0.85, 190);
  const streams = INPUT_STREAMS.map((offset) => {
    const y = cy + offset * h;
    const x0 = cx - bend;
    return `M ${round(edge)} ${round(y)} L ${round(x0)} ${round(y)} C ${round(x0 + bend * 0.55)} ${round(y)}, ${round(cx - bend * 0.35)} ${round(cy)}, ${round(cx)} ${round(cy)}`;
  });

  return (
    <svg
      aria-hidden
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      className="pointer-events-none absolute inset-0 overflow-visible"
    >
      <defs>
        <linearGradient id={routeGradient} gradientUnits="userSpaceOnUse" x1={cx} y1={0} x2={w} y2={0}>
          <stop offset="0" stopColor={VIOLET} stopOpacity={0.25} />
          <stop offset="1" stopColor={VIOLET_SOFT} />
        </linearGradient>
        <linearGradient id={streamGradient} gradientUnits="userSpaceOnUse" x1={edge} y1={0} x2={cx} y2={0}>
          <stop offset="0" stopColor="#ffffff" stopOpacity={0.05} />
          <stop offset="0.6" stopColor="#ffffff" stopOpacity={0.1} />
          <stop offset="1" stopColor={VIOLET_SOFT} stopOpacity={0.45} />
        </linearGradient>
      </defs>

      {streams.map((d, index) => (
        <path key={index} d={d} fill="none" stroke={`url(#${streamGradient})`} strokeWidth={1} />
      ))}
      {streams.map((d, index) => (
        <path
          key={index}
          d={d}
          pathLength={100}
          fill="none"
          stroke="#ffffff"
          strokeOpacity={0.5}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeDasharray="6 200"
          className="motion-safe:animate-route-ambient motion-reduce:hidden"
          style={{ animationDelay: `${-index * 1.3}s` }}
        />
      ))}

      {routes.map((d, index) => (
        <path
          key={index}
          d={d}
          fill="none"
          strokeWidth={1}
          className={`transition-[stroke] duration-300 ${
            index === hovered && index !== active ? "stroke-white/35" : "stroke-white/[0.09]"
          }`}
        />
      ))}

      <g key={active} className="motion-safe:animate-fade-in">
        <path d={routes[active]} fill="none" stroke={`url(#${routeGradient})`} strokeWidth={1.5} />
        <Packet d={routes[active]} animation="motion-safe:animate-route-out" />
      </g>

      {routes.map((_, index) => (
        <circle
          key={index}
          cx={w}
          cy={rowCenter(index, count, h)}
          r={index === active ? 3.5 : 2.5}
          strokeWidth={1}
          className={`transition-colors duration-300 ${
            index === active ? "fill-violet stroke-violet-soft" : "fill-ink stroke-white/30"
          }`}
        />
      ))}
    </svg>
  );
}

/** Active sector row → detail card */
function FanIn({ box, count, active }: { box: Box; count: number; active: number }) {
  const gradientId = useId();
  const { w, h } = box;
  const y0 = rowCenter(active, count, h);
  const y1 = h / 2;
  const d = `M 0 ${round(y0)} C ${round(w * 0.5)} ${round(y0)}, ${round(w * 0.5)} ${round(y1)}, ${round(w)} ${round(y1)}`;

  return (
    <svg
      aria-hidden
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      className="pointer-events-none absolute inset-0 overflow-visible"
    >
      <defs>
        <linearGradient id={gradientId} gradientUnits="userSpaceOnUse" x1={0} y1={0} x2={w} y2={0}>
          <stop offset="0" stopColor={VIOLET_SOFT} />
          <stop offset="1" stopColor={VIOLET} />
        </linearGradient>
      </defs>
      <path
        d={d}
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth={1.5}
        className="motion-safe:transition-[d] motion-safe:duration-500 motion-safe:ease-out-soft"
      />
      <Packet key={active} d={d} animation="motion-safe:animate-route-in" />
      <circle
        cx={0}
        cy={0}
        r={3.5}
        strokeWidth={1}
        className="fill-violet stroke-violet-soft motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-out-soft"
        style={{ transform: `translate(0px, ${round(y0)}px)` }}
      />
      <circle cx={w} cy={y1} r={3.5} strokeWidth={1} className="fill-violet stroke-violet-soft" />
    </svg>
  );
}

/**
 * Card → right edge of the screen: the last leg of the packet's run. Where the line meets the
 * edge there is a soft glow that flares as each packet arrives. It is sized to the gap so it
 * never washes over the card on narrower screens.
 */
function ExitRoute({ gap, active }: { gap: number; active: number }) {
  const gradientId = useId();
  const glowId = useId();
  const length = round(gap + 2);
  const d = `M 0 0 L ${length} 0`;
  const glowX = round(Math.min(130, Math.max(28, gap * 0.85)));
  const glowY = round(glowX * 0.45);

  return (
    <svg
      aria-hidden
      width={length}
      height={1}
      viewBox={`0 -0.5 ${length} 1`}
      className="pointer-events-none absolute top-1/2 left-full overflow-visible"
    >
      <defs>
        <linearGradient id={gradientId} gradientUnits="userSpaceOnUse" x1={0} y1={0} x2={length} y2={0}>
          <stop offset="0" stopColor={VIOLET} stopOpacity={0.9} />
          <stop offset="1" stopColor={VIOLET_SOFT} stopOpacity={0.6} />
        </linearGradient>
        <radialGradient id={glowId}>
          <stop offset="0" stopColor={VIOLET_SOFT} stopOpacity={0.95} />
          <stop offset="0.35" stopColor={VIOLET} stopOpacity={0.5} />
          <stop offset="1" stopColor={VIOLET} stopOpacity={0} />
        </radialGradient>
      </defs>
      <path d={d} fill="none" stroke={`url(#${gradientId})`} strokeWidth={1.5} />
      {/* Centred on the screen edge, so only its inner half shows */}
      <ellipse
        key={`glow-${active}`}
        cx={length}
        cy={0}
        rx={glowX}
        ry={glowY}
        fill={`url(#${glowId})`}
        opacity={0.45}
        className="motion-safe:animate-edge-glow"
      />
      <Packet key={active} d={d} animation="motion-safe:animate-route-exit" />
      <circle cx={0} cy={0} r={3.5} strokeWidth={1} className="fill-violet stroke-violet-soft" />
    </svg>
  );
}

/**
 * Desktop industries explorer: a full-bleed band drawn as one pipeline across the screen. Data
 * streams in from the left edge to the AI core, the core fans out to every sector, and the
 * selected sector routes into its detail card and on to the right edge. Each packet run goes
 * core → sector → card → edge. Text and cards stay on the page container; only the band and its
 * lines run edge to edge.
 *
 * The lit route moves from sector to sector on its own: each sector gets one packet run (core →
 * sector → card), then the next one lights up. Picking a sector jumps the tour there. It pauses
 * while the pointer is on the sector list or the card, for keyboard focus, off-screen and in
 * background tabs, and stays off for reduced motion.
 */
export function IndustryFlow({ items, useCasesLabel, cta }: IndustryExplorerProps) {
  const uid = useId();
  const [active, setActive] = useState(0);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  /** Pointer over the sector list or the card */
  const [pointerOver, setPointerOver] = useState(false);
  /** Keyboard focus inside the diagram (mouse clicks don't count, so the tour carries on after one) */
  const [keyboardFocus, setKeyboardFocus] = useState(false);

  const stageRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [fanOutRef, fanOutBox] = useBox();
  const [fanInRef, fanInBox] = useBox();
  const [panelRef, panelBox] = useBox();

  const reducedMotion = useReducedMotion();
  const pageVisible = usePageVisible();
  const inView = useInView(stageRef);

  const count = items.length;
  const tourRunning = !reducedMotion && inView && pageVisible && !pointerOver && !keyboardFocus;

  // Each sector gets the full dwell time; a pick or a pause restarts it for the current sector.
  useEffect(() => {
    if (!tourRunning) return;
    const timer = window.setTimeout(() => setActive((index) => (index + 1) % count), TOUR_MS);
    return () => window.clearTimeout(timer);
  }, [tourRunning, active, count]);

  const current = items[active];
  const CurrentIcon = INDUSTRY_ICONS[current.id] ?? LuSparkles;
  const tabId = (id: string) => `${uid}-tab-${id}`;
  const panelId = `${uid}-panel`;

  const choose = (index: number) => setActive(index);

  const onTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const last = count - 1;
    const keys: Record<string, number> = {
      ArrowDown: active === last ? 0 : active + 1,
      ArrowRight: active === last ? 0 : active + 1,
      ArrowUp: active === 0 ? last : active - 1,
      ArrowLeft: active === 0 ? last : active - 1,
      Home: 0,
      End: last,
    };
    if (!(event.key in keys)) return;
    event.preventDefault();
    const next = keys[event.key];
    choose(next);
    tabRefs.current[next]?.focus();
  };

  const onBodyFocus = (event: FocusEvent<HTMLDivElement>) => {
    if (event.target.matches(":focus-visible")) setKeyboardFocus(true);
  };

  const onBodyBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setKeyboardFocus(false);
  };

  const pointerHandlers = {
    onMouseEnter: () => setPointerOver(true),
    onMouseLeave: () => setPointerOver(false),
  };

  return (
    <div
      ref={stageRef}
      className="relative isolate hidden overflow-hidden border-y border-white/10 bg-white/[0.02] lg:block"
    >
      <div className="mx-auto max-w-[78rem] px-8">
        <div
          className="grid grid-cols-[minmax(0,1fr)_18.5rem_4.5rem_21.5rem] py-10 xl:grid-cols-[minmax(0,1fr)_19.5rem_6rem_23.5rem] xl:py-12"
          onFocus={onBodyFocus}
          onBlur={onBodyBlur}
        >
          {/* Input streams + AI core + fan-out */}
          <div ref={fanOutRef} className="relative z-10">
            {fanOutBox && fanOutBox.w > 0 && (
              <FanOut box={fanOutBox} count={count} active={active} hovered={hoveredRow} />
            )}
            <div
              aria-hidden
              className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${CORE_X * 100}%` }}
            >
              <span className="absolute -inset-10 rounded-full bg-violet/30 blur-2xl" />
              <MarkTile className="size-14" />
            </div>
          </div>

          <div
            role="tablist"
            aria-orientation="vertical"
            aria-label="Industries"
            className="relative grid overflow-hidden rounded-md bg-ink/85 ring-1 ring-white/12"
            style={{ gridTemplateRows: `repeat(${count}, minmax(3.25rem, 1fr))` }}
            onMouseEnter={pointerHandlers.onMouseEnter}
            onMouseLeave={() => {
              setPointerOver(false);
              setHoveredRow(null);
            }}
          >
            {items.map((item, index) => {
              const selected = index === active;
              const Icon = INDUSTRY_ICONS[item.id] ?? LuSparkles;
              return (
                <button
                  key={item.id}
                  ref={(element) => {
                    tabRefs.current[index] = element;
                  }}
                  id={tabId(item.id)}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls={panelId}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => choose(index)}
                  onKeyDown={onTabKeyDown}
                  onMouseEnter={() => setHoveredRow(index)}
                  className={`group relative flex items-center gap-3 border-b border-white/[0.07] px-4 text-left transition-colors duration-300 last:border-b-0 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-violet-soft ${
                    selected ? "bg-white/[0.07] text-white" : "text-white/70 hover:bg-white/[0.04] hover:text-white"
                  }`}
                >
                  <span
                    aria-hidden
                    className={`absolute inset-y-2.5 left-0 w-0.5 rounded-full bg-violet-soft transition-opacity duration-300 ${
                      selected ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  <span
                    className={`flex size-8 shrink-0 items-center justify-center rounded-sm transition-[color,background-color,box-shadow] duration-300 ${
                      selected ? "bevel-violet" : "bevel-dark group-hover:bg-white/[0.1]"
                    }`}
                  >
                    <Icon aria-hidden className="size-4" />
                  </span>
                  <span className="flex-1 text-[0.9375rem] leading-snug font-medium">{item.name}</span>
                  <span aria-hidden className="text-[0.75rem] text-white/40 tabular-nums">
                    {pad2(index + 1)}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active row → card */}
          <div ref={fanInRef} className="relative z-10">
            {fanInBox && fanInBox.w > 0 && <FanIn box={fanInBox} count={count} active={active} />}
          </div>

          <div
            ref={panelRef}
            id={panelId}
            role="tabpanel"
            aria-labelledby={tabId(current.id)}
            className="relative self-center"
            {...pointerHandlers}
          >
            <div className="rounded-lg bg-white/[0.08] p-1.5 shadow-[0_30px_70px_-30px_rgb(0_0_0/0.85)] ring-1 ring-white/15 backdrop-blur-[6px]">
              <div className="overflow-hidden rounded-xs bg-surface ring-1 ring-ink/[0.06]">
                <div key={current.id} className="motion-safe:animate-swap-in">
                  <div className="flex items-center gap-3.5 px-5 pt-5 pb-4">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-sm bevel-violet">
                      <CurrentIcon aria-hidden className="size-[1.15rem]" />
                    </span>
                    <h3 className="type-card-title text-ink">{current.name}</h3>
                  </div>
                  <div className="border-t border-line-soft px-5 pt-4 pb-5">
                    <p className="text-[0.8125rem] text-slate">{useCasesLabel}</p>
                    <ul className="mt-3 space-y-2.5">
                      {current.useCases.map((useCase) => (
                        <li
                          key={useCase}
                          className="flex items-center gap-3 text-[0.9375rem] leading-snug text-ink-soft"
                        >
                          <span aria-hidden className="size-1.5 shrink-0 rounded-xs bg-violet" />
                          {useCase}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="border-t border-line-soft px-5 py-3.5">
                  <a
                    href={cta.href}
                    className="group inline-flex items-center gap-2 text-[0.9375rem] font-medium text-violet-strong transition-colors duration-200 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet"
                  >
                    {cta.label}
                    <LuArrowRight
                      aria-hidden
                      className="size-4 transition-transform duration-300 ease-out-soft group-hover:translate-x-0.5"
                    />
                  </a>
                </div>
              </div>
            </div>
            {/* After the card so its port dot sits on top of the bezel */}
            {panelBox && panelBox.right > 0 && <ExitRoute gap={panelBox.right} active={active} />}
          </div>
        </div>
      </div>
    </div>
  );
}
