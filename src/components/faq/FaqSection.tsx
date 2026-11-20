import { LuArrowRight, LuPlus } from "react-icons/lu";
import { pad2 } from "@/components/industries/industryIcons";
import { faq } from "@/content/home";

/** Splits on the source's **emphasis** markers: odd parts are emphasised */
const EMPHASIS = /\*\*(.+?)\*\*/g;

const plainText = (text: string) => text.replace(EMPHASIS, "$1");

function richText(text: string) {
  return text.split(EMPHASIS).map((part, index) =>
    index % 2 === 1 ? (
      <strong key={index} className="font-semibold text-ink">
        {part}
      </strong>
    ) : (
      part
    ),
  );
}

/**
 * "Frequently Asked Questions" (section 13): light, after the dark CTA panel. Native exclusive
 * <details> (one open at a time, no JavaScript); the answers slide open where the browser
 * supports animating ::details-content (.faq-item in globals.css). The questions are also
 * published as FAQPage structured data.
 */
export function FaqSection() {
  const { heading, cta, items } = faq;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: plainText(item.answer) },
    })),
  };

  return (
    <section id="faq" aria-labelledby="faq-title" className="relative bg-paper py-24 sm:py-28 lg:py-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      <div className="mx-auto grid max-w-[78rem] gap-12 px-5 sm:px-8 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-16 xl:grid-cols-[minmax(0,23rem)_minmax(0,1fr)] xl:gap-24">
        <div className="@container lg:sticky lg:top-28 lg:self-start">
          <h2 id="faq-title" className="type-section text-ink">
            {heading}
          </h2>
          <a
            href={cta.href}
            className="group mt-8 inline-flex items-center gap-2 border-b border-violet/30 pb-1 text-[0.9375rem] font-medium text-violet-strong transition-colors duration-200 hover:border-violet hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet"
          >
            {cta.label}
            <LuArrowRight
              aria-hidden
              className="size-4 transition-transform duration-300 ease-out-soft group-hover:translate-x-0.5"
            />
          </a>
        </div>

        <div className="border-t border-line">
          {items.map((item, index) => (
            <details key={item.id} name="faq" open={index === 0} className="faq-item group border-b border-line">
              <summary className="flex items-start gap-4 py-6 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet sm:gap-6">
                <span aria-hidden className="mt-1 w-6 shrink-0 text-[0.8125rem] text-slate/60 tabular-nums">
                  {pad2(index + 1)}
                </span>
                <span className="flex-1 text-[1.0625rem] leading-snug font-medium text-ink text-pretty sm:text-[1.1875rem]">
                  {item.question}
                </span>
                <span
                  aria-hidden
                  className="flex size-8 shrink-0 items-center justify-center rounded-sm bevel-light transition-[color,background-color,box-shadow] duration-300 group-open:bevel-violet"
                >
                  <LuPlus className="size-4 transition-transform duration-300 ease-out-soft group-open:rotate-45" />
                </span>
              </summary>
              <div className="pr-12 pb-7 pl-10 sm:pr-14 sm:pl-12">
                <p className="max-w-[44rem] text-base leading-relaxed text-pretty text-slate">{richText(item.answer)}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
