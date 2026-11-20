"use client";

import { useEffect, useRef, useState } from "react";
import type { IconType } from "react-icons";
import {
  LuArrowRight,
  LuCoins,
  LuCompass,
  LuDatabase,
  LuRocket,
  LuShieldCheck,
} from "react-icons/lu";
import { MarkTile } from "@/components/brand/MarkTile";

type FrictionOption = { id: string; question: string };

type FrictionCardsProps = {
  heading: string;
  hint: string;
  items: FrictionOption[];
  /** Where every option leads for now */
  optionHref: string;
};

const ICONS: Record<string, IconType> = {
  start: LuCompass,
  production: LuRocket,
  data: LuDatabase,
  governance: LuShieldCheck,
  cost: LuCoins,
};

const CYCLE_MS = 3200;

/** Double-edged glass bezel around a solid white card */
const bezel =
  "rounded-lg bg-white/30 p-1.5 shadow-[0_28px_60px_-28px_rgb(20_22_59/0.6)] ring-1 ring-white/50 backdrop-blur-[6px]";
const card = "rounded-xs bg-surface ring-1 ring-ink/[0.06]";

/**
 * Two floating cards over the hero photo: the question, then the options.
 * A highlight walks slowly through the options to show they are choices. It pauses on
 * hover or keyboard focus, off-screen and in background tabs, and is off for reduced motion.
 */
export function FrictionCards({ heading, hint, items, optionHref }: FrictionCardsProps) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list || paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let onScreen = true;
    const observer = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
    });
    observer.observe(list);
    const timer = window.setInterval(() => {
      if (onScreen && !document.hidden) setActive((index) => (index + 1) % items.length);
    }, CYCLE_MS);

    return () => {
      window.clearInterval(timer);
      observer.disconnect();
    };
  }, [paused, items.length]);

  return (
    <>
      <div
        className={`relative z-10 w-full max-w-[22rem] self-start motion-safe:animate-card-in motion-safe:[animation-delay:120ms] ${bezel}`}
      >
        <div className={`${card} flex items-start gap-3.5 p-5`}>
          <MarkTile className="size-9" />
          <h2 id="friction-heading" className="type-card-title pt-0.5 text-ink">
            {heading}
          </h2>
        </div>
      </div>

      <div
        className={`-mt-3 w-full max-w-[27rem] self-end motion-safe:animate-card-in motion-safe:[animation-delay:260ms] ${bezel}`}
      >
        <div className={`${card} overflow-hidden`}>
          <p className="flex items-center gap-2 px-5 pt-4 pb-3 text-[0.8125rem] text-slate">
            <span aria-hidden className="size-1.5 rounded-xs bg-violet motion-safe:animate-soft-pulse" />
            {hint}
          </p>
          <ul
            ref={listRef}
            className="divide-y divide-line-soft border-t border-line-soft"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setPaused(false);
            }}
          >
            {items.map((item, index) => {
              const Icon = ICONS[item.id] ?? LuArrowRight;
              const highlighted = !paused && index === active;
              return (
                <li key={item.id}>
                  <a
                    href={optionHref}
                    data-highlighted={highlighted || undefined}
                    className="group flex items-center gap-3.5 px-5 py-3 transition-colors duration-500 hover:bg-violet-wash/70 focus-visible:bg-violet-wash/70 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-violet motion-safe:data-highlighted:bg-violet-wash/70"
                  >
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-sm bg-violet-wash text-violet-strong ring-1 ring-violet/15 transition-colors duration-500 group-hover:bg-violet group-hover:text-white motion-safe:group-data-highlighted:bg-violet motion-safe:group-data-highlighted:text-white">
                      <Icon aria-hidden className="size-[1.05rem]" />
                    </span>
                    <span className="flex-1 text-[0.9375rem] leading-snug text-ink-soft transition-colors duration-300 group-hover:text-ink">
                      {item.question}
                    </span>
                    <LuArrowRight
                      aria-hidden
                      className="size-4 shrink-0 text-slate/50 transition-[translate,color] duration-300 ease-out-soft group-hover:translate-x-0.5 group-hover:text-violet-strong motion-safe:group-data-highlighted:translate-x-0.5 motion-safe:group-data-highlighted:text-violet-strong"
                    />
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
}
