import type { Content, MapDef } from "./types";

/**
 * Validates raw content against the schema in docs/content/schema.md and
 * checks cross-references (every dialogue, item, map, tile, enemy id that is
 * mentioned must exist). Returns human-readable errors; empty means valid.
 *
 * This is deliberately hand-written and dependency-free so that error
 * messages name the exact file path and field an agent needs to fix.
 */
export function validateContent(raw: unknown): string[] {
  const errors: string[] = [];
  const v = new Validator(errors);

  if (!v.object(raw, "content")) return errors;
  const c = raw as Record<string, unknown>;

  const ID_TABLES = ["tiles", "items", "characters", "enemies", "encounterGroups", "dialogue", "maps"] as const;
  for (const table of ID_TABLES) v.object(c[table], table);
  if (errors.length) return errors;

  const content = raw as Content;

  for (const [id, tile] of Object.entries(content.tiles)) {
    const p = `tiles.${id}`;
    if (!v.object(tile, p)) continue;
    v.string(tile.name, `${p}.name`);
    v.color(tile.color, `${p}.color`);
    v.boolean(tile.walkable, `${p}.walkable`);
    v.optional(tile.glyph, `${p}.glyph`, (g, gp) => v.string(g, gp, 2));
  }

  for (const [id, item] of Object.entries(content.items)) {
    const p = `items.${id}`;
    if (!v.object(item, p)) continue;
    v.string(item.name, `${p}.name`);
    v.oneOf(item.kind, ["consumable", "weapon", "armor", "accessory", "key"], `${p}.kind`);
    v.integer(item.price, `${p}.price`, 0);
    v.string(item.description, `${p}.description`);
  }

  for (const [id, ch] of Object.entries(content.characters)) {
    const p = `characters.${id}`;
    if (!v.object(ch, p)) continue;
    v.string(ch.name, `${p}.name`);
    v.string(ch.job, `${p}.job`);
    v.color(ch.color, `${p}.color`);
    v.integer(ch.level, `${p}.level`, 1, 99);
    v.stats(ch.stats, `${p}.stats`);
    v.string(ch.bio, `${p}.bio`);
  }

  for (const [id, enemy] of Object.entries(content.enemies)) {
    const p = `enemies.${id}`;
    if (!v.object(enemy, p)) continue;
    v.string(enemy.name, `${p}.name`);
    v.color(enemy.color, `${p}.color`);
    v.integer(enemy.level, `${p}.level`, 1, 99);
    v.stats(enemy.stats, `${p}.stats`);
    v.integer(enemy.xp, `${p}.xp`, 0);
    v.integer(enemy.gold, `${p}.gold`, 0);
  }

  for (const [id, group] of Object.entries(content.encounterGroups)) {
    const p = `encounterGroups.${id}`;
    if (!v.object(group, p)) continue;
    v.string(group.name, `${p}.name`);
    if (v.array(group.enemies, `${p}.enemies`, 1, 6)) {
      group.enemies.forEach((e, i) => v.ref(e, content.enemies, `${p}.enemies[${i}]`, "enemy"));
    }
  }

  for (const [id, dlg] of Object.entries(content.dialogue)) {
    const p = `dialogue.${id}`;
    if (!v.object(dlg, p)) continue;
    if (v.array(dlg.lines, `${p}.lines`, 1)) {
      dlg.lines.forEach((line, i) => {
        const lp = `${p}.lines[${i}]`;
        if (!v.object(line, lp)) return;
        v.optional(line.speaker, `${lp}.speaker`, (s, sp) => v.string(s, sp));
        v.string(line.text, `${lp}.text`);
      });
    }
    v.optional(dlg.setFlags, `${p}.setFlags`, (flags, fp) => {
      if (v.array(flags, fp)) flags.forEach((f, i) => v.string(f, `${fp}[${i}]`));
    });
  }

  for (const [id, map] of Object.entries(content.maps)) {
    validateMap(v, content, id, map);
  }

  if (v.object(content.game, "game")) {
    const g = content.game;
    v.string(g.title, "game.title");
    if (v.object(g.start, "game.start") && v.ref(g.start.map, content.maps, "game.start.map", "map")) {
      v.walkableCell(content, g.start.map, g.start.x, g.start.y, "game.start");
    }
    if (v.array(g.party, "game.party", 1, 4)) {
      g.party.forEach((ch, i) => v.ref(ch, content.characters, `game.party[${i}]`, "character"));
    }
    v.integer(g.gold, "game.gold", 0);
    if (v.array(g.inventory, "game.inventory")) {
      g.inventory.forEach((entry, i) => {
        const ep = `game.inventory[${i}]`;
        if (!v.object(entry, ep)) return;
        v.ref(entry.item, content.items, `${ep}.item`, "item");
        v.integer(entry.quantity, `${ep}.quantity`, 1, 99);
      });
    }
  }

  return errors;
}

