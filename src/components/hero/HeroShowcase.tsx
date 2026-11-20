import Image from "next/image";
import Grainient from "@/components/backgrounds/Grainient";
import skyline from "@/assets/hero-skyline.jpg";
import { FrictionCards } from "./FrictionCards";

/**
 * Violet grade for the photo, blended with soft-light: darker stops deepen the towers,
 * lighter stops lift the fog, and the grain gives the photo a printed texture.
 */
const PHOTO_GRADE = ["#33248a", "#5b3fd6", "#795df5", "#a08cf8", "#d6ccfd"];

type HeroShowcaseProps = {
  heading: string;
  hint: string;
  items: { id: string; question: string }[];
  optionHref: string;
};

/** Right half of the hero: graded corporate photo with the friction cards floating on it. */
export function HeroShowcase({ heading, hint, items, optionHref }: HeroShowcaseProps) {
  return (
    <section
      aria-labelledby="friction-heading"
      className="relative isolate flex h-full min-h-[36rem] flex-col justify-center overflow-hidden bg-ink lg:rounded-md px-5 py-12 ring-1 ring-ink/10 sm:px-10 lg:px-12"
    >
      {/* Photo: Unsplash photo-1449157291145 (free Unsplash licence), skyscrapers rising into fog, cropped to 3:4 */}
      <Image
        src={skyline}
        alt=""
        fill
        placeholder="blur"
        loading="eager"
        fetchPriority="high"
        // Portrait 3:4 photo covering a tall panel: width needed ≈ panel height × 0.75
        sizes="(min-width: 1024px) 760px, 120vw"
        className="-z-30 object-cover motion-safe:animate-hero-drift"
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-20 opacity-80 mix-blend-soft-light">
        <Grainient
          colors={PHOTO_GRADE}
          angle={160}
          flow={0.9}
          scale={1.2}
          speed={0.6}
          silk={0.25}
          grainAmount={0.12}
          grainSize={1.4}
          stir={0.5}
          clickSwirl={false}
        />
      </div>
      {/* Depth so the white cards separate from the bright fog */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-t from-ink/50 via-ink/10 to-ink/5"
      />

      <FrictionCards heading={heading} hint={hint} items={items} optionHref={optionHref} />
    </section>
  );
}
