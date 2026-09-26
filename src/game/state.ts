import type { Content, StatBlock } from "../content/types";

export type Direction = "up" | "down" | "left" | "right";

export type PartyMember = {
  id: string;
  name: string;
  job: string;
  color: string;
  level: number;
  xp: number;
  hp: number;
  mp: number;
  stats: StatBlock;
};

/**
 * Everything that changes during play. Kept as plain JSON-compatible data so
 * that saving is a JSON.stringify away (see docs/design/save-system.md).
 */
export type GameState = {
  map: string;
  x: number;
  y: number;
  facing: Direction;
  party: PartyMember[];
  gold: number;
  /** Item id -> quantity, in the order items were first acquired. */
  inventory: Record<string, number>;
  /** Story and world flags, e.g. "met-elder" or "chest:mossy-cave:cave-gold". */
  flags: Record<string, true>;
  steps: number;
};

export function newGame(content: Content): GameState {
  const { game } = content;
  const inventory: Record<string, number> = {};
  for (const { item, quantity } of game.inventory) inventory[item] = (inventory[item] ?? 0) + quantity;
  return {
    map: game.start.map,
    x: game.start.x,
    y: game.start.y,
    facing: "down",
    party: game.party.map((id) => {
      const def = content.characters[id];
      return {
        id,
        name: def.name,
        job: def.job,
        color: def.color,
        level: def.level,
        xp: 0,
        hp: def.stats.hp,
        mp: def.stats.mp,
        stats: { ...def.stats },
      };
    }),
    gold: game.gold,
    inventory,
    flags: {},
    steps: 0,
  };
}

export function addItem(state: GameState, item: string, quantity: number): void {
  state.inventory[item] = Math.min(99, (state.inventory[item] ?? 0) + quantity);
}

export function hasFlag(state: GameState, flag: string): boolean {
  return state.flags[flag] === true;
}

export function setFlag(state: GameState, flag: string): void {
  state.flags[flag] = true;
}

export function chestFlag(map: string, chestId: string): string {
  return `chest:${map}:${chestId}`;
}
