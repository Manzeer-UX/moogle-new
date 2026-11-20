import { useId, type SVGProps } from "react";

/** "Dev" and "Forge", outlined, verbatim from devforge.ai/site-logo.svg */
const DEV =
  "M33.465 22H28.6981V8.75062H33.3381C37.2531 8.75062 39.9537 11.4512 39.9537 15.4025C39.9537 19.2994 37.3075 22 33.465 22ZM33.1206 10.8894H31.0181V19.8612H33.2475C35.8937 19.8612 37.5069 18.1575 37.5069 15.4025C37.5069 12.5931 35.8575 10.8894 33.1206 10.8894ZM45.7942 22.2356C43.1299 22.2356 41.263 20.2962 41.263 17.5231C41.263 14.7137 43.0936 12.7744 45.7217 12.7744C48.4042 12.7744 50.108 14.5687 50.108 17.36V18.0306L43.3655 18.0487C43.5286 19.6256 44.3624 20.4231 45.8305 20.4231C47.0449 20.4231 47.8424 19.9519 48.0961 19.1H50.1442C49.7636 21.0575 48.1324 22.2356 45.7942 22.2356ZM45.7399 14.5869C44.4349 14.5869 43.6374 15.2937 43.4199 16.635H47.9149C47.9149 15.4025 47.063 14.5869 45.7399 14.5869ZM54.0258 22L50.4733 13.0462H52.8296L54.3883 17.1606C54.7689 18.23 55.0771 19.1544 55.1858 19.6437C55.3127 19.0819 55.6389 18.1394 56.0196 17.1606L57.6508 13.0462H59.9346L56.2008 22H54.0258Z";
const FORGE =
  "M68.782 16.5806H63.852V22H61.532V8.75062H69.7245V10.8894H63.852V14.4962H68.782V16.5806ZM70.2736 17.505C70.2736 14.7137 72.2855 12.7925 75.0586 12.7925C77.8317 12.7925 79.8436 14.7137 79.8436 17.505C79.8436 20.2962 77.8317 22.2175 75.0586 22.2175C72.2855 22.2175 70.2736 20.2962 70.2736 17.505ZM72.4848 17.505C72.4848 19.1362 73.5361 20.2419 75.0586 20.2419C76.5811 20.2419 77.6323 19.1362 77.6323 17.505C77.6323 15.8737 76.5811 14.7681 75.0586 14.7681C73.5361 14.7681 72.4848 15.8737 72.4848 17.505ZM87.2151 13.01V15.0581H86.3995C84.8045 15.0581 83.8076 15.91 83.8076 17.65V22H81.5963V13.0644H83.6807L83.8076 14.3694C84.1882 13.4812 85.0401 12.8831 86.2363 12.8831C86.5445 12.8831 86.8526 12.9194 87.2151 13.01ZM87.9742 17.3237C87.9742 14.7137 89.678 12.7562 92.2336 12.7562C93.5748 12.7562 94.6261 13.3181 95.1517 14.2787L95.2786 13.0462H97.3267V21.5469C97.3267 24.5375 95.5323 26.4044 92.6323 26.4044C90.0586 26.4044 88.3005 24.9363 88.0286 22.5438H90.2398C90.3848 23.7038 91.273 24.3925 92.6323 24.3925C94.1548 24.3925 95.1336 23.4319 95.1336 21.9456V20.4594C94.5717 21.2931 93.4661 21.8187 92.1792 21.8187C89.6417 21.8187 87.9742 19.9156 87.9742 17.3237ZM90.2036 17.2694C90.2036 18.7737 91.1642 19.8975 92.6142 19.8975C94.1367 19.8975 95.0792 18.8281 95.0792 17.2694C95.0792 15.7469 94.1548 14.6956 92.6142 14.6956C91.1461 14.6956 90.2036 15.8012 90.2036 17.2694ZM103.621 22.2356C100.956 22.2356 99.0895 20.2962 99.0895 17.5231C99.0895 14.7137 100.92 12.7744 103.548 12.7744C106.231 12.7744 107.935 14.5687 107.935 17.36V18.0306L101.192 18.0487C101.355 19.6256 102.189 20.4231 103.657 20.4231C104.871 20.4231 105.669 19.9519 105.923 19.1H107.971C107.59 21.0575 105.959 22.2356 103.621 22.2356ZM103.566 14.5869C102.261 14.5869 101.464 15.2937 101.246 16.635H105.741C105.741 15.4025 104.89 14.5869 103.566 14.5869Z";

