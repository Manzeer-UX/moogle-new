"use client";

import { useId, useState } from "react";
import { LuChevronDown, LuShieldCheck } from "react-icons/lu";
import { StageFactsStacked, type StageExplorerProps } from "./StageFacts";

/**
 * Below lg the seven columns stack into one outlined box: a row per stage, hairlines between them,
 * each opening to its details. The open row takes the deepest tint and a violet line along its
 * top; the governance strip closes the box, as on desktop.
 */
export function StageAccordion({ stages, labels, governance }: StageExplorerProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const uid = useId();

  return (
    <div className="mx-auto max-w-[78rem] px-5 sm:px-8 lg:hidden">
      <div className="border border-white/12">
        <ol>
          {stages.map((stage, index) => {
            const open = index === openIndex;
            const triggerId = `${uid}-${index}-trigger`;
            const panelId = `${uid}-${index}-panel`;
            return (
              <li
                key={stage.number}
                className={`relative border-white/10 transition-colors duration-300 ${index > 0 ? "border-t" : ""} ${
                  open ? "bg-violet/[0.1]" : ""
                }`}
              >
                <span
                  aria-hidden
                  className={`absolute inset-x-0 -top-px h-px origin-left bg-violet-soft transition-transform duration-500 ease-out-soft motion-reduce:transition-none ${
                    open ? "scale-x-100" : "scale-x-0"
                  }`}
                />
                <h3>
                  <button
                    id={triggerId}
                    type="button"
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={() => setOpenIndex(open ? null : index)}
                    className="flex w-full cursor-pointer items-baseline gap-3 px-5 py-4 text-left focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-violet-soft sm:px-6"
                  >
                    <span className="text-[0.75rem] text-white/40 tabular-nums">{stage.number}</span>
                    <span className={`text-[1.0625rem] font-medium ${open ? "text-white" : "text-white/75"}`}>
                      {stage.name}
                    </span>
                    <span className="ml-auto shrink-0 text-[0.8125rem] text-violet-soft">{stage.duration}</span>
                    <LuChevronDown
                      aria-hidden
                      className={`size-4 shrink-0 self-center transition-[rotate,color] duration-300 ease-out-soft ${
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
                    <div className="px-5 pt-1 pb-7 sm:px-6">
                      <StageFactsStacked stage={stage} labels={labels} />
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>

        {/* Governance runs under every stage */}
        <p className="flex items-start gap-3 border-t border-white/10 px-5 py-4 text-[0.875rem] leading-relaxed text-white/55 sm:px-6">
          <span aria-hidden className="flex size-7 shrink-0 items-center justify-center rounded-xs bevel-dark">
            <LuShieldCheck className="size-3.5" />
          </span>
          <span>
            <span className="font-medium text-white">{governance.title}</span> {governance.description}
          </span>
        </p>
      </div>
    </div>
  );
}
