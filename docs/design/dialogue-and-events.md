# Dialogue and Events

## Decided (M0)

- Dialogue lives in `content/dialogue/*.json`, grouped by place or topic.
  Ids are global across all dialogue files.
- A dialogue is an ordered list of lines, each with an optional `speaker`
  and `text`. Long text wraps and splits into pages automatically. When it
  finishes it can set story flags (`setFlags`).
- NPCs name a default `dialogue` and optional `variants`, each chosen when a
  flag is set. The first matching variant wins, so list the most advanced
  story state first.
- Text appears with a typewriter effect; confirm completes the page, then
  advances.

## Proposed

- **Choices**: a line can end in `choices: [{ "text": "Yes", "goto": "id" }]`.
- **Conditions beyond single flags**: `ifFlag`, `unlessFlag`, `ifItem`,
  `ifPartyMember` on variants.
- **Events (EVT-1)**: cutscenes as a list of steps in data:
  `say`, `move` (an actor along a path), `face`, `wait`, `setFlag`,
  `giveItem`, `takeItem`, `battle`, `warp`, `joinParty`, `leaveParty`,
  `fade`, `playMusic`. Events trigger when entering a map, stepping on a
  tile, or talking to an NPC, with flag conditions so they run once.
- **Map state from flags**: entities can have `ifFlag` / `unlessFlag` so
  NPCs appear, move or disappear as the story advances.
- **Inline formatting**: `{player}` style substitutions for character names,
  and a pause marker for dramatic beats.

## Writing guidelines

See [../story/style-guide.md](../story/style-guide.md). Text box capacity is
about 38 characters per line and 3 lines per page (2 when a speaker is
shown); keep lines short and let the paging do the rest.
