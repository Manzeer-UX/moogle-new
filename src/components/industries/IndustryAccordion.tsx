"use client";

import { useId, useState } from "react";
import { LuArrowRight, LuChevronDown, LuSparkles } from "react-icons/lu";
import { INDUSTRY_ICONS, pad2 } from "./industryIcons";
import type { IndustryExplorerProps } from "./IndustryFlow";

/**
 * Below lg the flow diagram becomes an edge-to-edge accordion: one row per sector, opening to its
 * use cases. Row content keeps the page gutter, so it lines up with the heading above.
 */
export function IndustryAccordion({ items, useCasesLabel, cta }: IndustryExplorerProps) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);
  const uid = useId();

  return (
    <div className="lg:hidden">
      <ul className="divide-y divide-white/[0.08] border-y border-white/10 bg-white/[0.02]">
        {items.map((item, index) => {
          const open = item.id === openId;
          const Icon = INDUSTRY_ICONS[item.id] ?? LuSparkles;
          const triggerId = `${uid}-${item.id}-trigger`;
          const panelId = `${uid}-${item.id}-panel`;
          return (
            <li key={item.id} className={`transition-colors duration-300 ${open ? "bg-white/[0.05]" : ""}`}>
              <h3>
                <button
                  id={triggerId}
                  type="button"
                  aria-expanded={open}
                  aria-controls={panelId}
                  onClick={() => setOpenId(open ? null : item.id)}
                  className="flex w-full items-center gap-3.5 px-5 py-3.5 text-left transition-colors duration-200 hover:bg-white/[0.04] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-violet-soft sm:px-8"
                >
                  <span
                    className={`flex size-9 shrink-0 items-center justify-center rounded-sm transition-[color,background-color,box-shadow] duration-300 ${
                      open ? "bevel-violet" : "bevel-dark"
                    }`}
                  >
                    <Icon aria-hidden className="size-[1.05rem]" />
                  </span>
                  <span className="flex-1 text-base leading-snug font-medium text-white">{item.name}</span>
                  <span aria-hidden className="text-[0.75rem] text-white/40 tabular-nums">
                    {pad2(index + 1)}
                  </span>
                  <LuChevronDown
                    aria-hidden
                    className={`size-4 shrink-0 transition-[rotate,color] duration-300 ease-out-soft ${
                      open ? "rotate-180 text-violet-soft" : "text-white/45"
                    }`}
                  />
                </button>
              </h3>
              <div
                id={panelId}
                role="region"
                aria-labelledby={triggerId}
                inert={!open}
                className={`grid transition-[grid-template-rows] duration-300 ease-out-soft motion-reduce:transition-none ${
                  open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">
                  {/* Indent = gutter + icon tile (2.25rem) + gap (0.875rem), so text lines up with the name */}
                  <div className="pr-5 pb-5 pl-[4.375rem] sm:pr-8 sm:pl-[5.125rem]">
                    <p className="text-[0.8125rem] text-white/55">{useCasesLabel}</p>
                    <ul className="mt-2.5 space-y-2">
                      {item.useCases.map((useCase) => (
                        <li key={useCase} className="flex items-center gap-3 text-[0.9375rem] leading-snug text-white/85">
                          <span aria-hidden className="size-1.5 shrink-0 rounded-xs bg-violet-soft" />
                          {useCase}
                        </li>
                      ))}
                    </ul>
                    <a
                      href={cta.href}
                      className="group mt-4 inline-flex items-center gap-2 text-[0.9375rem] font-medium text-violet-soft transition-colors duration-200 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-soft"
                    >
                      {cta.label}
                      <LuArrowRight
                        aria-hidden
                        className="size-4 transition-transform duration-300 ease-out-soft group-hover:translate-x-0.5"
                      />
                    </a>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
