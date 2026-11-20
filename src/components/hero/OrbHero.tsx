import { LuArrowDown, LuArrowRight } from "react-icons/lu";
import { MotionSection } from "@/components/motion/MotionSection";
import { hero } from "@/content/home";
import { OrbStage } from "./OrbStage";

/**
 * The hero, one screen tall on desktop: a dark panel, framed by the light page and sitting under
 * the white header, holding the headline, the CTAs, the friction prompt, and the plasma orb with
 * the five questions wired into it. The headline scales with viewport height and the orb takes the
 * height left over, so everything fits in the first screen. All copy comes from content/home.ts.
 */
export function OrbHero() {
  return (
    <MotionSection
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-svh flex-col bg-paper px-2 pt-[4.5rem] pb-2 sm:px-3 sm:pb-3 lg:h-svh lg:min-h-[46rem] lg:pt-[5rem]"
    >
      <div className="relative isolate flex flex-1 flex-col overflow-hidden rounded-[1.25rem] bg-[#0c0b2a] pb-8 text-white lg:min-h-0 lg:pb-[clamp(1rem,3.5svh,2.5rem)]">
        {/* Deep ink-violet, a violet bloom where the orb sits, light falling from the top */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-linear-to-b from-[#0a0920] via-[#0e0c32] to-[#14163b]" />
          <div className="absolute inset-0 bg-[radial-gradient(62rem_34rem_at_50%_70%,rgb(121_93_245/0.22),transparent_70%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(48rem_20rem_at_50%_-4%,rgb(188_174_255/0.16),transparent_70%)]" />
          <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/25 to-transparent" />
        </div>

        <div className="shrink-0 px-5 pt-[clamp(2rem,5.5svh,4.5rem)] text-center sm:px-8">
          <h1
            id="hero-title"
            className="type-display mx-auto max-w-[50rem] text-[clamp(2.125rem,min(5vw,6.1svh),3.5rem)] text-white"
          >
            {hero.title}
          </h1>

          <p className="type-lead mx-auto mt-[clamp(0.75rem,2.2svh,1.5rem)] max-w-[40rem] text-violet-soft">{hero.description}</p>

          {/* A mirrored pair: arrow chip on the right of the primary, on the left of the secondary */}
          <div className="mt-[clamp(1.25rem,3.6svh,2.5rem)] flex flex-wrap items-center justify-center gap-3.5">
            <a
              href={hero.primaryCta.href}
              className="group relative isolate inline-flex rounded-md p-px shadow-[0_0_0_4px_rgb(121_93_245/0.14),0_14px_38px_-12px_rgb(121_93_245/0.9)] transition-shadow duration-300 hover:shadow-[0_0_0_5px_rgb(121_93_245/0.2),0_18px_46px_-12px_rgb(121_93_245/1)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-soft"
            >
              {/* A small light orbits the 1px border, echoing the orb (still for reduced motion) */}
              <span aria-hidden className="cta-orbit-border absolute inset-0 -z-10 rounded-md motion-safe:animate-cta-orbit" />
              <span className="inline-flex h-[3.25rem] items-center gap-4 rounded-[0.3125rem] bg-linear-to-b from-[#8a72ff] via-violet to-violet-strong pr-1.5 pl-6 text-[0.9375rem] font-semibold text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.35),inset_0_-1px_0_rgb(20_22_59/0.25)] transition-[filter] duration-300 group-hover:brightness-110">
                {hero.primaryCta.label}
                <span className="flex size-10 items-center justify-center rounded-xs bevel-glass transition-[color,background-color,box-shadow] duration-300 group-hover:bevel-white group-hover:text-violet-strong">
                  <LuArrowRight
                    aria-hidden
                    className="size-4 transition-transform duration-300 ease-out-soft group-hover:translate-x-0.5"
                  />
                </span>
              </span>
            </a>
            <a
              href={hero.secondaryCta.href}
              className="group inline-flex h-[3.25rem] items-center gap-3 rounded-md bg-white/[0.06] pr-5 pl-1.5 text-[0.9375rem] font-medium text-white/90 shadow-[inset_0_1px_0_rgb(255_255_255/0.08)] ring-1 ring-white/15 backdrop-blur transition-[background-color,color,box-shadow] duration-300 hover:bg-white/[0.1] hover:text-white hover:ring-white/25 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-soft"
            >
              <span className="flex size-10 items-center justify-center rounded-xs bevel-dark transition-[color,background-color,box-shadow] duration-300 group-hover:text-white">
                <LuArrowDown
                  aria-hidden
                  className="size-4 transition-transform duration-300 ease-out-soft group-hover:translate-y-0.5"
                />
              </span>
              {hero.secondaryCta.label}
            </a>
          </div>
        </div>

        <OrbStage
          heading={hero.friction.heading}
          items={hero.friction.items}
          href={hero.secondaryCta.href}
          className="mt-10 lg:mt-[clamp(0.75rem,3svh,2rem)] lg:min-h-0 lg:flex-1"
        />
      </div>
    </MotionSection>
  );
}
