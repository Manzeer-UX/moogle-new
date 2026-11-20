"use client";

import { useId, useState } from "react";
import type { IconType } from "react-icons";
import {
  LuBadgeCheck,
  LuBot,
  LuBrainCircuit,
  LuChevronDown,
  LuCloudCog,
  LuCpu,
  LuDatabase,
  LuFlaskConical,
  LuNetwork,
  LuShieldCheck,
  LuSparkles,
  LuWorkflow,
} from "react-icons/lu";
import type { Service } from "@/content/home";

const ICONS: Record<string, IconType> = {
  "ai-implementation": LuCpu,
  "enterprise-intelligence": LuBrainCircuit,
  "agentic-operations": LuBot,
  "workflow-automation": LuWorkflow,
  "ai-ready-data": LuDatabase,
  "ai-cloud-reliability": LuCloudCog,
  "ai-security-governance": LuShieldCheck,
  "ai-testing": LuFlaskConical,
  "ai-quality-engineering": LuBadgeCheck,
  "web3-decentralized-ai": LuNetwork,
};

/** Floating card on a category tile: one row per service, each opening to its description. */
export function ServiceCard({ services }: { services: Service[] }) {
  const [openId, setOpenId] = useState<string | null>(services[0]?.id ?? null);
  const uid = useId();

  return (
    <div className="w-full max-w-[22rem] rounded-lg bg-white/30 p-1.5 shadow-[0_28px_60px_-28px_rgb(20_22_59/0.6)] ring-1 ring-white/50 backdrop-blur-[6px]">
      <div className="overflow-hidden rounded-xs bg-surface ring-1 ring-ink/[0.06]">
        <p className="flex items-center gap-2 px-4 pt-3.5 pb-2.5 text-[0.75rem] text-slate">
          <span aria-hidden className="size-1.5 rounded-xs bg-violet" />
          {services.length} {services.length === 1 ? "service" : "services"}
        </p>
        <ul className="divide-y divide-line-soft border-t border-line-soft">
          {services.map((service) => {
            const open = service.id === openId;
            const Icon = ICONS[service.id] ?? LuSparkles;
            const triggerId = `${uid}-${service.id}-trigger`;
            const panelId = `${uid}-${service.id}-panel`;
            return (
              <li key={service.id}>
                <h4>
                  <button
                    id={triggerId}
                    type="button"
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={() => setOpenId(open ? null : service.id)}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors duration-200 hover:bg-violet-wash/60 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-violet"
                  >
                    <span
                      className={`flex size-8 shrink-0 items-center justify-center rounded-sm transition-[color,background-color,box-shadow] duration-300 ${
                        open ? "bevel-violet" : "bevel-light"
                      }`}
                    >
                      <Icon aria-hidden className="size-4" />
                    </span>
                    <span className="flex-1 text-[0.9375rem] leading-snug font-medium text-ink">
                      {service.name}
                    </span>
                    <LuChevronDown
                      aria-hidden
                      className={`size-4 shrink-0 transition-[rotate,color] duration-300 ease-out-soft ${
                        open ? "rotate-180 text-violet-strong" : "text-slate/60"
                      }`}
                    />
                  </button>
                </h4>
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
                    <p className="pr-4 pb-3.5 pl-[3.75rem] text-[0.875rem] leading-relaxed text-slate">
                      {service.description}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
