import Image, { type StaticImageData } from "next/image";
import type { ReactNode } from "react";
import { LuArrowUpRight } from "react-icons/lu";
import { enterpriseStack } from "@/content/home";
import devforgeShot from "@/assets/stack/devforge.jpg";
import prismShot from "@/assets/stack/prism-ai.jpg";
import { DevForgeLogo } from "./DevForgeLogo";
import { PrismLogo } from "./PrismLogo";

/**
 * "The Enterprise Stack & Tooling" (section 6): light and editorial, after the dark Industries
 * band. The heading sits beside screenshots of the two sites the section links to (PRISM AI's
 * hero, tall; DevForge.ai's, square), with the eyebrow and lead under a hairline. One row per
 * product follows, on the same two-column grid; a light runs along the full-bleed line that opens
 * them. Screenshots captured from prismai.mooglelabs.com and devforge.ai (Nov 2026).
 */
export function EnterpriseStackSection() {
  const { eyebrow, heading, description, capabilities, platform, products } = enterpriseStack;
  // The suite's products, in content order (the rings were the old orbit diagram's split)
  const productNames = [...products.innerRing, ...products.outerRing];

  return (
    <section
      id="enterprise-stack"
      aria-labelledby="stack-title"
      className="relative isolate bg-paper pt-24 pb-10 sm:pt-28 sm:pb-12 lg:pt-32 lg:pb-16"
    >
      <div className="mx-auto max-w-[78rem] px-5 sm:px-8">
        <div className="grid gap-10 sm:gap-12 lg:grid-cols-2 lg:items-end lg:gap-8">
          <div className="@container">
            <h2 id="stack-title" className="type-section max-w-[30rem] text-ink">
              {heading}
            </h2>
          </div>

          {/* Two shots, top-aligned: the tall one sets the row height and the heading sits on its baseline */}
          <div className="grid max-w-xl grid-cols-2 items-start gap-3 sm:gap-5 lg:max-w-none">
            <Screenshot src={prismShot} href={platform.cta.href} label={`${platform.name} website`} />
            <Screenshot src={devforgeShot} href={products.link.href} label={`${products.name} website`} />
          </div>
        </div>

        <div className="mt-12 grid gap-6 border-t border-line pt-7 sm:mt-14 lg:mt-16 lg:grid-cols-2 lg:gap-8 lg:pt-8">
          <p className="flex items-center gap-2.5 self-start text-[0.9375rem] font-medium text-ink">
            <span aria-hidden className="size-1.5 rounded-xs bg-violet" />
            {eyebrow}
          </p>
          <div>
            <p className="max-w-[33rem] text-[1.3125rem] leading-[1.4] tracking-[-0.01em] text-pretty text-ink sm:text-[1.5rem]">
              {description}
            </p>
            <InlineList
              label="Capabilities"
              items={capabilities}
              separator="+"
              className="mt-6 text-[0.9375rem] text-slate [&_[data-sep]]:text-violet"
            />
          </div>
        </div>
      </div>

      <div className="relative mt-16 sm:mt-20 lg:mt-24">
        {/* Full-bleed hairline with a light running along it, edge to edge */}
        <div aria-hidden className="absolute inset-x-0 top-0 h-px overflow-hidden bg-line">
          <span className="absolute inset-y-0 left-0 w-48 bg-linear-to-r from-transparent via-violet to-transparent motion-safe:animate-wire-run motion-reduce:hidden" />
        </div>

        {/* Logo heights give both wordmarks the same cap height (PRISM's mark is larger in its lockup) */}
        <ProductRow
          id="prism-title"
          logo={<PrismLogo className="h-14 w-auto sm:h-[4.25rem]" />}
          label={platform.label}
          name={platform.name}
          description={platform.description}
          link={platform.cta}
        >
          <InlineList
            label={`${platform.name} capabilities`}
            items={platform.features}
            separator="·"
            className="mt-5 text-[0.875rem] text-slate"
          />
        </ProductRow>

        <ProductRow
          id="devforge-title"
          logo={<DevForgeLogo className="h-10 w-auto sm:h-[3.125rem]" />}
          label={products.label}
          name={products.name}
          description={products.description}
          link={products.link}
          className="border-t border-line"
        >
          <p className="mt-5 text-[0.875rem] font-medium text-ink">{products.count}</p>
          <InlineList
            label={`${products.name} products`}
            items={productNames}
            separator="·"
            className="mt-1.5 text-[0.875rem] text-slate"
          />
        </ProductRow>
      </div>
    </section>
  );
}

/** A site screenshot as a photo tile: links to the site, eases in a touch on hover */
function Screenshot({ src, href, label }: { src: StaticImageData; href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block overflow-hidden rounded-md bg-ink shadow-[0_1px_2px_rgb(20_22_59/0.08),0_28px_56px_-34px_rgb(20_22_59/0.6)] ring-1 ring-ink/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet"
    >
      <Image
        src={src}
        alt={label}
        placeholder="blur"
        sizes="(min-width: 640px) 280px, 46vw"
        className="h-auto w-full transition-transform duration-700 ease-out-soft group-hover:scale-[1.03] motion-reduce:transition-none"
      />
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  );
}

type ProductRowProps = {
  id: string;
  /** The product's logo (decorative: the heading also carries the name as text) */
  logo: ReactNode;
  label: string;
  name: string;
  description: string;
  link: { label: string; href: string };
  /** Detail lines under the description */
  children: ReactNode;
  className?: string;
};

/** Full-bleed row: label and product logo on the left half, description, details and link on the right */
function ProductRow({ id, logo, label, name, description, link, children, className = "" }: ProductRowProps) {
  return (
    <article aria-labelledby={id} className={className}>
      <div className="mx-auto grid max-w-[78rem] gap-6 px-5 py-10 sm:px-8 sm:py-12 lg:grid-cols-2 lg:gap-8">
        <div>
          <p className="text-[0.875rem] text-slate">{label}</p>
          <h3 id={id} className="mt-4 text-ink">
            <span className="sr-only">{name}</span>
            {logo}
          </h3>
        </div>

        <div className="lg:pt-1">
          <p className="max-w-[33rem] text-[1.0625rem] leading-relaxed text-pretty text-ink-soft">{description}</p>
          <div className="max-w-[33rem]">{children}</div>
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-7 inline-flex items-center gap-2 border-b border-violet/30 pb-1 text-[0.9375rem] font-medium text-violet-strong transition-colors duration-200 hover:border-violet hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet"
          >
            {link.label}
            <LuArrowUpRight
              aria-hidden
              className="size-4 transition-transform duration-300 ease-out-soft group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </div>
      </div>
    </article>
  );
}

/**
 * Items on one wrapping line with a quiet separator between them (hidden from screen readers).
 * Each item carries its separator in a left gutter; the list is pulled left by one gutter and the
 * wrapper clips it, so whichever item starts a line, the first included, shows no separator.
 */
function InlineList({
  label,
  items,
  separator,
  className = "",
}: {
  label: string;
  items: string[];
  separator: string;
  className?: string;
}) {
  return (
    <div className={`overflow-hidden ${className}`}>
      <ul aria-label={label} className="-ml-5 flex flex-wrap gap-y-1">
        {items.map((item) => (
          <li key={item} className="relative pl-5">
            <span aria-hidden data-sep className="absolute left-0 w-5 text-center select-none">
              {separator}
            </span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
