import Image from "next/image";
import { LuUserRound } from "react-icons/lu";
import { CELL_HOVER, CellGlide } from "@/components/effects/gridCell";
import { testimonials, type Testimonial } from "@/content/home";

/**
 * Where each of the five quotes sits: stacked on phones; two columns from md, the fifth spanning
 * both; three over two from xl. Hairlines run between the cells, every one from border to border
 * of the box. Cells on the box's sides take the wider outer padding, so the text keeps its margin.
 */
const CELL_LAYOUT = [
  // Top left
  "md:pr-8 md:pl-10 xl:col-span-2 xl:pr-12 xl:pl-16",
  // Top middle
  "border-t md:border-t-0 md:border-l md:pr-10 md:pl-8 xl:col-span-2 xl:px-12",
  // Top right (md: second row, left)
  "border-t md:pr-8 md:pl-10 xl:col-span-2 xl:border-t-0 xl:border-l xl:pr-16 xl:pl-12",
  // Bottom left (md: second row, right)
  "border-t md:border-l md:pr-10 md:pl-8 xl:col-span-3 xl:border-l-0 xl:pr-12 xl:pl-16",
  // Bottom right (md: full width)
  "border-t md:col-span-2 md:px-10 xl:col-span-3 xl:border-l xl:pr-16 xl:pl-12",
];

/**
 * "Testimonials" (section 11): light, between the dark Operating Model band and the dark CTA panel.
 * An editorial grid in one outlined box, the quotes set large over a small square headshot with
 * the client's name and role, every author line sitting on its cell's base. Hovering a cell washes
 * it in faint lavender, glides a violet line along its top edge and warms its avatar to violet.
 *
 * The quotes in content/home.ts are placeholders until real, approved testimonials arrive; laid
 * out for five (three over two).
 */
export function TestimonialsSection() {
  const { heading, items } = testimonials;

  return (
    <section id="testimonials" aria-labelledby="testimonials-title" className="bg-paper py-24 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-[78rem] px-5 sm:px-8">
        <div className="@container max-w-[34rem]">
          <h2 id="testimonials-title" className="type-section text-ink">
            {heading}
          </h2>
        </div>

        <ul className="mt-12 grid border border-line md:grid-cols-2 lg:mt-16 xl:grid-cols-6">
          {items.map((item, index) => (
            <li
              key={item.id}
              className={`${CELL_HOVER} flex border-line px-5 py-10 sm:px-8 md:py-12 xl:py-16 ${CELL_LAYOUT[index] ?? "border-t"}`}
            >
              <CellGlide />
              <Quote item={item} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Quote({ item }: { item: Testimonial }) {
  return (
    <figure className="flex flex-1 flex-col">
      <blockquote className="max-w-[34rem] text-[1.25rem] leading-[1.32] tracking-[-0.015em] text-pretty text-ink md:text-[1.3125rem] xl:text-[1.5rem]">
        <p>
          <span aria-hidden className="text-violet">
            “
          </span>
          {item.quote}
          <span aria-hidden className="text-violet">
            ”
          </span>
        </p>
      </blockquote>

      <figcaption className="mt-auto flex items-center gap-4 pt-10 xl:pt-12">
        {item.photo ? (
          <Image
            src={item.photo}
            alt=""
            sizes="52px"
            className="size-12 shrink-0 rounded-xs object-cover ring-1 ring-ink/10 transition-shadow duration-500 group-hover:ring-violet/50 xl:size-13"
          />
        ) : (
          <span
            aria-hidden
            className="flex size-12 shrink-0 items-center justify-center rounded-xs bevel-light transition-[color,background-color,box-shadow] duration-500 group-hover:bevel-violet xl:size-13"
          >
            <LuUserRound className="size-5" />
          </span>
        )}
        <span className="text-[0.9375rem] leading-snug">
          <span className="block text-ink">{item.name}</span>
          <span className="block text-slate">{item.role}</span>
        </span>
      </figcaption>
    </figure>
  );
}
