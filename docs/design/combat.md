# Combat

**Status: Proposed.** The M0 battle screen is a placeholder that shows the
layout and resolves instantly.

## Model

Side-view battles in the FF4/FF6 style using an **Active Time Battle (ATB)**
system.

- Enemies on the left, party on the right.
- Each combatant has an ATB gauge that fills at a rate based on Agility.
  When a party member's gauge is full, their command menu opens and time
  pauses while choosing (a "Wait" mode by default; "Active" mode, where time
  keeps running, can be an option).
- Commands: **Fight**, **Magic**, **Item**, **Defend**, **Row**, **Run**, plus
  one **unique command** per character (FF6 style, e.g. Steal, Pray, Blitz).
- Front and back rows: back row halves physical damage dealt and taken for
  melee attacks.

## Formulas (starting point, tuned by the balance simulator)

- Gauge fill per tick: `(agi + 20) / 16` points; gauge is full at 1000.
  (About 5 seconds at 20 Agility, 3 seconds at 60.)
- Physical damage: `(weaponAttack + str) * (1 + level / 16) - target.defense`,
  times a random factor 0.875-1.0, minimum 1. Back row: x0.5. Critical hit:
  x2, chance `lck / 256`.
- Magic damage: `spellPower * (mag + level) / 8 - target.magicDefense`,
  random 0.875-1.0, split across targets when multi-targeted.
- Hit chance: `weaponAccuracy - target.evade`, clamped 5%-99%.
- Run: chance based on party average Agility vs. enemy average; some battles
  forbid running.

## Enemies

- Enemies have stats, elemental weaknesses/resistances, status immunities,
  XP, gold, and item drops (common and rare).
- Enemy behavior is data: an ordered list of rules like
  `{ "if": "hp < 50%", "do": "cast", "spell": "cure" }` or weighted random
  actions. Bosses use scripted phases.

## Rewards

- XP is split evenly among surviving party members. Gold goes to the party.
  Each enemy rolls its drops.

## Open questions

- Wait vs. Active as the default?
- Do KO'd members get XP? (FF4: no.)
- How visible should ATB gauges be? (FF6 shows bars.)
