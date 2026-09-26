/**
 * TypeScript shapes of the content files under /content. These mirror the
 * schema documented in docs/content/schema.md; keep the two in sync.
 */

export type StatBlock = {
  hp: number;
  mp: number;
  str: number;
  agi: number;
  vit: number;
  mag: number;
  spr: number;
  lck: number;
};

export type TileDef = {
  name: string;
  color: string;
  walkable: boolean;
  /** Optional 1-2 character label drawn on the tile. */
  glyph?: string;
};

export type ItemKind = "consumable" | "weapon" | "armor" | "accessory" | "key";

export type ItemDef = {
  name: string;
  kind: ItemKind;
  price: number;
  description: string;
};

export type CharacterDef = {
  name: string;
  job: string;
  color: string;
  level: number;
  stats: StatBlock;
  bio: string;
};

export type EnemyDef = {
  name: string;
  color: string;
  level: number;
  stats: StatBlock;
  xp: number;
  gold: number;
};

export type EncounterGroupDef = {
  name: string;
  enemies: string[];
};

export type DialogueLine = {
  speaker?: string;
  text: string;
};

export type DialogueDef = {
  lines: DialogueLine[];
  /** Story flags set once the conversation finishes. */
  setFlags?: string[];
};

export type DialogueVariant = {
  ifFlag: string;
  dialogue: string;
};

export type NpcEntity = {
  type: "npc";
  id: string;
  name: string;
  x: number;
  y: number;
  color: string;
  glyph?: string;
  /** Default conversation. */
  dialogue: string;
  /** Checked in order; the first whose flag is set replaces `dialogue`. */
  variants?: DialogueVariant[];
};

export type ChestEntity = {
  type: "chest";
  id: string;
  x: number;
  y: number;
  item?: string;
  quantity?: number;
  gold?: number;
};

export type SignEntity = {
  type: "sign";
  x: number;
  y: number;
  text: string;
};

export type WarpEntity = {
  type: "warp";
  x: number;
  y: number;
  to: { map: string; x: number; y: number };
};

export type MapEntity = NpcEntity | ChestEntity | SignEntity | WarpEntity;

export type MapKind = "world" | "town" | "dungeon" | "interior";

export type EncounterTable = {
  /** Chance per step (0-1) of starting a battle. */
  rate: number;
  groups: { group: string; weight: number }[];
};

export type MapDef = {
  id: string;
  name: string;
  kind: MapKind;
  /** Rows of single-character tile codes, all the same length. */
  tiles: string[];
  /** Maps each character used in `tiles` to a tile id from tiles.json. */
  legend: Record<string, string>;
  entities: MapEntity[];
  encounters?: EncounterTable;
};

export type GameDef = {
  title: string;
  start: { map: string; x: number; y: number };
  party: string[];
  gold: number;
  inventory: { item: string; quantity: number }[];
};

export type Content = {
  game: GameDef;
  tiles: Record<string, TileDef>;
  items: Record<string, ItemDef>;
  characters: Record<string, CharacterDef>;
  enemies: Record<string, EnemyDef>;
  encounterGroups: Record<string, EncounterGroupDef>;
  dialogue: Record<string, DialogueDef>;
  maps: Record<string, MapDef>;
};
