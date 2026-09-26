import type { Content } from "../content/types";
import type { Input } from "../engine/input";
import type { GameState } from "./state";

/** A screen or overlay. Only the top scene updates; all scenes render, bottom first. */
export interface Scene {
  update(game: Game): void;
  render(ctx: CanvasRenderingContext2D, game: Game): void;
}

export type GameOptions = {
  /** Disable random battles (useful while exploring or testing content). */
  encounters: boolean;
};

export class Game {
  private readonly scenes: Scene[] = [];
  tick = 0;

  constructor(
    readonly content: Content,
    public state: GameState,
    readonly input: Input,
    readonly options: GameOptions,
    readonly random: () => number = Math.random,
  ) {}

  push(scene: Scene): void {
    this.scenes.push(scene);
  }

  pop(): void {
    this.scenes.pop();
  }

  get top(): Scene | undefined {
    return this.scenes[this.scenes.length - 1];
  }

  update(): void {
    this.top?.update(this);
    this.input.endTick();
    this.tick++;
  }

  render(ctx: CanvasRenderingContext2D): void {
    for (const scene of this.scenes) scene.render(ctx, this);
  }
}
