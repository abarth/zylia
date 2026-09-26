# World and Exploration

## Decided

- The world is a set of **maps**. Each map is a grid of 16x16 tiles defined
  as rows of characters plus a legend (see [../content/schema.md](../content/schema.md)).
- Map kinds: `world` (overworld), `town`, `dungeon`, `interior`.
- Movement is tile-by-tile with a smooth 8-tick step, in four directions.
- **Warps** connect maps: stepping on a warp tile moves the party to a
  target map and tile. The world map uses a town or cave tile with a warp on
  it; towns and dungeons use exit tiles on their edges.
- Solid entities (NPCs, chests, signs) block movement. Press confirm while
  facing one to interact.
- Random encounters use a per-map table: a chance per step and weighted
  encounter groups.
- **Only one party member is shown on the field**, as in FF4 ([#17](https://github.com/abarth/zylia/issues/17)).
  The player picks which one with Q / Page Up and E / Page Down, cycling
  through the party. The choice is purely cosmetic: it never affects
  gameplay, battle order or the story, and events must not branch on it.
  It is stored as `GameState.fieldLeader` (a party member id) so it
  survives saves. Cutscenes that need other members on screen spawn them as
  event actors.

## Proposed

- **Overworld travel modes** in stages, as in FF4/FF6: on foot, then a boat
  or chocobo-like mount, then an airship that opens the whole world. Each
  mode changes which tiles are walkable (e.g. `walkable`, `sailable`,
  `landable` flags per tile).
- **Regional encounter tables** on the world map: the map defines regions
  (rectangles or a second character grid) each with its own table, so the
  area around the first town is safe and distant areas are dangerous.
- **Encounter smoothing**: a minimum number of steps after each battle before
  the next one can trigger, and a rising chance after that, so battles
  never happen back to back and never go too long without one.
- **Dungeon design rules**: every dungeon has a gimmick (switches, dark
  rooms, one-way drops), at least one optional side path with treasure, a
  save point before the boss.
- **Interiors**: doors (`door` tiles) become warps to small interior maps.
- **Map preview tool** ([#38](https://github.com/abarth/zylia/issues/38)) so agents can render a map to an image and
  check their work.

## Open questions

- Vehicles: which ones, and when in the story?
- Should the world map wrap around (FF4/FF6 do)?
