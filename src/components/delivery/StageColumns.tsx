"use client";

import { useEffect, useId, useRef, useState, type FocusEvent } from "react";
import { LuShieldCheck } from "react-icons/lu";
import { useInView, usePageVisible, useReducedMotion } from "@/components/motion/hooks";
import { STAGE_TERM_CLASS, SolvesLinks, type StageExplorerProps } from "./StageFacts";

/** How long each stage stays open on its own */
const TOUR_MS = 6000;
/** A hovered column waits this long before opening, so sweeping the pointer across doesn't flick through them */
const HOVER_MS = 160;
/** How much wider than a closed column the open one grows */
const OPEN_GROW = 8;

/**
 * Desktop delivery stages: seven columns in one outlined box. Closed, a column shows its number up
 * top and its name and time frame running up from the base; the open one widens like a curtain onto
 * the stage's focus, engineering execution, outcome and "Solves" links, over a faint oversized
 * numeral. The violet tint deepens column by column toward Scale, and a light glides along the
 * top of the column that opens. A strip under all seven carries the governance line.
 *
 * The open stage moves along on its own, then loops. Hovering a column (after a beat) or pressing
 * it opens it. The tour pauses while the pointer is on the box, for keyboard focus, off-screen and
 * in background tabs, and stays off for reduced motion.
 */
