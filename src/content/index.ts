import game from "../../content/game.json";
import tiles from "../../content/tiles.json";
import items from "../../content/items.json";
import characters from "../../content/characters.json";
import enemies from "../../content/enemies.json";
import encounterGroups from "../../content/encounter-groups.json";
import type { Content } from "./types";
import { validateContent } from "./validate";

// Every file in content/maps/ and content/dialogue/ is picked up
// automatically; agents add content by adding files, not by editing code.
const mapFiles = import.meta.glob("../../content/maps/*.json", { eager: true, import: "default" });
const dialogueFiles = import.meta.glob("../../content/dialogue/*.json", { eager: true, import: "default" });

function fileId(path: string): string {
  return path.slice(path.lastIndexOf("/") + 1).replace(/\.json$/, "");
}

/** Gathers all content files into one object, before validation. */
export function assembleRawContent(): Record<string, unknown> {
  const maps: Record<string, unknown> = {};
  for (const [path, map] of Object.entries(mapFiles)) maps[fileId(path)] = map;

  // Dialogue files are grouped by topic; ids are global across files.
  const dialogue: Record<string, unknown> = {};
  const duplicates: string[] = [];
  for (const [path, file] of Object.entries(dialogueFiles)) {
    for (const [id, entry] of Object.entries(file as Record<string, unknown>)) {
      if (id in dialogue) duplicates.push(`${id} (again in ${fileId(path)}.json)`);
      dialogue[id] = entry;
    }
  }
  if (duplicates.length) throw new Error(`Duplicate dialogue ids: ${duplicates.join(", ")}`);

  return { game, tiles, items, characters, enemies, encounterGroups, dialogue, maps };
}

export function loadContent(): Content {
  const raw = assembleRawContent();
  const errors = validateContent(raw);
  if (errors.length) {
    throw new Error(`Invalid content (${errors.length} problems):\n  ${errors.join("\n  ")}`);
  }
  return raw as Content;
}
