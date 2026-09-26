# Backlog

The single list of planned work. Agents: pick the first unclaimed item in the
current milestone unless asked otherwise, change it to `[~]` with a short note
when you start, and to `[x]` in the same change that completes it. Add new
items where they belong rather than at the end. Each item has a stable ID so
PRs, docs and commits can refer to it.

Status: `[ ]` not started, `[~]` in progress, `[x]` done, `[?]` needs a
decision (see the linked doc's open questions).

## M0: Foundations

- [x] **ENG-1** Vite + TypeScript project, npm scripts, tests.
- [x] **ENG-2** Fixed 256x224 canvas scaled to fit the window (whole-number scaling preferred).
- [x] **ENG-3** Keyboard input mapped to actions; fixed 60 Hz game loop.
- [x] **ENG-4** Scene stack (field, dialogue, menu, battle placeholder).
- [x] **FLD-1** Grid movement with smooth steps, collision, camera that follows the party.
- [x] **FLD-2** Warps between world map, town and dungeon; map name banner.
- [x] **FLD-3** Interact with NPCs, signs and chests.
- [x] **FLD-4** Random encounters from per-map encounter tables.
- [x] **CNT-1** JSON content with a documented schema, a validator with precise error paths, and tests.
- [x] **CNT-2** Sample content: overworld, one town, one cave, two placeholder characters.
- [x] **DOC-1** Overview, design docs, story bible scaffolding, backlog.

## M1: Core loop

Combat ([design/combat.md](design/combat.md))
- [ ] **BTL-1** Battle state model: combatants, ATB gauges, turn queue; pure logic with unit tests.
- [ ] **BTL-2** Commands: Fight, Defend, Item, Run. Target selection UI.
- [ ] **BTL-3** Damage and hit formulas from design/combat.md; floating damage numbers.
- [ ] **BTL-4** Enemy AI scripts as data (content/enemies.json `ai` field).
- [ ] **BTL-5** Victory: XP, gold, item drops, level-up messages. Defeat: game over screen.
- [ ] **BTL-6** Battle transition effect and encounter step-count smoothing (no back-to-back fights).

Progression ([design/progression-and-balance.md](design/progression-and-balance.md))
- [ ] **PRG-1** XP curve and per-character stat growth defined in content; level-ups apply them.
- [ ] **PRG-2** Balance simulator script: run N simulated battles for a party vs. an encounter group and report win rate and turns-to-win.

Items ([design/items-equipment-inventory.md](design/items-equipment-inventory.md))
- [ ] **ITM-1** Item effects schema (heal HP/MP, revive, cure status) and use from the menu and in battle.
- [ ] **ITM-2** Interactive Items menu (sort, use, key items tab).

Saving ([design/save-system.md](design/save-system.md))
- [ ] **SAV-1** Save/load GameState to localStorage with a versioned format and 3 slots.
- [ ] **SAV-2** Title screen: New Game, Continue.
- [ ] **SAV-3** Save points as a map entity type.

Field
- [ ] **FLD-5** Screen fade on map transitions.
- [ ] **FLD-6** NPC movement (wander within a radius, face the player when talked to).
- [ ] **FLD-7** Show the full party following the leader (optional, FF6 style) or leader only (FF4 style). [?]

## M2: Party and magic

- [?] **MAG-1** Decide the magic system (see open questions in [design/magic.md](design/magic.md)).
- [ ] **MAG-2** Spell data schema and the Magic menu.
- [ ] **MAG-3** Implement learning spells per the chosen system.
- [ ] **CHR-1** Design the playable roster (6-8 characters) in [story/characters.md](story/characters.md).
- [ ] **CHR-2** Unique command per character (FF6 style: Steal, Blitz, Tools...).
- [ ] **EQP-1** Equipment slots, equip menu with stat comparison, who-can-equip-what.
- [ ] **STS-1** Status effects: poison, sleep, silence, blind, KO, and their cures.
- [ ] **PRT-1** Party roster larger than the active party; party switching.

## M3: World and story slice

- [ ] **STY-1** Write the world bible and the main story arc outline ([story/](story/README.md)).
- [ ] **STY-2** Chapter 1 beat sheet.
- [ ] **EVT-1** Event scripting: cutscenes as data (move actors, show dialogue, set flags, give items, start battles).
- [ ] **DLG-1** Dialogue choices and branching.
- [ ] **ECO-1** Shops: buy and sell, prices from item data ([design/economy.md](design/economy.md)).
- [ ] **ECO-2** Inns.
- [ ] **FLD-8** Interiors: doors lead to interior maps.
- [ ] **FLD-9** Dungeon mechanics: locked doors that need key items, switches.
- [ ] **CNT-3** Chapter 1 content: towns, dungeons, NPCs, dialogue, boss.
- [ ] **TOOL-1** Map preview: render any map to a PNG from the command line, so agents can see what they built.

## M4: Art and audio

- [ ] **ART-1** Art direction doc: palette, tile size, sprite sizes, animation frame counts.
- [ ] **ART-2** Tileset and sprite loading, replacing colored boxes (keep the box renderer as a fallback).
- [ ] **AUD-1** Music and sound effect playback; content fields for map music and battle music.

## M5: Full game

- [ ] Remaining chapters, bosses, optional content, balance passes, playtesting.