function validateMap(v: Validator, content: Content, id: string, map: MapDef): void {
  const p = `maps.${id}`;
  if (!v.object(map, p)) return;
  if (map.id !== id) v.fail(`${p}.id`, `must equal the map's key/file name "${id}", got ${JSON.stringify(map.id)}`);
  v.string(map.name, `${p}.name`);
  v.oneOf(map.kind, ["world", "town", "dungeon", "interior"], `${p}.kind`);

  if (!v.object(map.legend, `${p}.legend`)) return;
  for (const [ch, tileId] of Object.entries(map.legend)) {
    if ([...ch].length !== 1) v.fail(`${p}.legend`, `key ${JSON.stringify(ch)} must be a single character`);
    v.ref(tileId, content.tiles, `${p}.legend[${JSON.stringify(ch)}]`, "tile");
  }

  if (!v.array(map.tiles, `${p}.tiles`, 1)) return;
  // Use the most common row length so a single bad row is the one reported.
  const lengthCounts = new Map<number, number>();
  for (const row of map.tiles) {
    if (typeof row === "string") lengthCounts.set(row.length, (lengthCounts.get(row.length) ?? 0) + 1);
  }
  const width = [...lengthCounts].sort((a, b) => b[1] - a[1])[0]?.[0] ?? 0;
  map.tiles.forEach((row, y) => {
    const rp = `${p}.tiles[${y}]`;
    if (!v.string(row, rp)) return;
    if (row.length !== width) v.fail(rp, `has length ${row.length}; every row must have length ${width}`);
    [...row].forEach((ch, x) => {
      if (!(ch in map.legend)) v.fail(rp, `character ${JSON.stringify(ch)} at x=${x} is not in the legend`);
    });
  });

  const occupied = new Map<string, number>();
  if (v.array(map.entities, `${p}.entities`)) {
    map.entities.forEach((entity, i) => {
      const ep = `${p}.entities[${i}]`;
      if (!v.object(entity, ep)) return;
      v.integer(entity.x, `${ep}.x`, 0, width - 1);
      v.integer(entity.y, `${ep}.y`, 0, map.tiles.length - 1);
      const key = `${entity.x},${entity.y}`;
      if (occupied.has(key)) v.fail(ep, `shares tile (${key}) with entities[${occupied.get(key)}]`);
      occupied.set(key, i);

      switch (entity.type) {
        case "npc":
          v.string(entity.id, `${ep}.id`);
          v.string(entity.name, `${ep}.name`);
          v.color(entity.color, `${ep}.color`);
          v.optional(entity.glyph, `${ep}.glyph`, (g, gp) => v.string(g, gp, 2));
          v.ref(entity.dialogue, content.dialogue, `${ep}.dialogue`, "dialogue");
          v.optional(entity.variants, `${ep}.variants`, (variants, vp) => {
            if (!v.array(variants, vp)) return;
            variants.forEach((variant, j) => {
              if (!v.object(variant, `${vp}[${j}]`)) return;
              v.string(variant.ifFlag, `${vp}[${j}].ifFlag`);
              v.ref(variant.dialogue, content.dialogue, `${vp}[${j}].dialogue`, "dialogue");
            });
          });
          break;
        case "chest":
          v.string(entity.id, `${ep}.id`);
          if (entity.item === undefined && entity.gold === undefined) {
            v.fail(ep, "chest must contain an item or gold");
          }
          v.optional(entity.item, `${ep}.item`, (item, ip) => v.ref(item, content.items, ip, "item"));
          v.optional(entity.quantity, `${ep}.quantity`, (q, qp) => v.integer(q, qp, 1, 99));
          v.optional(entity.gold, `${ep}.gold`, (g, gp) => v.integer(g, gp, 1));
          break;
        case "sign":
          v.string(entity.text, `${ep}.text`);
          break;
        case "warp":
          if (v.object(entity.to, `${ep}.to`) && v.ref(entity.to.map, content.maps, `${ep}.to.map`, "map")) {
            v.walkableCell(content, entity.to.map, entity.to.x, entity.to.y, `${ep}.to`);
          }
          break;
        default:
          v.fail(`${ep}.type`, `unknown entity type ${JSON.stringify((entity as { type: unknown }).type)}`);
      }
    });
  }

  v.optional(map.encounters, `${p}.encounters`, (enc, encPath) => {
    if (!v.object(enc, encPath)) return;
    if (typeof enc.rate !== "number" || enc.rate < 0 || enc.rate > 1) v.fail(`${encPath}.rate`, "must be a number from 0 to 1");
    if (v.array(enc.groups, `${encPath}.groups`, 1)) {
      enc.groups.forEach((g, i) => {
        const gp = `${encPath}.groups[${i}]`;
        if (!v.object(g, gp)) return;
        v.ref(g.group, content.encounterGroups, `${gp}.group`, "encounter group");
        v.integer(g.weight, `${gp}.weight`, 1);
      });
    }
  });
}

