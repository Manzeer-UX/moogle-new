import { Fragment } from "react";
import type { IconType } from "react-icons";
import {
  LuBrainCircuit,
  LuCloud,
  LuCodeXml,
  LuDatabase,
  LuPlus,
  LuScale,
  LuShieldCheck,
  LuSparkles,
  LuWorkflow,
} from "react-icons/lu";

const ICONS: Record<string, IconType> = {
  AI: LuBrainCircuit,
  Data: LuDatabase,
  Engineering: LuCodeXml,
  Cloud: LuCloud,
  Security: LuShieldCheck,
  Governance: LuScale,
  Automation: LuWorkflow,
};

/**
 * "AI + Data + … + Automation" as chips strung on a wire. On desktop the wire runs edge to edge
 * behind the chips and a packet travels along it, like the routes in the Industries section.
 */
export function CapabilityChain({ items }: { items: string[] }) {
  return (
    <div className="relative mt-12 lg:mt-14">
      <div aria-hidden className="absolute inset-x-0 top-1/2 hidden h-px overflow-hidden bg-line lg:block">
        <span className="absolute inset-y-0 left-0 w-48 bg-linear-to-r from-transparent via-violet to-transparent motion-safe:animate-wire-run motion-reduce:hidden" />
      </div>

      <div
        role="list"
        aria-label="Capabilities"
        className="relative mx-auto flex max-w-[78rem] flex-wrap items-center gap-x-2 gap-y-3 px-5 sm:px-8 lg:flex-nowrap lg:justify-between lg:gap-x-0"
      >
        {items.map((item, index) => {
          const Icon = ICONS[item] ?? LuSparkles;
          return (
            <Fragment key={item}>
              {index > 0 && (
                <span
                  aria-hidden
                  className="flex size-6 shrink-0 items-center justify-center rounded-full bg-surface text-violet-strong ring-1 ring-line"
                >
                  <LuPlus className="size-3.5" />
                </span>
              )}
              <span
                role="listitem"
                className="inline-flex shrink-0 items-center gap-2.5 rounded-sm bg-surface py-1.5 pr-3.5 pl-1.5 text-[0.9375rem] font-medium text-ink shadow-[0_1px_2px_rgb(20_22_59/0.05),0_8px_20px_-14px_rgb(20_22_59/0.35)] ring-1 ring-line"
              >
                <span className="flex size-7 items-center justify-center rounded-xs bg-violet-wash text-violet-strong">
                  <Icon aria-hidden className="size-4" />
                </span>
                {item}
              </span>
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}
