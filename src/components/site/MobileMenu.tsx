"use client";

import { useEffect, useId, useRef, useState } from "react";
import { LuArrowRight, LuMenu, LuX } from "react-icons/lu";

type NavLink = { readonly label: string; readonly href: string };

type MobileMenuProps = {
  links: readonly NavLink[];
  cta: NavLink;
};

/** Menu button plus a full-width glass sheet that drops from under the header bar. */
export function MobileMenu({ links, cta }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    const closeOnEscape = (event: KeyboardEvent) => event.key === "Escape" && close();
    const closeOnOutsidePress = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) close();
    };
    const desktop = window.matchMedia("(min-width: 1024px)");
    const closeOnDesktop = () => desktop.matches && close();

    window.addEventListener("keydown", closeOnEscape);
    document.addEventListener("pointerdown", closeOnOutsidePress);
    desktop.addEventListener("change", closeOnDesktop);
    return () => {
      window.removeEventListener("keydown", closeOnEscape);
      document.removeEventListener("pointerdown", closeOnOutsidePress);
      desktop.removeEventListener("change", closeOnDesktop);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="lg:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex size-10 items-center justify-center rounded-md bevel-white text-ink transition-[color,background-color,box-shadow] duration-200 hover:bevel-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet"
      >
        <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
        {open ? (
          <LuX aria-hidden className="size-5" />
        ) : (
          <LuMenu aria-hidden className="size-5" />
        )}
      </button>

      <div
        id={panelId}
        hidden={!open}
        className="absolute inset-x-0 top-full border-b border-ink/[0.08] bg-white/90 shadow-[0_24px_40px_-28px_rgb(20_22_59/0.45)] backdrop-blur-2xl backdrop-saturate-150"
      >
        <nav aria-label="Mobile" className="px-5 pt-1 pb-6 sm:px-8">
          <ul>
            {links.map((link) => (
              <li key={link.href} className="border-b border-ink/[0.06]">
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="group flex items-center justify-between py-3.5 text-[1.0625rem] text-ink transition-colors hover:text-violet-strong"
                >
                  {link.label}
                  <LuArrowRight
                    aria-hidden
                    className="size-4 -translate-x-1 text-violet-strong opacity-0 transition-[opacity,translate] duration-300 ease-out-soft group-hover:translate-x-0 group-hover:opacity-100"
                  />
                </a>
              </li>
            ))}
          </ul>
          <a
            href={cta.href}
            onClick={() => setOpen(false)}
            className="group mt-5 flex h-12 items-center justify-center gap-3 rounded-md bg-ink text-[0.9375rem] font-medium text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.14)] transition-colors duration-300 hover:bg-violet-strong sm:hidden"
          >
            {cta.label}
            <LuArrowRight aria-hidden className="size-4 transition-transform duration-300 ease-out-soft group-hover:translate-x-0.5" />
          </a>
        </nav>
      </div>
    </div>
  );
}
