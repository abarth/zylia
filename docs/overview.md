# Zylia: Project Overview

## Vision

Zylia is a single-player, open-world role-playing game in the tradition of
Final Fantasy IV and VI: a party of distinct characters crosses a world map,
visits towns and dungeons, talks with the people they meet, and fights groups
of enemies in side-view battles. It runs in a desktop browser with keyboard
controls and a fixed, pixel-art screen that scales to the window.

Every piece of content (the world, its history, the characters, their plots,
all dialogue, items, spells and enemies) is written by agents. The engine is
built so that content is structured data with a schema, and the design
process is documented so that many agents can contribute consistently over a
long time.

## Pillars

1. **Characters first.** Like FF4 and FF6, the party is the story. Every
   playable character has a personal arc, a distinct combat role and a
   reason to be here. See [story/characters.md](story/characters.md).
2. **A world worth walking.** Towns, dungeons and the spaces between them
   should reward exploration with treasure, lore and side stories.
3. **Readable, snappy battles.** Active-time battles that are easy to learn
   and have depth through party composition, magic and equipment.
   See [design/combat.md](design/combat.md).
4. **Steady growth.** The party should feel noticeably stronger every hour:
   levels, new abilities, better equipment. See
   [design/progression-and-balance.md](design/progression-and-balance.md).
5. **Content as data.** Anything a writer or designer would change lives in
   `content/`, validated automatically. See
   [content/authoring-guide.md](content/authoring-guide.md).

## Scope

In scope for the full game:

- World map, towns, dungeons, interiors, with transitions between them.
- NPCs, branching dialogue, cutscenes driven by story flags.
- Random and scripted encounters; FF-style active-time battles.
- Party of up to 4 active characters from a larger roster.
- Stats, levels, experience, equipment, abilities, a learnable magic system.
- Inventory, treasure chests, shops and an economy.
- Saving and loading.
- Pixel art, music and sound (later; placeholders until then).

Out of scope for now: multiplayer, mobile/touch controls, gamepad support
(likely later), localization.

## Technical approach

- TypeScript and Vite, no game framework. Rendering is plain Canvas 2D at a
  fixed 256x224 internal resolution (the SNES resolution), scaled up to fit
  the window, preferring whole-number scale factors so pixels stay crisp.
- A fixed 60 Hz simulation tick, independent of the display's refresh rate.
- A stack of scenes (field, dialogue, menu, battle); the top scene receives
  input, all scenes draw from the bottom up.
- Content is JSON in `content/`, loaded at build time and validated on
  startup and in tests.

Details: [design/architecture.md](design/architecture.md).

## Milestones

The detailed, tracked task list is in [backlog.md](backlog.md).

| Milestone | Goal | Status |
| --- | --- | --- |
| **M0: Foundations** | Project docs, engine skeleton, walkable placeholder world, content pipeline | Done in this first iteration |
| **M1: Core loop** | Real battles (ATB, attack/defend/item/run), XP and levels, item use, saving and loading | Next |
| **M2: Party and magic** | Magic system, abilities, equipment, 4+ designed characters, status effects | |
| **M3: World and story slice** | First chapter of the story playable end to end: 2 towns, 2 dungeons, a boss, cutscenes, shops | |
| **M4: Art and audio** | Tile and sprite art pipeline, music and sound effects | |
| **M5: Full game** | Remaining chapters, balance passes, polish | |

## Documentation map

- [backlog.md](backlog.md): what to work on.
- `design/`: how systems work.
  - [architecture.md](design/architecture.md)
  - [world-and-exploration.md](design/world-and-exploration.md)
  - [combat.md](design/combat.md)
  - [characters-and-stats.md](design/characters-and-stats.md)
  - [magic.md](design/magic.md)
  - [items-equipment-inventory.md](design/items-equipment-inventory.md)
  - [economy.md](design/economy.md)
  - [progression-and-balance.md](design/progression-and-balance.md)
  - [dialogue-and-events.md](design/dialogue-and-events.md)
  - [save-system.md](design/save-system.md)
- `story/`: the story bible.
  - [README.md](story/README.md): how story work is organized.
  - [world.md](story/world.md), [characters.md](story/characters.md),
    [story-arc.md](story/story-arc.md), [style-guide.md](story/style-guide.md)
- `content/`: how content is produced.
  - [schema.md](content/schema.md), [authoring-guide.md](content/authoring-guide.md)
