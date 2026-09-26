import { describe, expect, it } from "vitest";
import { loadContent } from "../src/content";
import { computeScale } from "../src/engine/display";
import { Input } from "../src/engine/input";
import { FieldScene } from "../src/game/field";
import { Game } from "../src/game/game";
import { hasFlag, newGame } from "../src/game/state";

function setup(map: string, x: number, y: number) {
  const content = loadContent();
  const state = newGame(content);
  Object.assign(state, { map, x, y });
  const game = new Game(content, state, new Input(), { encounters: false });
  const field = new FieldScene();
  game.push(field);
  return { game, field, state };
}

function runTicks(game: Game, n: number) {
  for (let i = 0; i < n; i++) game.update();
}

describe("field movement", () => {
  it("walks one tile over several ticks", () => {
    const { game, field, state } = setup("overworld", 12, 13);
    expect(field.tryStep(game, "right")).toBe(true);
    expect(state.x).toBe(13);
    runTicks(game, 8);
    expect(state.steps).toBe(1);
  });

  it("is blocked by water but still turns to face it", () => {
    const { game, field, state } = setup("overworld", 4, 13);
    expect(field.tryStep(game, "left")).toBe(false);
    expect(state).toMatchObject({ x: 4, y: 13, facing: "left" });
  });

  it("warps into town when stepping onto the town tile", () => {
    const { game, field, state } = setup("overworld", 11, 12);
    field.tryStep(game, "left");
    runTicks(game, 8);
    expect(state).toMatchObject({ map: "town-aldren", x: 9, y: 14 });
  });

  it("opens a chest once", () => {
    const { game, state } = setup("town-aldren", 17, 1);
    state.facing = "right";
    game.input.press("confirm");
    game.update();
    expect(state.inventory.potion).toBe(5);
    expect(hasFlag(state, "chest:town-aldren:town-chest")).toBe(true);
  });
});

describe("computeScale", () => {
  it("prefers whole-number scales", () => {
    expect(computeScale(1920, 1080)).toBe(4);
    expect(computeScale(800, 600)).toBe(2);
  });

  it("shrinks fractionally below native size", () => {
    expect(computeScale(128, 224)).toBe(0.5);
  });
});