/** The hexagon ring: its outline, then the same outline inset by the ring's 3-unit width */
const RING =
  "M0 24.0766V7.92339L10 3L20 7.92339V24.0766L10 29L0 24.0766Z M3 22.2097V9.7903L10 6.3439L17 9.7903V22.2097L10 25.6561L3 22.2097Z";

/**
 * One band per edge of the ring, clockwise from the lower-right corner; neighbouring bands meet
 * along the corner mitres. Each runs a gradient along its edge between the colours the logo's
 * conic gradient (#0078D4 → #ABDBFF) has at its two corners, so the seam sits at the lower-right
 * corner, where the bottom-right band starts deep blue against the right band's pale end.
 */
const BANDS = [
  { points: "20,24.0766 10,29 10,25.6561 17,22.2097", from: [20, 24.0766], to: [10, 29], stops: ["#0078D4", "#1B88DB"] },
  { points: "10,29 0,24.0766 3,22.2097 10,25.6561", from: [10, 29], to: [0, 24.0766], stops: ["#1B88DB", "#2F93E0"] },
  { points: "0,24.0766 0,7.92339 3,9.7903 3,22.2097", from: [0, 24.0766], to: [0, 7.92339], stops: ["#2F93E0", "#55A9E9"] },
  { points: "0,7.92339 10,3 10,6.3439 3,9.7903", from: [0, 7.92339], to: [10, 3], stops: ["#55A9E9", "#71B9F0"] },
  { points: "10,3 20,7.92339 17,9.7903 10,6.3439", from: [10, 3], to: [20, 7.92339], stops: ["#71B9F0", "#84C5F5"] },
  { points: "20,7.92339 20,24.0766 17,22.2097 17,9.7903", from: [20, 7.92339], to: [20, 24.0766], stops: ["#84C5F5", "#ABDBFF"] },
] as const;

/**
 * DevForge's logo from devforge.ai: the hexagon ring and the "DevForge" wordmark. The site's
 * export paints the ring's conic gradient through a foreignObject, which renders unreliably, so
 * the ring is rebuilt from six gradient bands with the same colours. "Dev" takes currentColor
 * (white on the site's dark header), so the logo reads on light surfaces too.
 */
export function DevForgeLogo(props: Omit<SVGProps<SVGSVGElement>, "viewBox">) {
  const uid = useId();

  return (
    <svg viewBox="0 2 109 28" fill="none" aria-hidden {...props}>
      <defs>
        {BANDS.map((band, index) => (
          <linearGradient
            key={band.points}
            id={`${uid}-band-${index}`}
            gradientUnits="userSpaceOnUse"
            x1={band.from[0]}
            y1={band.from[1]}
            x2={band.to[0]}
            y2={band.to[1]}
          >
            <stop offset="0" stopColor={band.stops[0]} />
            <stop offset="1" stopColor={band.stops[1]} />
          </linearGradient>
        ))}
      </defs>
      {/* A mid-blue ring under the bands, so no background shows through where two bands meet */}
      <path d={RING} fill="#2F93E0" fillRule="evenodd" />
      {BANDS.map((band, index) => (
        <polygon key={band.points} points={band.points} fill={`url(#${uid}-band-${index})`} />
      ))}
      <path d={DEV} fill="currentColor" />
      <path d={FORGE} fill="#0D80D7" />
    </svg>
  );
}
