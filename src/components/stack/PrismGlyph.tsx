import type { SVGProps } from "react";

/**
 * A prism splitting one beam into PRISM AI's spectrum (violet → cyan → green), echoing the
 * product site's hero. The outline and incoming beam use currentColor.
 */
export function PrismGlyph(props: Omit<SVGProps<SVGSVGElement>, "viewBox">) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden {...props}>
      <path d="M1.5 17H9" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" />
      <path d="M9 17L21.5 16" stroke="currentColor" strokeOpacity={0.35} strokeWidth={1.2} />
      <path d="M16 4.5L27.5 26H4.5L16 4.5Z" stroke="currentColor" strokeWidth={1.6} strokeLinejoin="round" />
      <g strokeWidth={1.6} strokeLinecap="round">
        <path d="M21.5 16L30.5 10.5" stroke="#795df5" />
        <path d="M21.5 16L30.5 16" stroke="#06b6d4" />
        <path d="M21.5 16L30.5 21.5" stroke="#10b981" />
      </g>
    </svg>
  );
}
