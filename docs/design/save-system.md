# Save System

**Status: Proposed (SAV-1..3).**

## Format

- A save is `{ "version": 1, "savedAt": ISO date, "playTime": seconds,
  "summary": {...}, "state": GameState }`.
- `GameState` is already plain JSON (see [architecture.md](architecture.md)),
  so saving is `JSON.stringify`. Rules to keep it that way: no class
  instances, no Maps or Sets, no references to content objects (store ids).
- `summary` holds what the load screen shows without parsing everything:
  location name, party leader, level, play time.
- `version` increments whenever the shape of `GameState` changes; a
  migration function upgrades older saves step by step.

## Storage

- `localStorage`, key `zylia.save.<slot>`, 3 slots.
- Export/import a save as a file for backups and bug reports.

## When the player can save

FF4/FF6 style: anywhere on the world map, and at save points in towns and
dungeons. Not in battles or during events.

## Content changes and old saves

Saves reference content by id. If content removes an id that a save refers
to (a map, an item), loading must not crash: unknown items are dropped with a
warning and an unknown map falls back to the game's start position.
