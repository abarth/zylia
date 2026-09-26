# Zylia

An open-world, pixel-art role-playing game in the style of Final Fantasy IV
and Final Fantasy VI, running in the browser. All game content (world, story,
characters, dialogue, items, enemies) is authored by agents as structured
data, validated by the build.

This is the very first iteration: placeholder graphics (colored, labeled
boxes on a grid), a playable field mode, and the design documents that plan
everything else.

## Play it

The latest version on `main` is deployed to GitHub Pages:
**https://abarth.github.io/zylia/**

## Run it locally

Requires Node.js 20 or newer.

```sh
npm install
npm run dev        # starts a dev server; open the printed URL
```

Other scripts:

| Command             | What it does                                         |
| ------------------- | ---------------------------------------------------- |
| `npm run check`     | Type-check and run all tests (including content validation) |
| `npm test`          | Tests only                                           |
| `npm run build`     | Production build into `dist/`                        |
| `npm run preview`   | Serve the production build                           |

## Controls

| Key                          | Action                         |
| ---------------------------- | ------------------------------ |
| Arrow keys / WASD            | Walk, move cursor              |
| Z / Enter / Space            | Talk, examine, open, confirm   |
| X / Backspace                | Cancel, close                  |
| Esc / C                      | Open or close the menu         |
| Q / Page Up, E / Page Down   | Change who walks on the field  |

URL parameters for experimenting:

- `?encounters=off` turns off random battles.
- `?map=mossy-cave&x=9&y=13` starts on a given map and tile.

In the browser console, `zylia` is the running `Game` object
(`zylia.state` holds position, party, inventory and flags).

## What's playable now

- The Zylia Plains world map, the town of Aldren, and the Mossy Cave.
- Grid movement with collision, entering and leaving towns and dungeons.
- Talking to NPCs (with dialogue that changes based on story flags), reading
  signs, opening treasure chests.
- Random encounters on the world map and in the cave, leading to a
  placeholder battle screen.
- A read-only party and inventory menu.

## Repository layout

```
content/        Game content as JSON (maps, dialogue, items, enemies, ...)
docs/           Design documents and the story framework
  overview.md   Start here: vision, pillars, scope, milestones
  design/       Systems design (combat, stats, magic, economy, saves, ...)
  story/        How the story gets written: principles, process, templates
  content/      Content schema and the authoring workflow for agents
src/
  engine/       Canvas, scaling, input, fixed-timestep loop, drawing
  content/      Content types, loader and validator
  game/         Scenes: field, dialogue, menu, battle; game state
tests/          Vitest tests
```

Work is tracked in [GitHub issues](https://github.com/abarth/zylia/issues).
Contributors (human or agent) should read [AGENTS.md](AGENTS.md).
