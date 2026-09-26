# Characters and Stats

## Decided

Every character and enemy has the same **base stat block** (in content as
`stats`):

| Stat | Name | Role | D&D analogue |
| --- | --- | --- | --- |
| `hp` | Hit Points | Max HP. 0 means KO. | HP |
| `mp` | Magic Points | Max MP, spent on spells. | Spell slots |
| `str` | Strength | Physical damage. | STR |
| `agi` | Agility | ATB speed, evasion, run chance. | DEX |
| `vit` | Vitality | Physical defense bonus, HP growth. | CON |
| `mag` | Magic | Offensive spell power, MP growth. | INT |
| `spr` | Spirit | Healing power, magic defense, status resistance. | WIS |
| `lck` | Luck | Critical hits, drop rates, status landing. | CHA-ish |

Stats range 0-999 (HP up to 99,999 for bosses). Players see these values in
the Status menu.

## Proposed

- **Derived stats** computed from base stats plus equipment:
  - Attack = weapon attack + `str`
  - Defense = armor defense + `vit / 2`
  - Evade = armor evade + `agi / 4`
  - Magic Defense = armor magic defense + `spr / 2`
- **Growth**: each character defines per-level growth ranges for every stat
  (e.g. Kael `hp: [12, 16]`, `str: [1, 2]`), rolled on level-up. Rolls are
  seeded per character and level so every playthrough grows the same way,
  which keeps balance predictable.
- **Level cap** 99. Target level at the end of the main story: 50-55.
- **Jobs are fixed per character** (FF4 style): a character's job decides
  equipment, growth and their unique command. Magic learning may add
  flexibility (see [magic.md](magic.md)).
- A roster of 8-10 playable characters; an active party of 4 (5 in FF4 was a
  lot of UI to fit at 256x224).

## Character design template

Story-side character design lives in [../story/characters.md](../story/characters.md).
Each playable character additionally needs, in `content/characters.json`:
job, base stats at join level, growth ranges, equipment types, unique
command, starting equipment and abilities.

## Open questions

- Party size: 4 or 5?
- Do characters who aren't in the active party gain XP?
