# Content Schema

All game content lives in `content/` as JSON. `src/content/types.ts` is the
TypeScript version of this document and `src/content/validate.ts` enforces
it; change all three together. Validation runs when the game starts and in
`npm run check`; its errors name the exact path, for example
`maps.town-aldren.entities[3].dialogue: unknown dialogue "elder-intor"`.

## Conventions

- **Ids** are lowercase kebab-case (`green-slime`, `town-aldren`). Keys of
  the top-level objects are the ids. Map ids equal their file names.
- **Colors** are `#rrggbb`. Until there is art, colors (and optional 1-2
  character glyphs) are how things are told apart on screen.
- **Coordinates** are tile coordinates, `x` to the right and `y` down, with
  (0, 0) the top-left tile.
- **Stat blocks** have `hp`, `mp`, `str`, `agi`, `vit`, `mag`, `spr`, `lck`
  (see [../design/characters-and-stats.md](../design/characters-and-stats.md)).

## Files

| File | Contents |
| --- | --- |
| `game.json` | Title, start map and position, starting party, gold and inventory |
| `tiles.json` | Tile types: `name`, `color`, `walkable`, optional `glyph` |
| `items.json` | Items: `name`, `kind`, `price`, `description` |
| `characters.json` | Playable characters: `name`, `job`, `color`, `level`, `stats`, `bio` |
| `enemies.json` | Enemies: `name`, `color`, `level`, `stats`, `xp`, `gold` |
| `encounter-groups.json` | Enemy groups: `name`, `enemies` (1-6 enemy ids) |
| `dialogue/*.json` | Dialogue entries, any number of files, global ids |
| `maps/<id>.json` | One map per file |

### `game.json`

```json
{
  "title": "Zylia",
  "start": { "map": "overworld", "x": 12, "y": 13 },
  "party": ["kael", "mira"],
  "gold": 100,
  "inventory": [{ "item": "potion", "quantity": 3 }]
}
```

`start` must be a walkable tile. `party` has 1-4 character ids.

### Items

`kind` is one of `consumable`, `weapon`, `armor`, `accessory`, `key`.
`price` is the shop price in gold (0 for unsellable).

### Dialogue

```json
{
  "elder-intro": {
    "lines": [
      { "speaker": "Elder Bram", "text": "Ah, travelers." },
      { "text": "A line with no speaker, like narration." }
    ],
    "setFlags": ["met-elder"]
  }
}
```

### Maps

```json
{
  "id": "town-aldren",
  "name": "Aldren",
  "kind": "town",
  "tiles": [
    "#####",
    "#g,g#",
    "##v##"
  ],
  "legend": { "#": "wall", "g": "lawn", ",": "floor", "v": "exit" },
  "entities": [],
  "encounters": { "rate": 0.05, "groups": [{ "group": "slimes-2", "weight": 1 }] }
}
```

- `kind`: `world`, `town`, `dungeon` or `interior`.
- `tiles`: one string per row, all the same length. Every character must be
  in `legend`, which maps it to a tile id from `tiles.json`.
- `encounters` (optional): `rate` is the chance per step (0-1); groups are
  picked by `weight`.
- At most one entity per tile.

### Entities

Every entity has `type`, `x`, `y`.

| `type` | Fields | Behavior |
| --- | --- | --- |
| `npc` | `id`, `name`, `color`, optional `glyph`, `dialogue`, optional `variants` | Solid. Talk to it with confirm. `variants` is a list of `{ "ifFlag", "dialogue" }`; the first whose flag is set is used instead of `dialogue`. |
| `chest` | `id`, optional `item` + `quantity`, optional `gold` | Solid. Must hold an item or gold. Opens once (flag `chest:<map>:<id>`); finding an item sets `found-<item>`. |
| `sign` | `text` | Solid. Shows its text. |
| `warp` | `to: { map, x, y }` | Not solid. Stepping on it moves the party. The target must be a walkable tile. |

## Flags

Flags are strings stored in the save. Conventions:

- Story progress: short descriptive kebab-case, e.g. `met-elder`,
  `ch1-cave-cleared`. Prefix with the chapter when it helps (`ch2-`).
- Set automatically: `chest:<map>:<chest-id>`, `found-<item-id>`.
