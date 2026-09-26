# Magic

**Status: Open question (MAG-1).** This document lays out options; pick one
before implementing spells.

## Spell families (common to every option)

- **White**: healing, cures, protection, revival.
- **Black**: elemental damage (fire, ice, lightning, earth, wind, water) and
  status infliction.
- **Time/Grey** (optional): haste, slow, stop, gravity.
- **Summons**: large one-off effects tied to story creatures.

Spells come in tiers (e.g. Fire, Fira, Firaga style, but with our own names),
with increasing MP cost and power.

## Option A: Innate by character (FF4)

Each caster learns a fixed list of spells at fixed levels. Simple to balance
and gives each character a clear identity. Least player choice.

## Option B: Learned from relics (FF6 Espers)

The world contains relics (bound spirits, crystals...). The party equips one
relic per character; battles grant "lore points" that teach the relic's
spells at a per-spell rate, and the relic can give a stat bonus on level-up.
Anyone can eventually learn anything, which is flexible but flattens
character identity late in the game.

## Option C: Hybrid (proposed)

- Each character has an **innate school** they learn by level (their
  identity: the white mage always heals best).
- **Relics** found in the world let any character learn spells from outside
  their school, but slower and with a cap on tier (e.g. only tier 1-2 of an
  outside school).
- Relics are story objects: each is tied to a place or a myth, which gives
  writers hooks for side quests.

## Data sketch

```json
"fire": {
  "name": "Fire",
  "school": "black",
  "tier": 1,
  "mp": 4,
  "power": 20,
  "element": "fire",
  "target": "one-enemy | all-enemies | one-ally | all-allies | self",
  "effects": [{ "type": "damage" }],
  "description": "Burns one enemy."
}
```

## Open questions

- Which option? (Recommendation: C.)
- Do we name spells in the Final Fantasy style or invent our own vocabulary
  that fits the world of Zylia? (Recommendation: our own, see
  [../story/style-guide.md](../story/style-guide.md).)
