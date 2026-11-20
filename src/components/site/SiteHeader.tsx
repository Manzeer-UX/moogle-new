import Link from "next/link";
import { LuArrowRight } from "react-icons/lu";
import { MoogleLogo } from "@/components/brand/MoogleLogo";
import { contactCta, navLinks } from "@/content/home";
import { MobileMenu } from "./MobileMenu";
import { NavLinks } from "./NavLinks";

/**
 * Edge-to-edge glass bar fixed to the top of the viewport. The frosted surface is its own
 * layer: a backdrop-filter on the header itself would stop the mobile menu (a descendant)
 * from blurring the page behind it.
 */
export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 border-b border-ink/[0.08] bg-linear-to-b from-white/85 to-white/60 shadow-[inset_0_1px_0_rgb(255_255_255/0.8),0_14px_32px_-26px_rgb(20_22_59/0.45)] backdrop-blur-2xl backdrop-saturate-150"
      />

      <a
        href="#main"
        className="sr-only rounded-sm bg-ink px-4 py-2 text-sm text-white focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50"
      >
        Skip to content
      </a>

      <div className="relative mx-auto grid h-16 max-w-[78rem] grid-cols-[1fr_auto] items-center gap-6 px-5 sm:px-8 lg:h-[4.5rem] lg:grid-cols-[1fr_auto_1fr]">
        <Link
          href="/"
          aria-label="MoogleLabs home"
          className="justify-self-start text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet"
        >
          <MoogleLogo title="" className="h-[1.35rem] w-auto sm:h-[1.55rem]" />
        </Link>

        <nav aria-label="Primary" className="hidden lg:block">
          <NavLinks links={navLinks} />
        </nav>

        <div className="flex items-center gap-2 justify-self-end">
          {/* Ink at rest; warms to violet on hover, like the hero's primary CTA and its arrow chip */}
          <a
            href={contactCta.href}
            className="group hidden h-10 items-center gap-3 rounded-md bg-ink pr-1 pl-4 text-[0.9375rem] font-medium text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.14),0_8px_20px_-10px_rgb(20_22_59/0.7)] transition-[background-color,box-shadow] duration-300 hover:bg-violet-strong hover:shadow-[inset_0_1px_0_rgb(255_255_255/0.22),0_0_0_4px_rgb(121_93_245/0.14),0_10px_24px_-10px_rgb(91_63_214/0.85)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet sm:inline-flex lg:h-11"
          >
            {contactCta.label}
            <span className="flex size-8 items-center justify-center rounded-xs bevel-glass transition-[color,background-color,box-shadow] duration-300 group-hover:bevel-white group-hover:text-violet-strong lg:size-9">
              <LuArrowRight
                aria-hidden
                className="size-4 transition-transform duration-300 ease-out-soft group-hover:translate-x-0.5"
              />
            </span>
          </a>
          <MobileMenu links={navLinks} cta={contactCta} />
        </div>
      </div>
    </header>
  );
}
