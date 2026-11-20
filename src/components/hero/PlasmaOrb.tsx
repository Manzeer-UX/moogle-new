"use client";

import { useEffect, useRef, useState } from "react";
import type { OrbWorkerMessage, OrbWorkerReply } from "./plasmaOrb.worker";
import type { PlasmaScene, PlasmaVariant, ViewWindow } from "./plasmaScene";

/** Share of the canvas the sphere's silhouette fills (camera framing in plasmaScene). OrbStage uses it to end the wires on the sphere's edge. */
export const SPHERE_FRACTION = 0.84;

/** Sharpest the canvas renders, in device pixels per CSS pixel */
const MAX_PIXEL_RATIO = 1.75;

/** What the component drives, whichever thread draws the orb */
type Orb = Pick<PlasmaScene, "resize" | "pointer" | "play"> & { dispose(): void };

/** The canvas's box: the whole orb, or with `view` just the slice of it that is on show */
type Layout = { width: number; height: number; view?: ViewWindow };

/**
 * The magic plasma sphere from orbital/magic-plasma-sphere-three-js, ported to a React canvas
 * in MoogleLabs violet (the scene is in plasmaScene.ts). Same plasma, glass shell and particles,
 * minus the settings GUI and orbit controls; for depth it adds a key-lit glass body, a specular
 * highlight, rim light, a smaller counter-rotating inner plasma and a wider lens. Leans gently
 * toward the pointer, pauses off-screen and in background tabs, and renders one still frame for
 * reduced motion.
 *
 * It renders in a Web Worker on an OffscreenCanvas, so drawing it never holds up the page's own
 * frames, and with them Lenis's scrolling (see plasmaOrb.worker.ts). Where a worker can't draw
 * WebGL it renders on the main thread instead. Without WebGL, or until the first frame is drawn,
 * a CSS gradient sphere stands in.
 *
 * `cropTo` (a selector for an ancestor that clips the orb) is for an orb far bigger than its frame,
 * like the final CTA's horizon: the canvas then covers only the part of the orb inside that
 * ancestor, and the scene draws just that slice of the full frame. Pair it with
 * `variant="horizon"`, the look tuned for an orb seen that close (see plasmaScene's LOOKS).
 */
