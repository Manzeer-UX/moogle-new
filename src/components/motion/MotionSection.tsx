"use client";

import { useEffect, useRef, type ComponentPropsWithoutRef } from "react";

/**
 * A <section> that pauses the CSS animations running inside it while it is off screen, and
 * resumes them a little before it scrolls back in. Lenis scrolls the page from the main thread,
 * and animations of paint properties (SVG dash packets, gradient sweeps) cost main-thread time
 * every frame even where nobody can see them.
 *
 * It pauses the animations themselves (Web Animations API) rather than toggling a class: a class
 * on the section would restyle everything inside it at once, a dropped frame in the middle of the
 * scroll. Only animations it paused are resumed, so finished one-shot entrances don't replay, and
 * animations that start while the section is off screen (content that mounts late) are held too.
 */
export function MotionSection(props: ComponentPropsWithoutRef<"section">) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = ref.current;
    if (!section) return;
    let offScreen = false;
    let held: Animation[] = [];

    const hold = (animations: Animation[]) => {
      for (const animation of animations) {
        if (animation.playState !== "running") continue;
        animation.pause();
        held.push(animation);
      }
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        offScreen = !entry.isIntersecting;
        if (offScreen) {
          hold(section.getAnimations({ subtree: true }));
        } else {
          for (const animation of held) animation.play();
          held = [];
        }
      },
      { rootMargin: "200px 0px" },
    );
    const onAnimationStart = (event: AnimationEvent) => {
      if (!offScreen || !(event.target instanceof Element)) return;
      hold(
        event.target
          .getAnimations({ subtree: true })
          .filter((animation) => animation instanceof CSSAnimation && animation.animationName === event.animationName),
      );
    };

    observer.observe(section);
    section.addEventListener("animationstart", onAnimationStart);
    return () => {
      observer.disconnect();
      section.removeEventListener("animationstart", onAnimationStart);
    };
  }, []);

  return <section ref={ref} {...props} />;
}
