import { MotionSection } from "@/components/motion/MotionSection";
import { industries } from "@/content/home";
import { IndustryAccordion } from "./IndustryAccordion";
import { IndustryFlow } from "./IndustryFlow";

/** Violet light pooling behind the heading and the far corner of the band */
const GLOW = [
  "radial-gradient(52rem 30rem at 6% 0%, rgb(121 93 245 / 0.30), transparent 68%)",
  "radial-gradient(44rem 28rem at 100% 100%, rgb(91 63 214 / 0.24), transparent 70%)",
].join(", ");

/**
 * Full-bleed ink band that breaks up the light sections around it. The heading sits on the page
 * container; below it an edge-to-edge band closes the section: the flow diagram on desktop
 * (IndustryFlow), an accordion below lg (IndustryAccordion).
 */
export function IndustriesSection() {
  const { eyebrow, heading, ...explorer } = industries;

  return (
    <MotionSection
      id="industries"
      aria-labelledby="industries-title"
      className="relative isolate overflow-hidden bg-ink pt-24 text-white selection:bg-violet/45 selection:text-white sm:pt-28 lg:pt-32"
    >
      <div aria-hidden className="absolute inset-0 -z-10" style={{ backgroundImage: GLOW }} />
      <div aria-hidden className="grain-overlay -z-10" />

      <div className="mx-auto max-w-[78rem] px-5 sm:px-8">
        <div className="@container max-w-[46rem]">
          <p className="text-[0.9375rem] font-medium text-violet-soft">{eyebrow}</p>
          <h2 id="industries-title" className="type-section mt-5 text-white">
            {heading}
          </h2>
        </div>
      </div>

      {/* The band closes the section: no bottom padding, so it sits flush with the next section */}
      <div className="mt-12 lg:mt-14">
        <IndustryFlow {...explorer} />
        <IndustryAccordion {...explorer} />
      </div>
    </MotionSection>
  );
}
