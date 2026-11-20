"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";
import { LuCheck } from "react-icons/lu";
import { useInView } from "@/components/motion/hooks";
import type { TraceStep } from "@/content/home";

/** PRISM AI's spectrum, from the product site's prism: violet → blue → cyan → green */
const SPECTRUM = ["#795df5", "#3b82f6", "#06b6d4", "#10b981"];
const TICKS = [0, 250, 500, 750];
/** Label · track · latency */
const COLUMNS = "grid grid-cols-[minmax(0,8.25rem)_minmax(0,1fr)_3.75rem] gap-x-3 sm:grid-cols-[minmax(0,9.5rem)_minmax(0,1fr)_4rem]";

type TraceReplayProps = {
  trace: {
    label: string;
    name: string;
    status: string;
    steps: TraceStep[];
    metrics: { label: string; value: string }[];
  };
  className?: string;
};

/**
 * PRISM AI sample trace, drawn as a light observability console. On loop, a playhead sweeps
 * the waterfall, each span fills as it is crossed, then the run resolves to "Passed" with its
 * scores. One CSS animation of --trace-t drives everything (see globals.css); it waits until
 * the console is on screen and stays off for reduced motion, which shows the finished trace.
 */
export function TraceReplay({ trace, className = "" }: TraceReplayProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, 0.35);

  const total = trace.steps.reduce((sum, step) => sum + step.ms, 0);
  const spans = trace.steps.map((step, index) => {
    const start = trace.steps.slice(0, index).reduce((sum, previous) => sum + previous.ms, 0);
    return { ...step, s: start / total, d: step.ms / total, color: SPECTRUM[index % SPECTRUM.length] };
  });
  const [groundedness, policy, cost] = trace.metrics;

  return (
    <div
      ref={ref}
      className={`overflow-hidden rounded-md bg-surface shadow-[0_1px_2px_rgb(20_22_59/0.05),0_24px_48px_-30px_rgb(20_22_59/0.45)] ring-1 ring-line motion-safe:animate-trace-replay ${
        inView ? "" : "motion-paused"
      } ${className}`}
    >
      <div className="flex items-center justify-between gap-4 border-b border-line-soft px-4 py-3 sm:px-5">
        <p className="flex min-w-0 items-baseline gap-2.5">
          <span className="font-mono text-[0.6875rem] tracking-[0.08em] text-slate uppercase">{trace.label}</span>
          <span className="truncate text-[0.875rem] font-medium text-ink">{trace.name}</span>
        </p>
        <div className="flex shrink-0 items-center gap-3">
          <span className="hidden font-mono text-[0.75rem] text-slate tabular-nums sm:inline">{total} ms</span>
          <span className="relative inline-grid">
            <span
              aria-hidden
              className="trace-running col-start-1 row-start-1 inline-flex items-center gap-1.5 rounded-full bg-violet-wash px-2.5 py-1 text-[0.75rem] font-medium text-violet-strong ring-1 ring-violet/15"
            >
              <span className="size-1.5 rounded-full bg-violet motion-safe:animate-soft-pulse" />
              Running
            </span>
            <span className="trace-done col-start-1 row-start-1 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[0.75rem] font-medium text-emerald-700 ring-1 ring-emerald-600/15">
              <span aria-hidden className="size-1.5 rounded-full bg-emerald-500" />
              {trace.status}
            </span>
          </span>
        </div>
      </div>

      <div className="px-4 pt-3.5 pb-5 motion-safe:animate-trace-fade sm:px-5">
        <div aria-hidden className={`${COLUMNS} font-mono text-[0.6875rem] text-slate/70`}>
          <span />
          <span className="relative h-4">
            {TICKS.map((tick) => (
              <span
                key={tick}
                className="absolute top-0 -translate-x-1/2 tabular-nums first:translate-x-0"
                style={{ left: `${(tick / total) * 100}%` }}
              >
                {tick}
              </span>
            ))}
          </span>
          <span className="text-right">ms</span>
        </div>

        <div className="relative mt-2">
          {/* Tick lines and the playhead, over the track column */}
          <div aria-hidden className={`pointer-events-none absolute -inset-y-1.5 inset-x-0 ${COLUMNS}`}>
            <span />
            <span className="relative">
              {TICKS.slice(1).map((tick) => (
                <span
                  key={tick}
                  className="absolute inset-y-0 w-px bg-line-soft"
                  style={{ left: `${(tick / total) * 100}%` }}
                />
              ))}
              <span className="trace-playhead absolute inset-y-0 w-px bg-ink/45 shadow-[0_0_0_3px_rgb(20_22_59/0.05)]" />
            </span>
            <span />
          </div>

          <ol className="relative space-y-3">
            {spans.map((span) => (
              <li key={span.name} className={`${COLUMNS} items-center`}>
                <span className="truncate text-[0.875rem] text-ink-soft">{span.name}</span>
                <span aria-hidden className="relative h-2.5 rounded-full bg-paper ring-1 ring-line-soft ring-inset">
                  <span
                    className="trace-bar absolute inset-y-0 min-w-1 rounded-full"
                    style={
                      {
                        left: `${span.s * 100}%`,
                        width: `${span.d * 100}%`,
                        background: span.color,
                        "--s": span.s,
                        "--d": span.d,
                      } as CSSProperties
                    }
                  />
                </span>
                <span className="text-right font-mono text-[0.8125rem] text-ink tabular-nums">{span.ms} ms</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Labels stay put; each value shows "—" while the trace runs, then resolves */}
      <dl className="grid grid-cols-3 divide-x divide-line-soft border-t border-line-soft">
        {groundedness && (
          <Metric label={groundedness.label}>
            <span className="flex items-center gap-2">
              <span className="font-mono text-[1.0625rem] font-medium text-ink tabular-nums">{groundedness.value}</span>
              <span aria-hidden className="h-1.5 flex-1 overflow-hidden rounded-full bg-paper ring-1 ring-line-soft ring-inset">
                <span
                  className="block h-full rounded-full bg-linear-to-r from-violet to-[#06b6d4]"
                  style={{ width: `${Number(groundedness.value) * 100}%` }}
                />
              </span>
            </span>
          </Metric>
        )}
        {policy && (
          <Metric label={policy.label}>
            <span className="flex items-center gap-1.5 text-[1.0625rem] font-medium text-emerald-700">
              <LuCheck aria-hidden className="size-4" />
              {policy.value}
            </span>
          </Metric>
        )}
        {cost && (
          <Metric label={cost.label}>
            <span className="font-mono text-[1.0625rem] font-medium text-ink tabular-nums">{cost.value}</span>
          </Metric>
        )}
      </dl>
    </div>
  );
}

function Metric({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="px-4 py-3.5 sm:px-5">
      <dt className="text-[0.75rem] text-slate">{label}</dt>
      <dd className="mt-1 grid min-h-7 items-center">
        <span aria-hidden className="trace-running col-start-1 row-start-1 font-mono text-[1.0625rem] text-slate/50">
          —
        </span>
        <span className="col-start-1 row-start-1 motion-safe:animate-trace-fade">
          <span className="trace-done block">{children}</span>
        </span>
      </dd>
    </div>
  );
}
