import { Fragment } from "react";
import type { IconType } from "react-icons";
import { LuBuilding2, LuKeyRound, LuLayers, LuRocket, LuShieldCheck, LuSparkles, LuTarget } from "react-icons/lu";
import LineWaves from "@/components/backgrounds/LineWaves";
import { CELL_HOVER, CellGlide } from "@/components/effects/gridCell";
import { pad2 } from "@/components/industries/industryIcons";
import { whyMoogle, type Pillar } from "@/content/home";

const ICONS: Record<string, IconType> = {
  "problem-first": LuTarget,
  "poc-to-production": LuRocket,
  "ip-ownership": LuKeyRound,
  foundation: LuLayers,
  "enterprise-grade": LuShieldCheck,
  "operating-model": LuBuilding2,
};

/**
 * Where each of the six pillars sits: stacked on phones, two columns from md, three from xl.
 * Hairlines run border to border between the cells; cells on the box's sides take the wider outer
 * padding, so the text keeps its margin.
 */
const CELL_LAYOUT = [
  // xl: top left
  "md:pr-8 md:pl-10 xl:pr-12 xl:pl-16",
  // xl: top middle
  "border-t md:border-t-0 md:border-l md:pr-10 md:pl-8 xl:px-12",
  // xl: top right (md: second row, left)
  "border-t md:pr-8 md:pl-10 xl:border-t-0 xl:border-l xl:pr-16 xl:pl-12",
  // xl: bottom left (md: second row, right)
  "border-t md:border-l md:pr-10 md:pl-8 xl:border-l-0 xl:pr-12 xl:pl-16",
  // xl: bottom middle (md: third row, left)
  "border-t md:pr-8 md:pl-10 xl:border-l xl:px-12",
  // xl: bottom right (md: third row, right)
  "border-t md:border-l md:pr-10 md:pl-8 xl:pr-16 xl:pl-12",
];

/**
 * "Why MoogleLabs" (section 9), the #why-mooglelabs anchor: light, after the dark Delivery band.
 * Heading and lead on the container; the six pillars in an outlined hairline grid, the same system
 * as the testimonials (hover included), each cell an icon and number, the pillar set large, its
 * description, and the differentiator on the cell's base. A faint line field drifts edge to edge
 * behind the band and shows around the box (the section's one moving graphic); the box itself is
 * solid, so no text sits on moving lines.
 */
export function WhySection() {
  const { eyebrow, heading, description, pillars } = whyMoogle;

  return (
    <section
      id="why-mooglelabs"
      aria-labelledby="why-title"
      className="relative isolate overflow-hidden bg-paper py-24 sm:py-28 lg:py-32"
    >
      <div className="mx-auto max-w-[78rem] px-5 sm:px-8">
        <p className="flex items-center gap-2.5 text-[0.9375rem] font-medium text-ink">
          <span aria-hidden className="size-1.5 rounded-xs bg-violet" />
          {eyebrow}
        </p>
        <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-end lg:gap-16">
          <div className="@container">
            <h2 id="why-title" className="type-section max-w-[44rem] text-ink">
              {heading}
            </h2>
          </div>
          <p className="type-lead max-w-[30rem] text-slate">{description}</p>
        </div>
      </div>

      <div className="relative mt-14 sm:mt-16 lg:mt-20">
        {/* The line field runs edge to edge and fades out above and below the box */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-20 -bottom-20 -z-10 [mask-image:linear-gradient(to_bottom,transparent,black_22%,black_78%,transparent)]"
        >
          <LineWaves
            lightMode
            color1="#795df5"
            color2="#5b3fd6"
            color3="#a08cf8"
            colorCycleSpeed={0.5}
            speed={0.16}
            lineCount={48}
            lineWidth={1}
            glow={0.3}
            highlight={0.7}
            highlightWidth={1.2}
            warpIntensity={1}
            warpScale={1.1}
            rotation={-14}
            edgeFade={0}
            enableMouseInteraction={false}
            clickRipple={false}
            opacity={0.3}
          />
        </div>

        <div className="mx-auto max-w-[78rem] px-5 sm:px-8">
          <ol className="grid border border-line bg-paper md:grid-cols-2 xl:grid-cols-3">
            {pillars.map((pillar, index) => (
              <PillarCell key={pillar.id} pillar={pillar} index={index} layout={CELL_LAYOUT[index] ?? "border-t"} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/** Keeps hyphenated compounds ("PoC-to-production") whole: a balanced title would otherwise break at a hyphen */
function wholeCompounds(text: string) {
  return text.split(" ").map((word, index) => (
    <Fragment key={index}>
      {index > 0 && " "}
      {word.includes("-") ? <span className="whitespace-nowrap">{word}</span> : word}
    </Fragment>
  ));
}

function PillarCell({ pillar, index, layout }: { pillar: Pillar; index: number; layout: string }) {
  const Icon = ICONS[pillar.id] ?? LuSparkles;

  return (
    <li className={`${CELL_HOVER} flex flex-col border-line px-5 py-10 sm:px-8 md:py-12 xl:py-14 ${layout}`}>
      <CellGlide />

      <div className="flex items-start justify-between">
        <span className="flex size-11 items-center justify-center rounded-xs bevel-light transition-[color,background-color,box-shadow] duration-500 group-hover:bevel-violet">
          <Icon aria-hidden className="size-5" />
        </span>
        <span
          aria-hidden
          className="text-[0.8125rem] text-slate/60 tabular-nums transition-colors duration-500 group-hover:text-violet-strong"
        >
          {pad2(index + 1)}
        </span>
      </div>

      <h3 className="mt-8 text-[1.375rem] leading-[1.25] font-medium tracking-[-0.015em] text-balance text-ink xl:text-[1.5rem]">
        {wholeCompounds(pillar.title)}
      </h3>
      <p className="mt-3 max-w-[30rem] text-[0.9375rem] leading-relaxed text-pretty text-slate">{pillar.description}</p>

      {/* The bullet sits on the first line when the differentiator wraps */}
      <p className="mt-auto flex items-start gap-2.5 pt-8 text-[0.9375rem] leading-snug font-medium text-violet-strong">
        <span aria-hidden className="mt-[0.4375rem] size-1.5 shrink-0 rounded-xs bg-violet" />
        {pillar.differentiator}
      </p>
    </li>
  );
}
