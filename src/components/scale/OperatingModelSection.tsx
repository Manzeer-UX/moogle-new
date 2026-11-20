import { LuArrowDown, LuArrowRight } from "react-icons/lu";
import { operatingModel } from "@/content/home";
import { ScaleExplorer } from "./ScaleExplorer";

/** Below lg the stages stack in one outlined box, deepening in tone like the explorer's foundations row */
const STAGE_TONE = ["bg-violet/0", "bg-violet/[0.09]", "bg-violet/[0.2]"];

/** Light gathers where the weave opens out (upper right) and under its first strand (lower left) */
const GLOW = [
  "radial-gradient(60rem 34rem at 92% 30%, rgb(121 93 245 / 0.22), transparent 70%)",
  "radial-gradient(40rem 26rem at 0% 100%, rgb(91 63 214 / 0.16), transparent 70%)",
].join(", ");

/**
 * "Operating Model" (section 10): a dark band after the light Why MoogleLabs section. Beside the
 * heading a weave of five threads (the foundations) pinches at one use case and fans out across
 * the screen. From lg the stages are stations on the weave, plugged into an outlined box of three
 * stages over five foundations (all in ScaleExplorer); below lg the stages stack in the same box.
 * Text is set in the primary palette: white for what leads, violet-soft tints for the rest.
 */
export function OperatingModelSection() {
  const { eyebrow, heading, description, valueLabel, foundationsLabel, stages, foundations, footnote, cta } =
    operatingModel;

  return (
    <section
      id="operating-model"
      aria-labelledby="operating-model-title"
      className="relative isolate overflow-hidden bg-[#0f1033] py-24 text-white selection:bg-violet/45 selection:text-white sm:py-28 lg:py-32"
    >
      <div aria-hidden className="absolute inset-0 -z-10" style={{ backgroundImage: GLOW }} />
      <div aria-hidden className="grain-overlay -z-10" />

      <ScaleExplorer
        titleId="operating-model-title"
        eyebrow={eyebrow}
        heading={heading}
        description={description}
        valueLabel={valueLabel}
        foundationsLabel={foundationsLabel}
        stages={stages}
        foundations={foundations}
      />

      <div className="relative mx-auto max-w-[78rem] px-5 sm:px-8">
        {/* Below lg: the stages one under another in the same outlined box */}
        <div className="border border-violet-soft/20 lg:hidden">
          <p className="flex items-center gap-1.5 px-5 py-3.5 text-[0.8125rem] text-violet-soft/75 sm:px-7">
            {foundationsLabel}
            <LuArrowDown aria-hidden className="size-3.5 text-violet-soft" />
          </p>
          <ol>
            {stages.map((stage, index) => (
              <li
                key={stage.number}
                className={`border-t border-violet-soft/15 px-5 pt-6 pb-3 sm:px-7 sm:pt-7 ${STAGE_TONE[index] ?? STAGE_TONE[0]}`}
              >
                <p className="text-[0.8125rem] text-violet-soft tabular-nums">Stage {stage.number}</p>
                <h3 className="mt-1.5 text-[1.25rem] leading-snug font-[560] tracking-[-0.015em] text-white [font-stretch:108%]">
                  {stage.name}
                </h3>
                <p className="mt-1.5 text-[0.875rem] leading-relaxed text-violet-soft/85">{stage.description}</p>
                <dl className="mt-5 divide-y divide-violet-soft/15 border-t border-violet-soft/15">
                  {foundations.map((foundation) => (
                    <div
                      key={foundation.name}
                      className="grid grid-cols-[8.5rem_minmax(0,1fr)] gap-3 py-3 text-[0.875rem] sm:grid-cols-[11rem_minmax(0,1fr)]"
                    >
                      <dt className="text-violet-soft/80">{foundation.name}</dt>
                      <dd className="text-white">{foundation.stages[index]}</dd>
                    </div>
                  ))}
                </dl>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between lg:mt-10">
          <p className="flex items-center gap-3 text-[0.9375rem] text-violet-soft/90">
            <span aria-hidden className="size-2 shrink-0 rounded-full bg-violet-soft motion-safe:animate-soft-pulse" />
            {footnote}
          </p>
          <a
            href={cta.href}
            className="group inline-flex h-12 shrink-0 items-center gap-4 self-start rounded-md bg-white pr-1.5 pl-5 text-[0.9375rem] font-semibold text-ink shadow-[inset_0_-1px_0_rgb(20_22_59/0.12),0_14px_32px_-14px_rgb(121_93_245/0.8)] transition-shadow duration-300 hover:shadow-[inset_0_-1px_0_rgb(20_22_59/0.12),0_0_0_4px_rgb(188_174_255/0.25),0_16px_38px_-14px_rgb(121_93_245/1)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-soft sm:self-auto"
          >
            {cta.label}
            <span className="flex size-9 items-center justify-center rounded-xs bevel-violet transition-[color,background-color,box-shadow] duration-300 group-hover:bg-violet-strong">
              <LuArrowRight
                aria-hidden
                className="size-4 transition-transform duration-300 ease-out-soft group-hover:translate-x-0.5"
              />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
