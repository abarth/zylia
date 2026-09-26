# Progression and Balance

**Status: Proposed.** The goal is a game that's fun to play start to finish:
the party should feel stronger every session, and challenges should keep up.

## Experience and levels

- XP to reach level `L`: roughly `floor(L^3 * 1.2)` cumulative (a cubic
  curve like classic JRPGs), tuned so that fighting most encounters on the
  way puts the party at the **target level** for each area.
- Enemy XP is set from its level: `xp ≈ level^2 * 2 + 2`, adjusted per
  enemy.
- Level-ups roll stat growth (see [characters-and-stats.md](characters-and-stats.md)).

## Target curve

Each area in the content has a documented **target level** and an
**expected gear set** (what the shops and chests up to that point provide).
Designers use these to set enemy stats and boss difficulty.

| Point in the game | Target level | Approx. play time |
| --- | --- | --- |
| End of chapter 1 | 8-10 | 2 h |
| Midpoint | 25-30 | 12 h |
| Final dungeon | 45-50 | 25 h |

## Balance rules of thumb

- A regular encounter at the target level takes 2-4 party turns and costs
  10-20% of the party's total HP.
- A dungeon run without healing items should drain about 60-80% of HP and MP
  before the save point near the boss.
- A boss at the target level with the expected gear takes 3-6 minutes and is
  winnable without grinding; being 3 levels over makes it clearly easier.
- Every new party member joins at about the party's average level.

## Tooling

- **Balance simulator (PRG-2)**: a Node script that runs the real battle
  logic headlessly for a party (level, gear) against an encounter group many
  times and reports win rate, average turns, HP and MP spent. Agents creating
  enemies or areas run it and record results in the area's content notes.
- Checks in tests: every encounter group on a map is winnable at that map's
  target level with its expected gear, at a minimum win rate.
