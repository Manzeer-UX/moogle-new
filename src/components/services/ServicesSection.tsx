import Image, { type StaticImageData } from "next/image";
import { services } from "@/content/home";
import darkTowers from "@/assets/services/dark-towers.jpg";
import glass from "@/assets/services/glass.jpg";
import modular from "@/assets/services/modular.jpg";
import office from "@/assets/services/office.jpg";
import { ServiceCard } from "./ServiceCard";

/** Corporate photos (free Unsplash licence), one per category, cropped to 5:6 */
const PHOTOS: Record<string, StaticImageData> = {
  "build-scale-ai": glass, // photo-1554469384-e58fac16e23a
  "data-cloud": darkTowers, // photo-1486406146926-c627a92ad1ab
  "trust-quality": office, // photo-1497366811353-6870744d04b2
  decentralized: modular, // photo-1479839672679-a46483c0e7c8
};

export function ServicesSection() {
  const { heading, categories } = services;

  return (
    <section id="solutions" aria-labelledby="services-title" className="relative py-24 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-[78rem] px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,17rem)_minmax(0,1fr)] lg:gap-14 xl:grid-cols-[minmax(0,19rem)_minmax(0,1fr)] xl:gap-20">
          <div className="@container lg:sticky lg:top-28 lg:self-start">
            <h2 id="services-title" className="type-section text-ink">
              {heading}
            </h2>

            <nav aria-label="Service categories" className="mt-9 hidden lg:block">
              <ul className="border-l border-line">
                {categories.map((category) => (
                  <li key={category.id}>
                    <a
                      href={`#${category.id}`}
                      className="-ml-px flex items-baseline justify-between gap-4 border-l-2 border-transparent py-2 pl-4 text-[0.9375rem] text-slate transition-colors duration-200 hover:border-violet hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet"
                    >
                      <span>{category.title}</span>
                      <span className="text-[0.8125rem] text-slate/60 tabular-nums">
                        {category.services.length}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="grid gap-x-6 gap-y-14 sm:grid-cols-2">
            {categories.map((category) => (
              // DOM order keeps the category heading ahead of its service list; the tile is moved up visually.
              <article
                key={category.id}
                id={category.id}
                aria-labelledby={`${category.id}-title`}
                className="flex flex-col"
              >
                <h3
                  id={`${category.id}-title`}
                  className="mt-6 text-[1.1875rem] leading-snug font-[580] text-ink"
                >
                  {category.title}
                </h3>
                <p className="mt-2 text-base leading-relaxed text-slate">{category.tagline}</p>

                <div className="relative isolate order-first flex aspect-[5/6] items-center justify-center overflow-hidden rounded-md bg-ink p-5 sm:p-6">
                  <Image
                    src={PHOTOS[category.id]}
                    alt=""
                    fill
                    placeholder="blur"
                    sizes="(min-width: 1280px) 400px, (min-width: 640px) 45vw, 100vw"
                    className="-z-30 object-cover saturate-[0.75]"
                  />
                  {/* Brand grade: violet soft-light, depth at the base, film grain */}
                  <div aria-hidden className="absolute inset-0 -z-20 bg-violet/30 mix-blend-soft-light" />
                  <div
                    aria-hidden
                    className="absolute inset-0 -z-20 bg-linear-to-t from-ink/45 via-ink/10 to-transparent"
                  />
                  <div aria-hidden className="grain-overlay -z-10" />

                  <ServiceCard services={category.services} />
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
