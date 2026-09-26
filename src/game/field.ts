import type { MapDef, MapEntity, TileDef } from "../content/types";
import { SCREEN_HEIGHT, SCREEN_WIDTH, TILE_SIZE } from "../engine/constants";
import { drawText, drawWindow, textWidth } from "../engine/draw";
import type { Action } from "../engine/input";
import { BattleScene } from "./battle";
import { DialogueScene } from "./dialogue";
import type { Game, Scene } from "./game";
import { MenuScene } from "./menu";
import { addItem, chestFlag, hasFlag, setFlag, type Direction } from "./state";

/** Game pixels moved per tick while walking (16 / 2 = 8 ticks per tile). */
const WALK_SPEED = 2;
/** How long the map name banner shows after entering a map. */
const BANNER_TICKS = 120;

const DIRECTIONS: Record<Direction, { dx: number; dy: number }> = {
  up: { dx: 0, dy: -1 },
  down: { dx: 0, dy: 1 },
  left: { dx: -1, dy: 0 },
  right: { dx: 1, dy: 0 },
};
const DIRECTION_ORDER: Direction[] = ["up", "down", "left", "right"];

/**
 * The walking-around mode: world map, towns and dungeons. The party moves one
 * tile at a time on a grid, with smooth pixel movement between tiles.
 */
export class FieldScene implements Scene {
  /** Pixel offset from the party's tile while a step is in progress. */
  private walkOffset = 0;
  private walking: Direction | null = null;
  private bannerTicks = BANNER_TICKS;

  update(game: Game): void {
    if (this.walking) {
      this.continueWalking(game);
      return;
    }
    if (this.bannerTicks > 0) this.bannerTicks--;

    const { input } = game;
    if (input.pressed("menu")) {
      game.push(new MenuScene());
      return;
    }
    if (input.pressed("confirm")) {
      this.interact(game);
      return;
    }
    const direction = DIRECTION_ORDER.find((d) => input.held(d as Action));
    if (direction) this.tryStep(game, direction);
  }

  private map(game: Game): MapDef {
    return game.content.maps[game.state.map];
  }

  /** Starts a step in `direction` if the destination is free; always turns to face it. */
  tryStep(game: Game, direction: Direction): boolean {
    const { state } = game;
    state.facing = direction;
    const { dx, dy } = DIRECTIONS[direction];
    if (!isPassable(game, this.map(game), state.x + dx, state.y + dy)) return false;
    state.x += dx;
    state.y += dy;
    this.walking = direction;
    this.walkOffset = TILE_SIZE;
    return true;
  }

  private continueWalking(game: Game): void {
    this.walkOffset -= WALK_SPEED;
    if (this.walkOffset > 0) return;
    this.walkOffset = 0;
    this.walking = null;
    this.arrive(game);
  }

  /** Runs when the party finishes stepping onto a tile. */
  private arrive(game: Game): void {
    const { state } = game;
    state.steps++;
    const map = this.map(game);

    const warp = entityAt(map, state.x, state.y);
    if (warp?.type === "warp") {
      state.map = warp.to.map;
      state.x = warp.to.x;
      state.y = warp.to.y;
      this.bannerTicks = BANNER_TICKS;
      return;
    }

    const table = map.encounters;
    if (game.options.encounters && table && game.random() < table.rate) {
      const total = table.groups.reduce((sum, g) => sum + g.weight, 0);
      let roll = game.random() * total;
      const pick = table.groups.find((g) => (roll -= g.weight) < 0) ?? table.groups[0];
      game.push(new BattleScene(pick.group));
    }
  }

  private interact(game: Game): void {
    const { state, content } = game;
    const { dx, dy } = DIRECTIONS[state.facing];
    const target = entityAt(this.map(game), state.x + dx, state.y + dy);
    if (!target) return;

    switch (target.type) {
      case "npc": {
        const variant = target.variants?.find((v) => hasFlag(state, v.ifFlag));
        const dialogue = content.dialogue[variant?.dialogue ?? target.dialogue];
        game.push(new DialogueScene(dialogue.lines, () => dialogue.setFlags?.forEach((f) => setFlag(state, f))));
        break;
      }
      case "chest": {
        const flag = chestFlag(state.map, target.id);
        if (hasFlag(state, flag)) {
          game.push(new DialogueScene([{ text: "The chest is empty." }]));
          break;
        }
        setFlag(state, flag);
        const found: string[] = [];
        if (target.item) {
          const quantity = target.quantity ?? 1;
          addItem(state, target.item, quantity);
          setFlag(state, `found-${target.item}`);
          const name = content.items[target.item].name;
          found.push(quantity > 1 ? `${name} x${quantity}` : name);
        }
        if (target.gold) {
          state.gold += target.gold;
          found.push(`${target.gold} gold`);
        }
        game.push(new DialogueScene([{ text: `Found ${found.join(" and ")}!` }]));
        break;
      }
      case "sign":
        game.push(new DialogueScene([{ text: target.text }]));
        break;
      case "warp":
        break;
    }
  }

