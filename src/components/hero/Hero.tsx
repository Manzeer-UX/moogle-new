import { LuArrowDown } from "react-icons/lu";
import { hero } from "@/content/home";
import { HeroBackground } from "./HeroBackground";
import { HeroShowcase } from "./HeroShowcase";

/** Keeps hyphenated compounds such as "Production-grade" from breaking across lines. */
function keepCompoundsTogether(text: string) {
  return text.split(/(\S+-\S+)/g).map((part, index) =>
    index % 2 === 1 ? (
      <span key={index} className="whitespace-nowrap">
        {part}
      </span>
    ) : (
      part
    ),
  );
}

export function Hero() {
  return (
    // Top padding clears the fixed header bar (64px, 72px from lg). The container uses the
    // header's padding, so the logo, the copy and the photo panel share the same edges.
    <section
      aria-labelledby="hero-title"
      className="relative isolate flex flex-col overflow-hidden pt-16 lg:min-h-svh lg:pt-[4.5rem]"
    >
      <HeroBackground />

      <div className="mx-auto grid w-full max-w-[78rem] flex-1 px-5 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-x-10 xl:gap-x-14">
        <div className="@container self-center pt-12 pb-12 sm:pt-16 sm:pb-14 lg:max-w-[40rem] lg:py-16">
          <p className="text-[0.9375rem] font-medium text-violet-strong">{hero.eyebrow}</p>

          <h1 id="hero-title" className="type-display mt-5 text-ink">
            {keepCompoundsTogether(hero.title)}
          </h1>

          <p className="type-lead mt-7 max-w-[34rem] text-slate">{hero.description}</p>

          <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-4">
            <a
              href={hero.primaryCta.href}
              className="inline-flex h-12 items-center rounded-sm bg-ink px-6 text-[0.9375rem] font-medium text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.12),0_10px_24px_-12px_rgb(20_22_59/0.7)] transition-colors duration-200 hover:bg-ink-soft focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-violet"
            >
              {hero.primaryCta.label}
            </a>
            <a
              href={hero.secondaryCta.href}
              className="group inline-flex items-center gap-2 text-[0.9375rem] font-medium text-ink transition-colors hover:text-violet-strong focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet"
            >
              {hero.secondaryCta.label}
              <LuArrowDown
                aria-hidden
                className="size-4 transition-transform duration-300 ease-out-soft group-hover:translate-y-0.5"
              />
            </a>
          </div>
        </div>

        {/* Photo panel: full-bleed until lg, then flush under the header bar in its column */}
        <div className="-mx-5 sm:-mx-8 lg:mx-0">
          <HeroShowcase
            heading={hero.friction.heading}
            hint={hero.friction.hint}
            items={hero.friction.items}
            optionHref={hero.secondaryCta.href}
          />
        </div>
      </div>
    </section>
  );
}