class Validator {
  constructor(private readonly errors: string[]) {}

  fail(path: string, message: string): false {
    this.errors.push(`${path}: ${message}`);
    return false;
  }

  object(value: unknown, path: string): boolean {
    if (typeof value === "object" && value !== null && !Array.isArray(value)) return true;
    return this.fail(path, "must be an object");
  }

  array(value: unknown, path: string, min = 0, max = Infinity): value is unknown[] {
    if (!Array.isArray(value)) return this.fail(path, "must be an array");
    if (value.length < min || value.length > max) {
      return this.fail(path, `must have ${min}${max === Infinity ? " or more" : `-${max}`} entries, has ${value.length}`);
    }
    return true;
  }

  string(value: unknown, path: string, maxLength = Infinity): value is string {
    if (typeof value !== "string" || value.length === 0) return this.fail(path, "must be a non-empty string");
    if (value.length > maxLength) return this.fail(path, `must be at most ${maxLength} characters`);
    return true;
  }

  boolean(value: unknown, path: string): boolean {
    return typeof value === "boolean" || this.fail(path, "must be true or false");
  }

  integer(value: unknown, path: string, min = -Infinity, max = Infinity): boolean {
    if (typeof value !== "number" || !Number.isInteger(value)) return this.fail(path, "must be an integer");
    if (value < min || value > max) return this.fail(path, `must be between ${min} and ${max}, got ${value}`);
    return true;
  }

  color(value: unknown, path: string): boolean {
    if (typeof value === "string" && /^#[0-9a-fA-F]{6}$/.test(value)) return true;
    return this.fail(path, 'must be a hex color like "#a0c040"');
  }

  oneOf(value: unknown, options: string[], path: string): boolean {
    if (typeof value === "string" && options.includes(value)) return true;
    return this.fail(path, `must be one of ${options.join(", ")}`);
  }

  ref(value: unknown, table: Record<string, unknown>, path: string, what: string): boolean {
    if (typeof value === "string" && Object.hasOwn(table, value)) return true;
    return this.fail(path, `unknown ${what} ${JSON.stringify(value)}`);
  }

  stats(value: unknown, path: string): void {
    if (!this.object(value, path)) return;
    const stats = value as Record<string, unknown>;
    for (const key of ["hp", "mp", "str", "agi", "vit", "mag", "spr", "lck"]) {
      this.integer(stats[key], `${path}.${key}`, 0, key === "hp" ? 99999 : 999);
    }
  }

  optional<T>(value: T | undefined, path: string, check: (value: T, path: string) => unknown): void {
    if (value !== undefined) check(value, path);
  }

  walkableCell(content: Content, mapId: string, x: unknown, y: unknown, path: string): void {
    const map = content.maps[mapId];
    if (!map || !Array.isArray(map.tiles)) return;
    if (!this.integer(x, `${path}.x`, 0) || !this.integer(y, `${path}.y`, 0)) return;
    const ch = map.tiles[y as number]?.[x as number];
    if (ch === undefined) {
      this.fail(path, `(${x}, ${y}) is outside map "${mapId}"`);
      return;
    }
    const tile = content.tiles[map.legend?.[ch] ?? ""];
    if (tile && !tile.walkable) this.fail(path, `(${x}, ${y}) on map "${mapId}" is a non-walkable ${tile.name} tile`);
  }
}
