import { SCREEN_HEIGHT, SCREEN_WIDTH } from "./constants";

/**
 * Sets up the canvas at the fixed internal resolution and keeps its on-screen
 * size fitted to the browser window. The canvas backing store never changes
 * size; only its CSS size does, so all game code works in game pixels.
 */
export function createDisplay(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
  canvas.width = SCREEN_WIDTH;
  canvas.height = SCREEN_HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("2D canvas not supported");
  ctx.imageSmoothingEnabled = false;

  const fit = () => {
    const scale = computeScale(window.innerWidth, window.innerHeight);
    canvas.style.width = `${SCREEN_WIDTH * scale}px`;
    canvas.style.height = `${SCREEN_HEIGHT * scale}px`;
  };
  window.addEventListener("resize", fit);
  fit();
  return ctx;
}

/**
 * Largest scale that fits the window while preserving aspect ratio. Whole
 * numbers are preferred so pixels stay square and even; windows smaller than
 * the native resolution fall back to a fractional scale.
 */
export function computeScale(windowWidth: number, windowHeight: number): number {
  const scale = Math.min(windowWidth / SCREEN_WIDTH, windowHeight / SCREEN_HEIGHT);
  return scale >= 1 ? Math.floor(scale) : scale;
}