  render(ctx: CanvasRenderingContext2D, game: Game): void {
    const { state } = game;
    const map = this.map(game);
    const mapWidth = map.tiles[0].length * TILE_SIZE;
    const mapHeight = map.tiles.length * TILE_SIZE;

    // Party position in map pixels, including the in-progress step.
    const { dx, dy } = this.walking ? DIRECTIONS[this.walking] : { dx: 0, dy: 0 };
    const px = state.x * TILE_SIZE - dx * this.walkOffset;
    const py = state.y * TILE_SIZE - dy * this.walkOffset;
    const camX = cameraOffset(px, mapWidth, SCREEN_WIDTH);
    const camY = cameraOffset(py, mapHeight, SCREEN_HEIGHT);

    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

    const firstCol = Math.max(0, Math.floor(camX / TILE_SIZE));
    const firstRow = Math.max(0, Math.floor(camY / TILE_SIZE));
    const lastCol = Math.min(map.tiles[0].length - 1, Math.floor((camX + SCREEN_WIDTH) / TILE_SIZE));
    const lastRow = Math.min(map.tiles.length - 1, Math.floor((camY + SCREEN_HEIGHT) / TILE_SIZE));
    for (let row = firstRow; row <= lastRow; row++) {
      for (let col = firstCol; col <= lastCol; col++) {
        const tile = tileAt(game, map, col, row);
        if (!tile) continue;
        const sx = col * TILE_SIZE - camX;
        const sy = row * TILE_SIZE - camY;
        ctx.fillStyle = tile.color;
        ctx.fillRect(sx, sy, TILE_SIZE, TILE_SIZE);
        // Faint grid so individual tiles are countable.
        ctx.fillStyle = "rgba(0, 0, 0, 0.12)";
        ctx.fillRect(sx, sy, TILE_SIZE, 1);
        ctx.fillRect(sx, sy, 1, TILE_SIZE);
        if (tile.glyph) drawCentered(ctx, tile.glyph, sx, sy, "#f0f0f0");
      }
    }

    for (const entity of map.entities) {
      const sx = entity.x * TILE_SIZE - camX;
      const sy = entity.y * TILE_SIZE - camY;
      if (sx < -TILE_SIZE || sy < -TILE_SIZE || sx > SCREEN_WIDTH || sy > SCREEN_HEIGHT) continue;
      switch (entity.type) {
        case "npc":
          drawBox(ctx, sx + 2, sy + 1, TILE_SIZE - 4, TILE_SIZE - 2, entity.color);
          drawCentered(ctx, entity.glyph ?? entity.name[0], sx, sy, "#ffffff");
          break;
        case "chest": {
          const open = hasFlag(state, chestFlag(state.map, entity.id));
          drawBox(ctx, sx + 2, sy + 4, TILE_SIZE - 4, TILE_SIZE - 7, open ? "#5a4020" : "#c08830");
          if (!open) {
            ctx.fillStyle = "#f8e070";
            ctx.fillRect(sx + 7, sy + 7, 2, 3);
          }
          break;
        }
        case "sign":
          ctx.fillStyle = "#5a3a1a";
          ctx.fillRect(sx + 7, sy + 8, 2, 7);
          drawBox(ctx, sx + 2, sy + 2, TILE_SIZE - 4, 7, "#c8a870");
          break;
        case "warp":
          break;
      }
    }

    // The party is drawn as its leader.
    const leader = state.party[0];
    const lx = px - camX;
    const ly = py - camY;
    drawBox(ctx, lx + 2, ly + 1, TILE_SIZE - 4, TILE_SIZE - 2, leader.color);
    drawFacing(ctx, lx, ly, state.facing);

    if (this.bannerTicks > 0) {
      const name = map.name;
      const w = textWidth(ctx, name) + 16;
      drawWindow(ctx, (SCREEN_WIDTH - w) / 2, 8, w, 20);
      drawText(ctx, name, (SCREEN_WIDTH - w) / 2 + 8, 12);
    }
  }
}

/** The map entity on a tile, if any. */
export function entityAt(map: MapDef, x: number, y: number): MapEntity | undefined {
  return map.entities.find((e) => e.x === x && e.y === y);
}

function tileAt(game: Game, map: MapDef, x: number, y: number): TileDef | undefined {
  const ch = map.tiles[y]?.[x];
  return ch === undefined ? undefined : game.content.tiles[map.legend[ch]];
}

/** True if the party can step onto (x, y): in bounds, walkable, and not occupied by a solid entity. */
export function isPassable(game: Game, map: MapDef, x: number, y: number): boolean {
  const tile = tileAt(game, map, x, y);
  if (!tile?.walkable) return false;
  const entity = entityAt(map, x, y);
  return !entity || entity.type === "warp";
}

/** Keeps the party centered, clamped so the view never shows past the map edge. */
function cameraOffset(position: number, mapSize: number, screenSize: number): number {
  if (mapSize <= screenSize) return -(screenSize - mapSize) / 2;
  const centered = position + TILE_SIZE / 2 - screenSize / 2;
  return Math.round(Math.max(0, Math.min(mapSize - screenSize, centered)));
}

function drawBox(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, color: string): void {
  ctx.fillStyle = "#101010";
  ctx.fillRect(x - 1, y - 1, w + 2, h + 2);
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function drawCentered(ctx: CanvasRenderingContext2D, label: string, tileX: number, tileY: number, color: string): void {
  drawText(ctx, label, tileX + (TILE_SIZE - textWidth(ctx, label)) / 2, tileY + 2, color);
}

function drawFacing(ctx: CanvasRenderingContext2D, x: number, y: number, facing: Direction): void {
  ctx.fillStyle = "#101010";
  const c = TILE_SIZE / 2;
  switch (facing) {
    case "up":
      ctx.fillRect(x + c - 2, y + 3, 4, 2);
      break;
    case "down":
      ctx.fillRect(x + c - 2, y + TILE_SIZE - 5, 4, 2);
      break;
    case "left":
      ctx.fillRect(x + 4, y + c - 2, 2, 4);
      break;
    case "right":
      ctx.fillRect(x + TILE_SIZE - 6, y + c - 2, 2, 4);
      break;
  }
}
