# Architecture

**Status: Decided** for M0. Revisit when adding art (M4).

## Rendering and screen size

- Internal resolution is **256x224 game pixels** (`src/engine/constants.ts`),
  the SNES output resolution. Tiles are **16x16**, so the screen shows 16x14
  tiles.
- The canvas backing store is always 256x224. Only its CSS size changes, via
  `computeScale` in `src/engine/display.ts`: the largest whole-number scale
  that fits the window, or a fractional scale if the window is smaller than
  256x224. The page is letterboxed in black. `image-rendering: pixelated`
  keeps pixels sharp.
- Text is drawn with the browser's monospace font at 10 px and thresholded to
  hard-edged pixels (`src/engine/draw.ts`). A bitmap font replaces this in M4.

## Loop and input

- `startLoop` runs a fixed 60 Hz simulation tick using an accumulator, with a
  cap on catch-up ticks. Rendering happens once per animation frame.
- `Input` maps keys to abstract actions (`up`, `down`, `left`, `right`,
  `confirm`, `cancel`, `menu`). `held` is true while down; `pressed` is true
  for exactly one tick. Gamepad support can be added behind the same actions.

## Scenes

`Game` owns a stack of `Scene`s. Only the top scene updates; every scene
renders, bottom to top, so overlays (dialogue, menu) draw over the field.

| Scene | File | Purpose |
| --- | --- | --- |
| `FieldScene` | `src/game/field.ts` | World map, towns, dungeons: movement, warps, interaction, encounters |
| `DialogueScene` | `src/game/dialogue.ts` | Text box with typewriter effect; runs a callback when finished |
| `MenuScene` | `src/game/menu.ts` | Party and inventory (read-only for now) |
| `BattleScene` | `src/game/battle.ts` | Placeholder battle screen |

## State

`GameState` (`src/game/state.ts`) is plain JSON: current map and position,
party members with current HP/MP and stats, gold, inventory, flags, step
count. Scenes hold only transient presentation state (animation progress,
cursor position). This separation is what makes saving trivial; see
[save-system.md](save-system.md).

**Flags** are the universal memory of the world: story progress
(`met-elder`), opened chests (`chest:<map>:<id>`), found items
(`found-<item>`). Dialogue variants and, later, events and map changes are
conditioned on flags.

## Content

Content JSON is imported at build time (`src/content/index.ts`). Maps and
dialogue files are discovered by glob, so adding content never requires
editing code. The whole content set is validated at startup; an invalid
content set shows the error list on the page instead of starting the game.

## Testing

Vitest. Game logic is kept separate from drawing so it can be tested without
a browser (see `tests/field.test.ts`). Content tests validate every file and
check that everything placed on a map is reachable.

## Open questions

- When real battles arrive, battle logic should be a pure model
  (`src/battle/`) with the scene only presenting it, so the balance
  simulator ([#9](https://github.com/abarth/zylia/issues/9)) can run battles headlessly.
- Asset pipeline for M4 (sprite sheets vs. individual PNGs, atlas building).
