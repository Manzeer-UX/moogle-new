/**
 * Hover for a cell of an outlined hairline grid (Testimonials, Why MoogleLabs): a faint lavender
 * wash, and a violet line gliding in along the cell's top edge from the left. Put CELL_HOVER on the
 * cell and CellGlide inside it; descendants can respond with `group-hover:`.
 */
export const CELL_HOVER = "group relative transition-colors duration-500 hover:bg-violet-wash/60";

/** The gliding line, laid over the cell's top hairline (the box's border on the top row) */
export function CellGlide() {
  return (
    <span
      aria-hidden
      className="absolute -top-px right-0 -left-px h-px origin-left scale-x-0 bg-violet transition-transform duration-500 ease-out-soft group-hover:scale-x-100 motion-reduce:transition-none"
    />
  );
}
