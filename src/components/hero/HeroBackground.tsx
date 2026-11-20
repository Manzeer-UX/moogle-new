import LineWaves from "@/components/backgrounds/LineWaves";

/**
 * Light, low-contrast line field behind the hero. Brand violets are drawn as soft inks
 * (lightMode) at low opacity, fading at the edges, with a calm zone behind the copy so the
 * headline stays the focus.
 */
export function HeroBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
      <LineWaves
        lightMode
        color1="#795df5"
        color2="#5b3fd6"
        color3="#a08cf8"
        colorCycleSpeed={0.6}
        speed={0.18}
        lineCount={54}
        lineWidth={1}
        glow={0.3}
        highlight={0.7}
        highlightWidth={1.2}
        warpIntensity={1.05}
        warpScale={1.1}
        rotation={-24}
        edgeFade={0.35}
        mouseInfluence={1}
        clickRipple={false}
        opacity={0.22}
      />
      {/* Calm zone behind the copy (top of the stack on phones, left column from lg) */}
      <div className="absolute inset-0 bg-[radial-gradient(70%_42%_at_45%_30%,var(--color-paper)_0%,rgb(250_250_253/0.7)_45%,transparent_80%)] lg:bg-[radial-gradient(38%_52%_at_26%_50%,var(--color-paper)_0%,rgb(250_250_253/0.65)_50%,transparent_85%)]" />
      {/* Melts the hero into the page below */}
      <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-b from-transparent to-paper" />
    </div>
  );
}
