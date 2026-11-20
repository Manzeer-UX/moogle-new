import { LuArrowRight } from "react-icons/lu";
import type { DeliveryStage } from "@/content/home";

export type StageLabels = {
  focus: string;
  execution: string;
  outcome: string;
  solves: string;
};

/** What both stage layouts take (StageColumns from lg, StageAccordion below it) */
export type StageExplorerProps = {
  stages: DeliveryStage[];
  labels: StageLabels;
  governance: { title: string; description: string };
};

const TERM = "text-[0.8125rem] text-white/45";

/** A stage's "Solves" links: the services that stage delivers */
export function SolvesLinks({ stage, label }: { stage: DeliveryStage; label: string }) {
  return (
    <div>
      <p className={TERM}>{label}</p>
      <ul className="mt-2.5 space-y-2">
        {stage.solves.map((link) => {
          // The arrow stays on the last word's line when the label wraps
          const split = link.label.lastIndexOf(" ") + 1;
          return (
            <li key={link.label}>
              <a
                href={link.href}
                className="group text-[0.9375rem] leading-snug font-medium text-violet-soft transition-colors duration-200 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-soft"
              >
                {link.label.slice(0, split)}
                <span className="whitespace-nowrap">
                  {link.label.slice(split)}
                  <LuArrowRight
                    aria-hidden
                    className="ml-1.5 inline-block size-4 align-[-0.2em] transition-transform duration-300 ease-out-soft group-hover:translate-x-0.5"
                  />
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/** Focus, engineering execution and enterprise outcome as a stacked list (the mobile layout) */
export function StageFactsStacked({ stage, labels }: { stage: DeliveryStage; labels: StageLabels }) {
  return (
    <div className="space-y-5">
      <dl className="space-y-5">
        <div>
          <dt className={TERM}>{labels.focus}</dt>
          <dd className="mt-1.5 text-[0.9375rem] leading-relaxed text-white/85">{stage.focus}</dd>
        </div>
        <div>
          <dt className={TERM}>{labels.execution}</dt>
          <dd className="mt-1.5 text-[0.9375rem] leading-relaxed text-white/70">{stage.execution}</dd>
        </div>
        <div>
          <dt className={TERM}>{labels.outcome}</dt>
          <dd className="mt-1.5 text-[1.0625rem] leading-snug font-medium text-white">{stage.outcome}</dd>
        </div>
      </dl>
      <SolvesLinks stage={stage} label={labels.solves} />
    </div>
  );
}

export { TERM as STAGE_TERM_CLASS };
