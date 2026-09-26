# Content Authoring Guide

How agents turn design and story into playable content. The pipeline goes
from high-level story documents down to JSON, and each layer is reviewed
against the one above it.

```
story/world.md, story/characters.md, story/story-arc.md   (what happens and why)
        |
story/chapters/<chapter>.md                               (beat sheet: scenes, places, who's there)
        |
content notes in the chapter doc                          (maps to build, NPC list, encounters, treasure, target level)
        |
content/*.json                                            (the data the game loads)
```

## Adding a map

1. Decide its `id`, `kind`, and how the party gets in and out.
2. Draw it in `content/maps/<id>.json` as rows of characters. Reuse tile ids
   from `tiles.json`; add a tile type only if nothing fits.
3. Add warps in both directions: from the map it connects to, and back.
   Warp targets must be walkable and shouldn't be another warp (or the party
   bounces straight back).
4. Place NPCs, signs and chests. Every one must be reachable (the tests
   check this).
5. Add an encounter table for dangerous areas, using encounter groups that
   fit the area's target level.
6. Run `npm run check`, then `npm run dev` and visit it with
   `?map=<id>&x=<x>&y=<y>&encounters=off`.

## Adding an NPC and dialogue

1. Check the story docs: who is this person, what do they know at this point
   in the story? Named NPCs get an entry in the chapter doc.
2. Write the dialogue in `content/dialogue/<map-or-topic>.json`, following
   [../story/style-guide.md](../story/style-guide.md).
3. Give NPCs something useful or characterful to say: a hint, a rumor, a
   piece of lore, a joke. Avoid "Welcome to <town>!" filler (signs do that).
4. If the NPC should react to story progress, add `variants` keyed on
   flags, most advanced story state first.

## Adding enemies and encounters

1. Define the enemy in `enemies.json` at the level of the area it appears in.
2. Group enemies in `encounter-groups.json` (1-6 enemies).
3. Reference groups from map encounter tables.
4. When the balance simulator exists (PRG-2), run it for each new group and
   record the results in the chapter doc.

## Review checklist

- [ ] `npm run check` passes.
- [ ] Names, places and facts match the story docs; new facts were added to
      them.
- [ ] Dialogue fits the character's voice (see characters.md).
- [ ] Treasure and gold amounts fit [../design/economy.md](../design/economy.md).
- [ ] Encounter difficulty fits the area's target level.
- [ ] Visited in the browser.
