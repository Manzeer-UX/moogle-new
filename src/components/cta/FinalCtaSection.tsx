import { Fragment } from "react";
import { LuArrowRight } from "react-icons/lu";
import { PlasmaOrb } from "@/components/hero/PlasmaOrb";
import { finalCta } from "@/content/home";

/**
 * "Final CTA" (section 12), the #contact anchor every "Discuss your AI roadmap" / "Schedule a
 * call" link lands on. It bookends the hero: the same deep panel framed by the light page, with
 * the same orbiting-light primary button. The hero's plasma orb rises from the base as a vast,
 * planet-like horizon (the section's one moving graphic, a still frame for reduced motion).
 */
export function FinalCtaSection() {
  const { eyebrow, heading, description, cta, microcopy } = finalCta;

  return (
    <section id="contact" aria-labelledby="cta-title" className="relative bg-paper px-2 sm:px-3">
      <div
        data-orb-frame
        className="relative isolate overflow-hidden rounded-[1.25rem] bg-[#0c0b2a] px-5 pt-24 pb-40 text-center text-white selection:bg-violet/45 selection:text-white sm:px-8 sm:pt-28 sm:pb-48 lg:pt-32 lg:pb-56">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-linear-to-b from-[#14163b] via-[#0e0c32] to-[#0a0920]" />
          <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/25 to-transparent" />
          {/* Light pooling above the horizon */}
          <div className="absolute bottom-0 left-1/2 h-[30rem] w-[70rem] max-w-[160%] -translate-x-1/2 translate-y-1/3 rounded-[50%] bg-[radial-gradient(closest-side,rgb(121_93_245/0.55),rgb(121_93_245/0.16)_55%,transparent)] motion-safe:animate-orb-breathe" />
          {/*
           * The horizon: the hero's plasma orb, vast, with only its upper edge on screen. This box is
           * the sphere's silhouette; the orb's canvas is 1/0.84 of it (SPHERE_FRACTION), centred, and
           * only draws the slice inside the panel.
           */}
          <div className="absolute top-[calc(100%-7rem)] left-1/2 aspect-square w-[240%] max-w-[180rem] -translate-x-1/2 sm:top-[calc(100%-8.5rem)] lg:top-[calc(100%-10rem)] lg:w-[160%]">
            {/*
             * Light hugging the silhouette, as round the hero's orb. It starts a few pixels inside the
             * edge, under the orb, so no dark seam can open between the two.
             */}
            <div className="absolute inset-[3px] rounded-full shadow-[0_0_60px_14px_rgb(121_93_245/0.62),0_0_150px_56px_rgb(91_63_214/0.4)]" />
            <div className="absolute top-1/2 left-1/2 size-[119.05%] -translate-1/2">
              <PlasmaOrb cropTo="[data-orb-frame]" variant="horizon" className="size-full" />
            </div>
          </div>
        </div>

        <p className="text-[0.9375rem] font-medium text-violet-soft">{eyebrow}</p>
        <h2
          id="cta-title"
          className="type-display mx-auto mt-5 max-w-[46rem] text-[clamp(2.125rem,5vw,3.5rem)] text-white"
        >
          {heading}
        </h2>
        <p className="type-lead mx-auto mt-6 max-w-[40rem] text-violet-soft">{description}</p>

        <div className="mt-10 flex justify-center">
          <a
            href={cta.href}
            className="group relative isolate inline-flex rounded-md p-px shadow-[0_0_0_4px_rgb(121_93_245/0.14),0_14px_38px_-12px_rgb(121_93_245/0.9)] transition-shadow duration-300 hover:shadow-[0_0_0_5px_rgb(121_93_245/0.2),0_18px_46px_-12px_rgb(121_93_245/1)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-soft"
          >
            {/* A small light orbits the 1px border, as on the hero's primary button */}
            <span aria-hidden className="cta-orbit-border absolute inset-0 -z-10 rounded-md motion-safe:animate-cta-orbit" />
            <span className="inline-flex min-h-[3.25rem] items-center gap-4 rounded-[0.3125rem] bg-linear-to-b from-[#8a72ff] via-violet to-violet-strong py-1.5 pr-1.5 pl-6 text-left text-[0.9375rem] font-semibold text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.35),inset_0_-1px_0_rgb(20_22_59/0.25)] transition-[filter] duration-300 group-hover:brightness-110">
              {cta.label}
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xs bevel-glass transition-[color,background-color,box-shadow] duration-300 group-hover:bevel-white group-hover:text-violet-strong">
                <LuArrowRight
                  aria-hidden
                  className="size-4 transition-transform duration-300 ease-out-soft group-hover:translate-x-0.5"
                />
              </span>
            </span>
          </a>
        </div>

        {/* Stacked on phones; one line with a dot between from sm */}
        <p className="mt-6 flex flex-col items-center justify-center gap-x-3 gap-y-1 text-[0.875rem] text-white/60 sm:flex-row">
          {microcopy.map((line, index) => (
            <Fragment key={line}>
              {index > 0 && (
                <span aria-hidden className="hidden text-violet-soft sm:inline">
                  ·
                </span>
              )}
              <span>{line}</span>
            </Fragment>
          ))}
        </p>
      </div>
    </section>
  );
}
