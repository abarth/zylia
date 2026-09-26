import { loadContent } from "./content";
import { createDisplay } from "./engine/display";
import { Input } from "./engine/input";
import { startLoop } from "./engine/loop";
import { FieldScene } from "./game/field";
import { Game } from "./game/game";
import { newGame } from "./game/state";

function boot(): void {
  const canvas = document.getElementById("game") as HTMLCanvasElement;
  const ctx = createDisplay(canvas);
  const content = loadContent();

  // URL overrides for quick experiments, e.g. ?map=mossy-cave&x=9&y=13&encounters=off
  const params = new URLSearchParams(location.search);
  const state = newGame(content);
  const map = params.get("map");
  if (map && content.maps[map]) {
    state.map = map;
    state.x = Number(params.get("x") ?? 0);
    state.y = Number(params.get("y") ?? 0);
  }

  const input = new Input();
  input.attach(window);
  const game = new Game(content, state, input, { encounters: params.get("encounters") !== "off" });
  game.push(new FieldScene());

  // Handle for poking at the game from the dev console or a test harness.
  (window as unknown as { zylia: Game }).zylia = game;

  startLoop(
    () => game.update(),
    () => game.render(ctx),
  );
}

try {
  boot();
} catch (error) {
  // Content errors are the most likely failure; show them instead of a black screen.
  document.body.innerHTML = "";
  const pre = document.createElement("pre");
  pre.style.cssText = "color:#f88;padding:16px;white-space:pre-wrap;font:14px monospace";
  pre.textContent = String(error instanceof Error ? error.message : error);
  document.body.appendChild(pre);
  throw error;
}
