import { TICKS_PER_SECOND } from "./constants";

const TICK_MS = 1000 / TICKS_PER_SECOND;
/** Cap on catch-up ticks so a backgrounded tab doesn't fast-forward. */
const MAX_TICKS_PER_FRAME = 5;

/**
 * Fixed-timestep loop: `update` always advances the game by exactly one tick,
 * so movement and timers are deterministic regardless of monitor refresh rate.
 */
export function startLoop(update: () => void, render: () => void): void {
  let last = performance.now();
  let accumulator = 0;

  const frame = (now: number) => {
    accumulator += now - last;
    last = now;
    let ticks = 0;
    while (accumulator >= TICK_MS && ticks < MAX_TICKS_PER_FRAME) {
      update();
      accumulator -= TICK_MS;
      ticks++;
    }
    if (ticks === MAX_TICKS_PER_FRAME) accumulator = 0;
    render();
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
}
