"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, usePageVisible, useReducedMotion } from "@/components/motion/hooks";
import type { Friction } from "@/content/home";
import { FrictionOption } from "./OrbCards";
import { PlasmaOrb, SPHERE_FRACTION } from "./PlasmaOrb";

/** How long each question stays highlighted; matches the feed packet's 4s run (globals.css) */
const STEP_MS = 4000;
/** Questions on the left; the rest go right, staggered between them */
const LEFT_COUNT = 3;
/** Cards this close to the orb's centre line get a straight wire instead of a bracket */
const STRAIGHT_WITHIN = 24;

type OrbStageProps = {
  heading: string;
  items: Friction[];
  /** Where every question leads for now */
  href: string;
  className?: string;
};

/** A wire's start: the card's inner edge at its vertical centre, in the orb element's coordinates */
type Port = { x: number; y: number };
type WireGeometry = { size: number; ports: Port[] };

/**
 * A "}"-shaped run: out of the card, round the corner, along the spine, round again and in to
 * the sphere's centre (the orb hides the part behind it). `out` is the direction of the orb.
 */
function bracket(port: Port, spine: number, joinY: number, centre: number, out: 1 | -1) {
  const dir = joinY > port.y ? 1 : -1;
  const r = Math.min(16, Math.abs(joinY - port.y) / 2, Math.abs(spine - port.x));
  return `M ${port.x} ${port.y} H ${spine - out * r} Q ${spine} ${port.y} ${spine} ${port.y + dir * r} V ${joinY - dir * r} Q ${spine} ${joinY} ${spine + out * r} ${joinY} H ${centre}`;
}

/** Each side's runs. A card level with the orb wires straight in and its neighbours join that line; otherwise they meet at the centre line. */
function routes(ports: Port[], size: number, side: "left" | "right") {
  const centre = size / 2;
  const radius = (size * SPHERE_FRACTION) / 2;
  const out = side === "left" ? 1 : -1;
  const surface = centre - out * radius;
  const joinY = ports.find((port) => Math.abs(port.y - centre) < STRAIGHT_WITHIN)?.y ?? centre;
  return ports.map((port) => {
    const spine = (port.x + surface) / 2;
    return port.y === joinY ? `M ${port.x} ${port.y} H ${centre}` : bracket(port, spine, joinY, centre, out);
  });
}

/**
 * The wires, drawn inside the orb's own stack: above its glow, beneath the sphere, so every line
 * passes behind the orb. Only the lit question's wire moves: one packet per highlight, which the
 * orb swallows. The rest stay still, to keep the hero calm.
 */
function Wires({ geometry, active }: { geometry: WireGeometry | null; active: number }) {
  if (!geometry || geometry.size <= 0) return null;
  const { size, ports } = geometry;
  const runs = [
    ...routes(ports.slice(0, LEFT_COUNT), size, "left"),
    ...routes(ports.slice(LEFT_COUNT), size, "right"),
  ];

  return (
    <svg
      aria-hidden
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="pointer-events-none absolute top-0 left-0 hidden overflow-visible lg:block"
    >
      {runs.map((d, index) => {
        const lit = index === active;
        return (
          <g key={index} fill="none" strokeLinecap="round">
            <path
              d={d}
              stroke={lit ? "#bcaeff" : "#795df5"}
              strokeOpacity={lit ? 0.85 : 0.35}
              strokeWidth={lit ? 1.5 : 1.25}
              className="transition-[stroke,stroke-opacity,stroke-width] duration-500"
            />
            {lit && (
              <g key={`feed-${active}`} strokeDasharray="14 200">
                <path d={d} pathLength={100} stroke="#795df5" strokeOpacity={0.3} strokeWidth={7} className="motion-safe:animate-feed motion-reduce:hidden" />
                <path d={d} pathLength={100} stroke="#ffffff" strokeOpacity={0.9} strokeWidth={2} className="motion-safe:animate-feed motion-reduce:hidden" />
              </g>
            )}
          </g>
        );
      })}
      {ports.map((port, index) => (
        <circle
          key={index}
          cx={port.x}
          cy={port.y}
          r={index === active ? 4.5 : 3.5}
          strokeWidth={1.5}
          className={`transition-[r] duration-500 ${index === active ? "fill-violet-soft stroke-white" : "fill-ink stroke-violet"}`}
        />
      ))}
    </svg>
  );
}

/**
 * The hero's centrepiece: the plasma orb flanked by the five friction questions, each wired into
 * the orb, under the prompt that introduces them. A highlight walks the questions; the lit one
 * swings toward the viewer and sends a packet down its wire. It pauses while the pointer is on a
 * card, off-screen and in background tabs, and stays off for reduced motion. Below lg the cards
 * stack under the orb, without wires.
 */
