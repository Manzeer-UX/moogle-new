import { delivery } from "@/content/home";
import { StageAccordion } from "./StageAccordion";
import { StageColumns } from "./StageColumns";

/** Violet light from the upper right and along the base, mirrored from the Industries band's corners */
const GLOW = [
  "radial-gradient(48rem 26rem at 96% 0%, rgb(121 93 245 / 0.26), transparent 70%)",
  "radial-gradient(60rem 22rem at 30% 100%, rgb(91 63 214 / 0.20), transparent 72%)",
].join(", ");

/**
 * "Delivery Stages" (section 8), the #approach anchor: a dark band after the light Enterprise
 * Stack. The heading and the two engagement lengths (from FAQ answer 7) sit on the container;
 * below, the seven stages as expanding columns in one outlined box (StageColumns from lg,
 * stacked as StageAccordion below it).
 */
export function DeliveryStagesSection() {
  const { heading, figures, ...explorer } = delivery;

  return (
    <section
      id="approach"
      aria-labelledby="stages-title"
      className="relative isolate overflow-hidden bg-ink py-24 text-white selection:bg-violet/45 selection:text-white sm:py-28 lg:py-32"
    >
      <div aria-hidden className="absolute inset-0 -z-10" style={{ backgroundImage: GLOW }} />
      <div aria-hidden className="grain-overlay -z-10" />

      <div className="mx-auto max-w-[78rem] px-5 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-16">
          <div className="@container max-w-[36rem]">
            <h2 id="stages-title" className="type-section text-white">
              {heading}
            </h2>
          </div>

          <dl className="flex gap-8 sm:gap-14">
            {figures.map((figure) => (
              <div key={figure.value} className="flex flex-col">
                <dt className="mt-2 max-w-[11rem] text-[0.875rem] leading-snug text-white/55">{figure.label}</dt>
                <dd className="order-first text-[1.625rem] leading-none font-[560] tracking-[-0.02em] whitespace-nowrap text-white tabular-nums [font-stretch:110%] sm:text-[2.25rem]">
                  {figure.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="mt-14 lg:mt-16">
        <StageColumns {...explorer} />
        <StageAccordion {...explorer} />
      </div>
    </section>
  );
}