export function PlasmaOrb({
  className = "",
  cropTo,
  variant = "orb",
}: {
  className?: string;
  cropTo?: string;
  variant?: PlasmaVariant;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const frame = cropTo ? host.closest(cropTo) : null;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pixelRatio = Math.min(window.devicePixelRatio, MAX_PIXEL_RATIO);
    let canvasEl: HTMLCanvasElement | null = null;
    let onScreen = true;
    let disposed = false;
    let orb: Orb | null = null;

    /** The whole host, or only its overlap with the frame (both rects move together, so scrolling never changes it) */
    const measure = (): Layout => {
      const box = host.getBoundingClientRect();
      if (!frame) return { width: box.width, height: box.height };
      const clip = frame.getBoundingClientRect();
      const left = Math.max(box.left, clip.left);
      const top = Math.max(box.top, clip.top);
      return {
        width: Math.round(Math.max(0, Math.min(box.right, clip.right) - left)),
        height: Math.round(Math.max(0, Math.min(box.bottom, clip.bottom) - top)),
        view: {
          fullWidth: Math.round(box.width),
          fullHeight: Math.round(box.height),
          x: Math.round(left - box.left),
          y: Math.round(top - box.top),
        },
      };
    };
    let layout = measure();

    /** Fills the host, or sits over the visible slice when cropped */
    const place = () => {
      if (!canvasEl) return;
      const { width, height, view } = layout;
      canvasEl.style.cssText = view
        ? `position:absolute;display:block;left:${view.x}px;top:${view.y}px;width:${width}px;height:${height}px;`
        : "position:absolute;inset:0;width:100%;height:100%;display:block;";
    };

    const running = () => !reducedMotion && onScreen && !document.hidden;
    const onFirstFrame = () => {
      if (!disposed) setReady(true);
    };
    const addCanvas = () => {
      const canvas = document.createElement("canvas");
      canvas.setAttribute("aria-hidden", "true");
      canvasEl = canvas;
      place();
      host.appendChild(canvas);
      return canvas;
    };
    /** A newly started orb takes the current size and play state */
    const adopt = (next: Orb) => {
      orb = next;
      next.resize(layout.width, layout.height, layout.view);
      next.play(running());
    };

    const startOnMainThread = async () => {
      const { createPlasmaScene } = await import("./plasmaScene");
      if (disposed) return;
      const canvas = addCanvas();
      const scene = createPlasmaScene(canvas, {
        pixelRatio,
        sphereFraction: SPHERE_FRACTION,
        still: reducedMotion,
        variant,
        frames: { request: (callback) => requestAnimationFrame(callback), cancel: (handle) => cancelAnimationFrame(handle) },
        onFirstFrame,
      });
      if (!scene) {
        canvas.remove(); // No WebGL: keep the CSS sphere
        return;
      }
      adopt({
        ...scene,
        dispose: () => {
          scene.dispose();
          canvas.remove();
        },
      });
    };

    /** False when this browser can't hand a canvas to a worker */
    const startInWorker = () => {
      if (typeof Worker === "undefined" || typeof HTMLCanvasElement.prototype.transferControlToOffscreen !== "function") {
        return false;
      }
      const canvas = addCanvas();
      let worker: Worker;
      try {
        const offscreen = canvas.transferControlToOffscreen();
        worker = new Worker(new URL("./plasmaOrb.worker.ts", import.meta.url), { type: "module" });
        const init: OrbWorkerMessage = {
          type: "init",
          canvas: offscreen,
          pixelRatio,
          sphereFraction: SPHERE_FRACTION,
          still: reducedMotion,
          variant,
        };
        worker.postMessage(init, [offscreen]);
      } catch {
        canvas.remove();
        return false;
      }
      const post = (message: OrbWorkerMessage) => worker.postMessage(message);
      const workerOrb: Orb = {
        resize: (width, height, view) => post({ type: "resize", width, height, view }),
        pointer: (x, y) => post({ type: "pointer", x, y }),
        play: (play) => post({ type: "play", running: play }),
        dispose: () => {
          worker.terminate();
          canvas.remove();
        },
      };
      // The worker couldn't draw (no WebGL or no animation frames there): draw on the main thread
      const fallBack = () => {
        if (orb !== workerOrb) return;
        workerOrb.dispose();
        orb = null;
        if (!disposed) void startOnMainThread();
      };
      worker.onmessage = ({ data }: MessageEvent<OrbWorkerReply>) => {
        if (data.type === "ready") onFirstFrame();
        else fallBack();
      };
      worker.onerror = fallBack;
      adopt(workerOrb);
      return true;
    };

    if (!startInWorker()) void startOnMainThread();

    const sync = () => orb?.play(running());
    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      orb?.pointer((event.clientX / window.innerWidth) * 2 - 1, (event.clientY / window.innerHeight) * 2 - 1);
    };
    const resizeObserver = new ResizeObserver(() => {
      layout = measure();
      place();
      orb?.resize(layout.width, layout.height, layout.view);
    });
    resizeObserver.observe(host);
    if (frame) resizeObserver.observe(frame);
    const viewObserver = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      sync();
    });
    viewObserver.observe(frame ?? host);
    document.addEventListener("visibilitychange", sync);
    if (!reducedMotion) window.addEventListener("pointermove", onPointerMove, { passive: true });

    return () => {
      disposed = true;
      orb?.dispose();
      orb = null;
      resizeObserver.disconnect();
      viewObserver.disconnect();
      document.removeEventListener("visibilitychange", sync);
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, [cropTo, variant]);

  return (
    <div ref={hostRef} className={`relative ${className}`}>
      {/* Stand-in sphere: shows while three.js loads, and stays if WebGL is unavailable */}
      <div
        aria-hidden
        className={`absolute inset-[8%] rounded-full bg-[radial-gradient(circle_at_34%_30%,#bcaeff_0%,#795df5_18%,#3b22b8_42%,#1b1160_66%,#07051f_88%)] shadow-[inset_-18px_-22px_48px_rgb(7_5_31/0.7),inset_10px_12px_30px_rgb(201_188_255/0.25)] transition-opacity duration-700 ${
          ready ? "opacity-0" : "opacity-100"
        }`}
      />
    </div>
  );
}
