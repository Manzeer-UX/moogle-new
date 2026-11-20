"use client";

import { ReactLenis } from "lenis/react";
import type { ReactNode } from "react";

/**
 * Lenis smooth scrolling on the window. In-page `#anchor` links glide through Lenis too, and
 * still land below the floating header because Lenis reads `scroll-padding-top` from <html>.
 * Visitors who prefer reduced motion get native scrolling (Lenis's `respectReducedMotion`).
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <ReactLenis root options={{ anchors: true, lerp: 0.1 }}>
      {children}
    </ReactLenis>
  );
}
