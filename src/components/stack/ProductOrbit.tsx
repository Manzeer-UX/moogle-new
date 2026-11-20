"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, usePageVisible, useReducedMotion } from "@/components/motion/hooks";

/**
 * Slot angles (degrees, 0 = 3 o'clock, clockwise), one per product in content order. Tuned to
 * the current names: the longest sit at 12 and 6 o'clock, where a ring has the most room, so no
 * pill touches its neighbours, the other ring or the core. Revisit if the product list changes.
 */
const INNER_ANGLES = [90, -90, -30, 30, 150, 210]; // Autonomo AI, Agent-Pipeline, Pulse-AI, STAGE, REX, VIRA
const OUTER_ANGLES = [180, 225, -90, -45, 0, 45, 90, 135]; // ELVIS, IAN, ThinkDocs, Alluvium, Presales, PropIQ, Review Attendant, AttendAI
const STEP_MS = 1600;

type Ring = "inner" | "outer";
type Slot = { name: string; ring: Ring; angle: number; key: string };

type ProductOrbitProps = {
  name: string;
  count: string;
  innerRing: string[];
  outerRing: string[];
  className?: string;
};

const evenAngle = (index: number, total: number) => -90 + (index * 360) / total;
/** Clockwise distance from 12 o'clock, 0–360 */
const sweepOf = (angle: number) => (((angle + 90) % 360) + 360) % 360;

/**
 * DevForge.ai's product suite as an orbit: the suite at the core, products on two rings. The
 * dashed rings drift, and a beam sweeps clockwise from product to product like a radar,
 * lighting each one in turn. It pauses on hover, off-screen and in background tabs, and stays
 * off for reduced motion. Radii are CSS variables set per breakpoint (--r1, --r2, --core).
 */
export function ProductOrbit({ name, count, innerRing, outerRing, className = "" }: ProductOrbitProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const [pointerOver, setPointerOver] = useState(false);
  const reducedMotion = useReducedMotion();
  const pageVisible = usePageVisible();
  const inView = useInView(ref, 0.3);

  const slots: Slot[] = [
    ...innerRing.map((product, index) => ({
      name: product,
      ring: "inner" as const,
      angle: INNER_ANGLES[index] ?? evenAngle(index, innerRing.length),
      key: `inner-${product}`,
    })),
    ...outerRing.map((product, index) => ({
      name: product,
      ring: "outer" as const,
      angle: OUTER_ANGLES[index] ?? evenAngle(index, outerRing.length),
      key: `outer-${product}`,
    })),
  ];
  // Clockwise from 12 o'clock; on a shared angle the inner product goes first
  const tour = [...slots].sort(
    (a, b) => sweepOf(a.angle) - sweepOf(b.angle) || (a.ring === b.ring ? 0 : a.ring === "inner" ? -1 : 1),
  );

  const tourOn = !reducedMotion;
  const running = tourOn && inView && pageVisible && !pointerOver;
  const current = tour[step % tour.length];
  // `step` only grows, so the beam keeps turning clockwise through every lap
  const beamAngle = sweepOf(current.angle) - 90 + Math.floor(step / tour.length) * 360;

  useEffect(() => {
    if (!running) return;
    const timer = window.setTimeout(() => setStep((value) => value + 1), STEP_MS);
    return () => window.clearTimeout(timer);
  }, [running, step]);

  return (
    <div
      ref={ref}
      onMouseEnter={() => setPointerOver(true)}
      onMouseLeave={() => setPointerOver(false)}
      className={`relative mx-auto h-[calc(2*var(--r2)_+_3.5rem)] w-full [--core:4.75rem] [--r1:76px] [--r2:126px] sm:[--core:6.5rem] sm:[--r1:110px] sm:[--r2:190px] lg:[--core:6rem] lg:[--r1:100px] lg:[--r2:160px] xl:[--core:7rem] xl:[--r1:115px] xl:[--r2:205px] ${className}`}
    >
      <div
        aria-hidden
        className="absolute top-1/2 left-1/2 size-[calc(2*var(--r1)_+_2rem)] -translate-1/2 rounded-full bg-violet/20 blur-3xl"
      />

      {/* Rings drift in opposite directions; a satellite dot rides each */}
      <div
        aria-hidden
        className="absolute top-1/2 left-1/2 size-[calc(2*var(--r2))] -translate-1/2 rounded-full border border-dashed border-violet/30 motion-safe:animate-orbit-spin-reverse"
      >
        <span className="absolute top-0 left-1/2 size-2 -translate-1/2 rounded-full bg-violet/70 ring-4 ring-violet/15" />
      </div>
      <div
        aria-hidden
        className="absolute top-1/2 left-1/2 size-[calc(2*var(--r1))] -translate-1/2 rounded-full border border-dashed border-violet/40 motion-safe:animate-orbit-spin"
      >
        <span className="absolute top-0 left-1/2 size-1.5 -translate-1/2 rounded-full bg-violet ring-4 ring-violet/15" />
      </div>

      {tourOn && (
        <span
          aria-hidden
          className="absolute top-1/2 left-1/2 h-0.5 origin-left -translate-y-1/2 rounded-full bg-linear-to-r from-violet/0 via-violet/50 to-violet transition-[rotate,width] duration-700 ease-out-soft"
          style={{ width: current.ring === "inner" ? "var(--r1)" : "var(--r2)", rotate: `${beamAngle}deg` }}
        />
      )}

      <ul aria-label={`${name} products`}>
        {slots.map((slot) => {
          const lit = tourOn && slot.key === current.key;
          return (
            <li
              key={slot.key}
              className="absolute top-1/2 left-1/2"
              // Rotate out to the slot, step along the radius, rotate back so the pill stays upright
              style={{
                transform: `rotate(${slot.angle}deg) translateX(var(${slot.ring === "inner" ? "--r1" : "--r2"})) rotate(${-slot.angle}deg)`,
              }}
            >
              <span
                className={`block -translate-1/2 rounded-full px-2.5 py-1 text-[0.6875rem] leading-tight font-medium whitespace-nowrap ring-1 transition-[background-color,color,box-shadow] duration-500 sm:px-3 sm:py-1.5 sm:text-[0.8125rem] ${
                  lit
                    ? "bg-violet text-white shadow-[0_8px_20px_-6px_rgb(121_93_245/0.7)] ring-violet"
                    : slot.ring === "inner"
                      ? "bg-surface text-ink shadow-[0_6px_16px_-12px_rgb(20_22_59/0.5)] ring-violet/25"
                      : "bg-surface/90 text-ink-soft ring-line"
                }`}
              >
                {slot.name}
              </span>
            </li>
          );
        })}
      </ul>

      <div className="absolute top-1/2 left-1/2 flex size-(--core) -translate-1/2 flex-col items-center justify-center rounded-full bg-surface text-center shadow-[0_18px_40px_-18px_rgb(91_63_214/0.55)] ring-1 ring-violet/20">
        <span className="text-[0.75rem] leading-tight font-semibold text-ink sm:text-[0.9375rem]">{name}</span>
        <span className="mt-0.5 text-[0.625rem] leading-tight text-slate sm:text-[0.75rem]">{count}</span>
      </div>
    </div>
  );
}
