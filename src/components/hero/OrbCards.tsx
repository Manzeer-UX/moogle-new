"use client";

import type { Ref } from "react";
import type { IconType } from "react-icons";
import { LuArrowRight, LuCoins, LuCompass, LuDatabase, LuRocket, LuShieldCheck, LuSparkles } from "react-icons/lu";
import type { Friction } from "@/content/home";

const ICONS: Record<string, IconType> = {
  start: LuCompass,
  production: LuRocket,
  data: LuDatabase,
  governance: LuShieldCheck,
  cost: LuCoins,
};

export type CardSide = "left" | "right";

/**
 * On desktop each card hinges toward the orb on its inner edge. The active (or hovered) card swings
 * most of the way back and grows a touch. Every transform pivots on that inner edge, so the edge
 * (where the wire's port sits) never moves.
 */
const TILT: Record<CardSide, string> = {
  left: "lg:origin-right lg:[transform:rotateY(16deg)] lg:hover:[transform:rotateY(5deg)_scale(1.02)] lg:data-active:[transform:rotateY(5deg)_scale(1.02)]",
  right:
    "lg:origin-left lg:[transform:rotateY(-16deg)] lg:hover:[transform:rotateY(-5deg)_scale(1.02)] lg:data-active:[transform:rotateY(-5deg)_scale(1.02)]",
};

/**
 * A white panel whose depth stays inside its rounded shape: a face shaded away from the light at
 * the top left, a bright bevel along the top, a shaded inner lower edge for thickness. Outside it
 * there are only soft, blurred shadows (a contact shadow and a violet glow), so nothing reads as a
 * box behind the card.
 */
const SLAB =
  "bg-linear-to-br from-white via-white to-[#eeebfb] ring-1 ring-ink/[0.06] shadow-[inset_0_1px_0_#ffffff,inset_0_-3px_0_rgb(91_63_214/0.09),0_16px_28px_-16px_rgb(0_0_0/0.6),0_30px_56px_-32px_rgb(121_93_245/0.45)]";
const SLAB_ACTIVE =
  "data-active:shadow-[inset_0_1px_0_#ffffff,inset_0_-3px_0_rgb(91_63_214/0.14),0_0_0_2px_rgb(121_93_245/0.4),0_18px_32px_-16px_rgb(0_0_0/0.65),0_34px_64px_-30px_rgb(121_93_245/0.65)]";

/**
 * One friction question as a 3D panel, linking to the solutions. Its content sits flat on the face
 * (raising it would slide the icon onto the card's edge under the tilt). `active` is the highlight
 * the tour walks.
 */
export function FrictionOption({
  item,
  href,
  side,
  active,
  ref,
}: {
  item: Friction;
  href: string;
  side: CardSide;
  active: boolean;
  ref?: Ref<HTMLAnchorElement>;
}) {
  const Icon = ICONS[item.id] ?? LuSparkles;

  return (
    <a
      ref={ref}
      href={href}
      data-active={active || undefined}
      className={`group relative flex items-center gap-3 rounded-lg px-4 py-3 text-left transition-[transform,box-shadow] duration-500 ease-out-soft focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-violet-soft lg:py-2.5 xl:py-3 ${SLAB} ${SLAB_ACTIVE} ${TILT[side]}`}
    >
      <span
        className={`flex size-9 shrink-0 items-center justify-center rounded-sm transition-[color,background-color,box-shadow] duration-500 ${
          active ? "bevel-violet" : "bevel-light group-hover:bevel-violet"
        }`}
      >
        <Icon aria-hidden className="size-[1.05rem]" />
      </span>
      <span className="flex-1 text-[0.875rem] leading-snug font-medium text-ink-soft">
        {item.question}
      </span>
      <LuArrowRight
        aria-hidden
        className={`size-4 shrink-0 transition-[translate,color] duration-300 ease-out-soft group-hover:translate-x-0.5 group-hover:text-violet-strong ${
          active ? "translate-x-0.5 text-violet-strong" : "text-slate/50"
        }`}
      />
    </a>
  );
}
