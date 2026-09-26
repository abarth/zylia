# Save System

**Status: Proposed** ([#12](https://github.com/abarth/zylia/issues/12), [#13](https://github.com/abarth/zylia/issues/13), [#14](https://github.com/abarth/zylia/issues/14)).

## Format

- A save is `{ "version": 1, "savedAt": ISO date, "playTime": seconds,
  "summary": {...}, "state": GameState }`.
- `GameState` is already plain JSON (see [architecture.md](architecture.md)),
  so it can be stored as is and exported as a file. Rules to keep it that way: no class
  instances, no Maps or Sets, no references to content objects (store ids).
- `summary` holds what the load screen shows without parsing everything:
  location name, party leader, level, play time.
- `version` increments whenever the shape of `GameState` changes; a
  migration function upgrades older saves step by step.

## Storage

**Decided: IndexedDB.**

- Database `zylia`, object store `saves`, keyed by slot number (3 slots to
  start). Each record is the save object above. The object store is created
  in the database's version-1 upgrade; later schema changes to the database
  itself (not the save format) go through IndexedDB's `onupgradeneeded`.
- All access goes through one small async module (e.g. `src/save/store.ts`)
  with `listSaves()`, `load(slot)`, `save(slot, data)`, `remove(slot)`, so
  the rest of the game never touches the IndexedDB API directly. Tests use
  an in-memory implementation of the same interface.
- Call `navigator.storage.persist()` on first save so the browser is less
  likely to evict saves under storage pressure.
- If IndexedDB is unavailable (some private browsing modes), show a message
  that saving is disabled rather than failing silently.
- Export/import a save as a JSON file for backups and bug reports.

## When the player can save

FF4/FF6 style: anywhere on the world map, and at save points in towns and
dungeons. Not in battles or during events.

## Content changes and old saves

Saves reference content by id. If content removes an id that a save refers
to (a map, an item), loading must not crash: unknown items are dropped with a
warning and an unknown map falls back to the game's start position.