export function StageColumns({ stages, labels, governance }: StageExplorerProps) {
  const uid = useId();
  const [active, setActive] = useState(0);
  const [pointerOver, setPointerOver] = useState(false);
  const [keyboardFocus, setKeyboardFocus] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const hoverTimer = useRef<number | undefined>(undefined);

  const reducedMotion = useReducedMotion();
  const pageVisible = usePageVisible();
  const inView = useInView(rootRef, 0.35);

  const count = stages.length;
  const tourRunning = !reducedMotion && inView && pageVisible && !pointerOver && !keyboardFocus;

  useEffect(() => {
    if (!tourRunning) return;
    const timer = window.setTimeout(() => setActive((index) => (index + 1) % count), TOUR_MS);
    return () => window.clearTimeout(timer);
  }, [tourRunning, active, count]);

  useEffect(() => () => window.clearTimeout(hoverTimer.current), []);

  const openOnHover = (index: number) => {
    window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => setActive(index), HOVER_MS);
  };

  const onFocus = (event: FocusEvent<HTMLDivElement>) => {
    if (event.target.matches(":focus-visible")) setKeyboardFocus(true);
  };

  const onBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setKeyboardFocus(false);
  };

  return (
    <div ref={rootRef} className="mx-auto hidden max-w-[78rem] px-8 lg:block" onFocus={onFocus} onBlur={onBlur}>
      <div
        className="border border-white/12"
        onMouseEnter={() => setPointerOver(true)}
        onMouseLeave={() => {
          setPointerOver(false);
          window.clearTimeout(hoverTimer.current);
        }}
      >
        <ol className="flex h-[33rem] xl:h-[26.5rem]">
          {stages.map((stage, index) => {
            const open = index === active;
            const buttonId = `${uid}-stage-${index}`;
            const panelId = `${uid}-panel-${index}`;
            return (
              <li
                key={stage.number}
                className={`group relative isolate min-w-0 basis-0 overflow-hidden border-white/10 transition-[flex-grow] duration-700 ease-out-soft motion-reduce:transition-none ${
                  index > 0 ? "border-l" : ""
                }`}
                style={{ flexGrow: open ? OPEN_GROW : 1 }}
                onMouseEnter={() => openOnHover(index)}
              >
                {/* Tint deepening toward Scale; a lift on hover; a bloom from the base when open */}
                <span
                  aria-hidden
                  className="absolute inset-0 -z-10"
                  style={{ backgroundColor: `rgb(121 93 245 / ${(0.015 + index * 0.013).toFixed(3)})` }}
                />
                <span
                  aria-hidden
                  className={`absolute inset-0 -z-10 bg-white/[0.035] transition-opacity duration-300 ${
                    open ? "opacity-0" : "opacity-0 group-hover:opacity-100"
                  }`}
                />
                <span
                  aria-hidden
                  className={`absolute inset-0 -z-10 bg-[radial-gradient(110%_75%_at_25%_100%,rgb(121_93_245/0.34),transparent_70%)] transition-opacity duration-700 ${
                    open ? "opacity-100" : "opacity-0"
                  }`}
                />
                {/* The light gliding along the top of the column that opens */}
                <span
                  aria-hidden
                  className={`absolute inset-x-0 top-0 h-px origin-left bg-violet-soft transition-transform duration-700 ease-out-soft motion-reduce:transition-none ${
                    open ? "scale-x-100" : "scale-x-0"
                  }`}
                />
                {/* Oversized numeral in the open stage's empty top corner, cropped by the top edge, clear of the text */}
                <span
                  aria-hidden
                  className={`pointer-events-none absolute -top-9 right-5 -z-10 text-[10rem] leading-none font-[600] tracking-[-0.04em] text-white/[0.05] tabular-nums transition-opacity duration-700 select-none [font-stretch:110%] xl:-top-11 xl:right-7 xl:text-[12.5rem] ${
                    open ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {stage.number}
                </span>

                <h3 className={`absolute inset-0 z-10 ${open ? "pointer-events-none" : ""}`}>
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={() => setActive(index)}
                    className="size-full cursor-pointer focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-violet-soft"
                  >
                    <span className="sr-only">
                      {stage.number} {stage.name}, {stage.duration}
                    </span>
                  </button>
                </h3>

                {/* Closed: number up top, name and time frame running up from the base */}
                <div
                  aria-hidden
                  className={`absolute inset-0 flex flex-col items-center justify-between py-7 transition-opacity duration-300 ${
                    open ? "opacity-0" : "opacity-100 delay-200"
                  }`}
                >
                  <span className="text-[0.8125rem] text-white/45 tabular-nums">{stage.number}</span>
                  <span className="flex rotate-180 items-center gap-3 [writing-mode:vertical-rl]">
                    <span className="text-[1.125rem] font-medium whitespace-nowrap text-white/75 transition-colors duration-300 group-hover:text-white">
                      {stage.name}
                    </span>
                    <span className="text-[0.8125rem] whitespace-nowrap text-violet-soft/80">{stage.duration}</span>
                  </span>
                </div>

                {/* Open: a fixed width, so the text is revealed as the column widens rather than reflowing */}
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  inert={!open}
                  className={`absolute inset-y-0 left-0 flex w-[30rem] flex-col p-9 transition-[opacity,translate,visibility] duration-500 ease-out-soft motion-reduce:transition-none xl:w-[40rem] xl:p-10 ${
                    open ? "visible translate-y-0 opacity-100 delay-200" : "invisible translate-y-2 opacity-0"
                  }`}
                >
                  <p className="text-[0.8125rem] text-violet-soft tabular-nums">
                    {stage.number} · {stage.duration}
                  </p>
                  <p className="mt-3 text-[2.5rem] leading-none font-[560] tracking-[-0.02em] text-white [font-stretch:110%]">
                    {stage.name}
                  </p>
                  <p className="mt-3 text-[0.9375rem] leading-snug text-white/60">{stage.focus}</p>

                  <div className="mt-auto grid gap-7 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] xl:gap-10">
                    <dl>
                      <dt className={STAGE_TERM_CLASS}>{labels.execution}</dt>
                      <dd className="mt-2 text-[1.0625rem] leading-[1.6] text-pretty text-white/85">{stage.execution}</dd>
                    </dl>
                    <div className="space-y-6">
                      <dl>
                        <dt className={STAGE_TERM_CLASS}>{labels.outcome}</dt>
                        <dd className="mt-2 text-[1.125rem] leading-snug font-medium text-white">{stage.outcome}</dd>
                      </dl>
                      <SolvesLinks stage={stage} label={labels.solves} />
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>

        {/* Governance runs under every stage */}
        <p className="flex items-center gap-3 border-t border-white/10 px-8 py-3.5 text-[0.875rem] text-white/55">
          <span aria-hidden className="flex size-7 shrink-0 items-center justify-center rounded-xs bevel-dark">
            <LuShieldCheck className="size-3.5" />
          </span>
          <span>
            <span className="font-medium text-white">{governance.title}</span> {governance.description}
          </span>
        </p>
      </div>
    </div>
  );
}
