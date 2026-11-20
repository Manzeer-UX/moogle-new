import type { HTMLAttributes } from "react";
import { MoogleMark } from "./MoogleMark";

/**
 * The MoogleLabs mark as a square 3D tile: lit bevel, glossy top band, embossed glyph and a
 * depth shadow. Size it with a size-* class. Styles live in globals.css (.mark-tile*).
 */
export function MarkTile({ className = "", ...rest }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={`mark-tile ${className}`} {...rest}>
      <span className="mark-tile-face">
        <MoogleMark className="mark-tile-glyph h-[47%] w-auto" />
      </span>
    </span>
  );
}