export function OrbStage({ heading, items, href, className = "" }: OrbStageProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  const [active, setActive] = useState(0);
  const [pointerOver, setPointerOver] = useState(false);
  const [geometry, setGeometry] = useState<WireGeometry | null>(null);

  const reducedMotion = useReducedMotion();
  const pageVisible = usePageVisible();
  const inView = useInView(stageRef, 0.25);
  const running = !reducedMotion && inView && pageVisible && !pointerOver;
  const count = items.length;

  useEffect(() => {
    if (!running) return;
    const timer = window.setTimeout(() => setActive((index) => (index + 1) % count), STEP_MS);
    return () => window.clearTimeout(timer);
  }, [running, active, count]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const measure = () => {
      const orb = orbRef.current;
      if (!orb) return;
      const origin = orb.getBoundingClientRect();
      // Every card hinges on its inner edge, so that edge (where the port sits) is stable to measure
      const ports = optionRefs.current.map((card, index) => {
        if (!card) return { x: 0, y: 0 };
        const box = card.getBoundingClientRect();
        const edge = index < LEFT_COUNT ? box.right : box.left;
        return { x: edge - origin.left, y: box.top + box.height / 2 - origin.top };
      });
      setGeometry({ size: origin.width, ports });
    };
    const observer = new ResizeObserver(measure);
    observer.observe(stage);
    for (const card of optionRefs.current) if (card) observer.observe(card);
    return () => observer.disconnect();
  }, [count]);

  const pointerHandlers = { onMouseEnter: () => setPointerOver(true), onMouseLeave: () => setPointerOver(false) };
  const option = (item: Friction, index: number, side: "left" | "right") => (
    <FrictionOption
      key={item.id}
      ref={(element) => {
        optionRefs.current[index] = element;
      }}
      item={item}
      href={href}
      side={side}
      active={!reducedMotion && index === active}
    />
  );

  return (
    <div
      ref={stageRef}
      className={`relative mx-auto grid w-full max-w-[78rem] grid-cols-1 content-center gap-x-0 gap-y-3 px-4 sm:grid-cols-2 sm:gap-x-4 sm:px-8 lg:grid-cols-[17rem_minmax(0,1fr)_minmax(0,20rem)_minmax(0,1fr)_17rem] lg:grid-rows-[auto_minmax(0,1fr)] lg:gap-x-0 lg:gap-y-0 xl:grid-cols-[20rem_minmax(0,1fr)_minmax(0,24rem)_minmax(0,1fr)_20rem] ${className}`}
    >
      {/* Orb: sized to whatever height the hero leaves it (a size container from lg). Its stack, back to front: glow, wires, sphere. */}
      <div className="relative order-first mx-auto mb-4 flex aspect-square w-[min(78vw,20rem)] items-center justify-center sm:col-span-2 sm:mb-6 sm:w-[22rem] lg:order-none lg:col-span-1 lg:col-start-3 lg:row-start-2 lg:mb-0 lg:aspect-auto lg:h-full lg:w-full lg:[container-type:size]">
        <div ref={orbRef} className="relative size-full lg:size-[min(100cqw,100cqh)]">
          {/* Layered glow: a wide breathing bloom, a lavender halo, light hugging the silhouette */}
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute top-1/2 left-1/2 size-[185%] -translate-1/2 rounded-full bg-[radial-gradient(circle,rgb(121_93_245/0.5),rgb(91_63_214/0.2)_36%,transparent_64%)] blur-3xl motion-safe:animate-orb-breathe" />
            <div className="absolute top-1/2 left-1/2 size-[122%] -translate-1/2 rounded-full bg-[radial-gradient(circle,rgb(188_174_255/0.4),rgb(121_93_245/0.22)_45%,transparent_70%)] blur-2xl" />
            <div className="absolute inset-[8%] rounded-full shadow-[0_0_60px_14px_rgb(121_93_245/0.62),0_0_150px_56px_rgb(91_63_214/0.4)]" />
          </div>
          <Wires geometry={geometry} active={reducedMotion ? -1 : active} />
          <PlasmaOrb className="size-full" />
        </div>
      </div>

      {/* The prompt sits above the five questions it introduces, not among them; layered over the orb's glow */}
      <div className="relative z-10 mt-2 mb-1 text-center sm:col-span-2 lg:col-span-5 lg:row-start-1 lg:mt-0 lg:mb-[clamp(0.5rem,2svh,1.5rem)]">
        <h2 id="friction-heading" className="text-[1.125rem] leading-snug font-[580] text-white sm:text-[1.25rem]">
          {heading}
        </h2>
      </div>

      <div
        className="flex flex-col justify-center gap-3 sm:gap-4 lg:col-start-1 lg:row-start-2 lg:gap-3 lg:[perspective:900px]"
        {...pointerHandlers}
      >
        {items.slice(0, LEFT_COUNT).map((item, index) => option(item, index, "left"))}
      </div>
      <div
        className="flex flex-col justify-center gap-3 sm:gap-4 lg:col-start-5 lg:row-start-2 lg:gap-3 lg:[perspective:900px]"
        {...pointerHandlers}
      >
        {items.slice(LEFT_COUNT).map((item, index) => option(item, LEFT_COUNT + index, "right"))}
      </div>
    </div>
  );
}
