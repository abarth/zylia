import { describe, expect, it } from "vitest";
import { assembleRawContent, loadContent } from "../src/content";
import type { Content, MapDef } from "../src/content/types";
import { validateContent } from "../src/content/validate";

describe("content", () => {
  it("passes schema validation", () => {
    expect(validateContent(assembleRawContent())).toEqual([]);
  });

  it("has every chest, NPC and sign reachable from the start", () => {
    const content = loadContent();
    const reachable = reachableTiles(content);
    const problems: string[] = [];
    for (const map of Object.values(content.maps)) {
      for (const e of map.entities) {
        if (e.type === "warp") continue;
        const neighbors = [
          [e.x + 1, e.y],
          [e.x - 1, e.y],
          [e.x, e.y + 1],
          [e.x, e.y - 1],
        ];
        if (!neighbors.some(([x, y]) => reachable.has(`${map.id}:${x},${y}`))) {
          problems.push(`${map.id} ${e.type} at (${e.x}, ${e.y}) cannot be reached`);
        }
      }
    }
    expect(problems).toEqual([]);
  });
});

describe("validateContent", () => {
  it("reports broken references with their path", () => {
    const raw = structuredClone(assembleRawContent()) as unknown as Content;
    raw.maps["town-aldren"].entities.push({
      type: "npc",
      id: "ghost",
      name: "Ghost",
      x: 1,
      y: 1,
      color: "#ffffff",
      dialogue: "no-such-dialogue",
    });
    raw.maps["overworld"].tiles[0] = raw.maps["overworld"].tiles[0].slice(1);
    const errors = validateContent(raw);
    expect(errors).toContainEqual(expect.stringMatching(/^maps\.town-aldren\.entities\[\d+\]\.dialogue: unknown dialogue/));
    expect(errors).toContainEqual(expect.stringMatching(/^maps\.overworld\.tiles\[0\]: has length/));
  });
});

/** Flood fill across walkable tiles and warps, starting at game.start. */
function reachableTiles(content: Content): Set<string> {
  const seen = new Set<string>();
  const queue: [string, number, number][] = [[content.game.start.map, content.game.start.x, content.game.start.y]];
  while (queue.length) {
    const [mapId, x, y] = queue.pop()!;
    const key = `${mapId}:${x},${y}`;
    if (seen.has(key)) continue;
    const map = content.maps[mapId];
    if (!walkable(content, map, x, y)) continue;
    seen.add(key);
    const warp = map.entities.find((e) => e.type === "warp" && e.x === x && e.y === y);
    if (warp?.type === "warp") {
      queue.push([warp.to.map, warp.to.x, warp.to.y]);
      continue;
    }
    queue.push([mapId, x + 1, y], [mapId, x - 1, y], [mapId, x, y + 1], [mapId, x, y - 1]);
  }
  return seen;
}

function walkable(content: Content, map: MapDef, x: number, y: number): boolean {
  const ch = map.tiles[y]?.[x];
  if (ch === undefined || !content.tiles[map.legend[ch]].walkable) return false;
  const entity = map.entities.find((e) => e.x === x && e.y === y);
  return !entity || entity.type === "warp";
}
