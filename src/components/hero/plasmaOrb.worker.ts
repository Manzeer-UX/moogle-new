/*
 * Renders the hero's plasma orb off the main thread, on the OffscreenCanvas that PlasmaOrb hands
 * over. Lenis scrolls the page from the main thread, one scroll step per frame. A WebGL canvas drawn
 * there every frame makes each of those frames wait for the canvas, which puts Chrome into showing
 * main-thread updates (the scroll) a frame late and dropping some: the scroll judders while the
 * hero is on screen. Drawn from a worker, the orb's frames reach the compositor on their own.
 */
import { createPlasmaScene, type PlasmaScene, type PlasmaVariant, type ViewWindow } from "./plasmaScene";

export type OrbWorkerMessage =
  | {
      type: "init";
      canvas: OffscreenCanvas;
      pixelRatio: number;
      sphereFraction: number;
      still: boolean;
      variant: PlasmaVariant;
    }
  /** The canvas's size on the page, in CSS pixels; with `view`, the part of a larger frame it shows */
  | { type: "resize"; width: number; height: number; view?: ViewWindow }
  /** Pointer position across the window, -1 to 1 on each axis */
  | { type: "pointer"; x: number; y: number }
  | { type: "play"; running: boolean };

/** `unsupported`: no WebGL or no animation frames in workers here, so PlasmaOrb draws on the main thread instead */
export type OrbWorkerReply = { type: "ready" } | { type: "unsupported" };

type WorkerScope = {
  onmessage: ((event: MessageEvent<OrbWorkerMessage>) => void) | null;
  postMessage(message: OrbWorkerReply): void;
  requestAnimationFrame?: (callback: FrameRequestCallback) => number;
  cancelAnimationFrame?: (handle: number) => void;
};

const scope = self as unknown as WorkerScope;
let scene: PlasmaScene | null = null;

scope.onmessage = ({ data }) => {
  switch (data.type) {
    case "init": {
      const { requestAnimationFrame: request, cancelAnimationFrame: cancel } = scope;
      scene =
        request && cancel
          ? createPlasmaScene(data.canvas, {
              pixelRatio: data.pixelRatio,
              sphereFraction: data.sphereFraction,
              still: data.still,
              variant: data.variant,
              frames: { request: request.bind(scope), cancel: cancel.bind(scope) },
              onFirstFrame: () => scope.postMessage({ type: "ready" }),
            })
          : null;
      if (!scene) scope.postMessage({ type: "unsupported" });
      break;
    }
    case "resize":
      scene?.resize(data.width, data.height, data.view);
      break;
    case "pointer":
      scene?.pointer(data.x, data.y);
      break;
    case "play":
      scene?.play(data.running);
      break;
  }
};
