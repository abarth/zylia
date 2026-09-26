# Magic

**Status: Decided ([#18](https://github.com/abarth/zylia/issues/18)): a hybrid
of character affinity and relics.** The rules below are the owner's
decision; the numbers and data shapes under Proposed still need tuning.

The goal is a middle ground between FF4, where magic was siloed so tightly
that each character's spell list was fixed, and FF6, where every character
could learn everything and ended up feeling the same. In Zylia anyone can
eventually learn the broad families, but who a character is decides how
fast they get there, how strong their spells are, and whether they have
access to magic nobody else can use.

## Decided

- **Families.** Spells belong to families. Families differ in size: some
  are extensive, others have only a handful of spells.
- **Core families** follow common fantasy paradigms. At least:
  - **White**: healing, cures, protection, revival.
  - **Black**: elemental damage and status infliction.
  - **Time**: haste, slow, stop, gravity and similar.

  Any character can learn **every** spell of a core family, given enough
  time and dedication.
- **Exclusive families** (for example ninja magic or summoning) belong only
  to particular characters who have that ability. Relics never teach them,
  and no other character can learn them.
- **Affinity.** Some characters are aligned with one of the families.
  - A character learns spells from their aligned family in a progression
    by **level**. Levels alone do not teach the whole family.
  - They also learn their aligned family's spells **faster** from relics.
- **Relics** can be equipped by any character and teach spells from the core
  families. This is how a character fills in the rest of their own family
  and learns spells from other core families.
- **Aptitude.** Some characters are more magically inclined than others.
  They learn spells faster in general, and their stats (`mag`, `spr`, see
  [characters-and-stats.md](characters-and-stats.md)) make their spells more
  effective. A warrior can learn Black magic but will learn it slowly and
  cast it weakly.
- **Naming.** Spell names are our own, not Final Fantasy's. As an homage to
  FF, the main spell categories come in **three tiers** (like Fire, Fira,
  Firaga), with rising MP cost and power. Names must fit the world and
  follow [../story/style-guide.md](../story/style-guide.md); since they are
  content, they come from canon (see below).

## Proposed

- **Learning points.** Each battle won grants learning points to each
  living member for every spell their equipped relic teaches. A spell is
  learned when its points reach its cost. The points a member earns are
  multiplied by:
  - an **affinity multiplier** (e.g. x2) when the spell is in the
    character's aligned family;
  - the character's **aptitude** (e.g. 0.5 for a fighter, 1.0 for an
    average character, 1.5 for a born caster).
- **Tier gating by cost, not by rule.** Nothing forbids a low-aptitude
  character from learning a tier-3 spell; it just costs so many points that
  it only happens late or with dedication. This keeps "anyone can learn
  anything in a core family" true without flattening the cast.
- **One relic per character**, swapped in the menu; a relic may also give a
  small stat bonus on level-up (as FF6's Espers did).
- **Exclusive families are learned by level and story events**, never by
  points, since no relic teaches them.
- **Relics are story objects**: each is tied to a place or a myth, which gives
  writers hooks for side quests. What relics *are* in the fiction is for
  story stage 2 (world) to decide; see
  [../story/process.md](../story/process.md).

### Data sketch

Spells (`content/spells.json`):

```json
"spell-id": {
  "name": "(canon name)",
  "family": "black",
  "tier": 1,
  "mp": 4,
  "power": 20,
  "element": "fire",
  "learnCost": 40,
  "target": "one-enemy | all-enemies | one-ally | all-allies | self",
  "effects": [{ "type": "damage" }],
  "description": "Burns one enemy."
}
```

Families (`content/magic-families.json`):

```json
"black": { "name": "Black", "exclusive": false },
"summon": { "name": "Summon", "exclusive": true }
```

Per character (in `content/characters.json`):

```json
"magic": {
  "affinity": "white",
  "aptitude": 1.5,
  "exclusive": [],
  "levelSpells": [{ "level": 3, "spell": "spell-id" }]
}
```

Relics (`content/relics.json`):

```json
"relic-id": {
  "name": "(canon name)",
  "teaches": ["spell-id", "spell-id"],
  "levelBonus": { "mag": 1 }
}
```

## Open questions

- Which families exist beyond White, Black and Time, which of them are
  exclusive, and how large each one is. This ties into the cast (story stage
  3): each exclusive family needs a character who owns it.
- Can a character have more than one affinity, or none? (Proposed: at most
  one; some characters have none.)
- What magic and relics are in the world's fiction (story stage 2).
- Exact multipliers, learn costs and MP costs; see
  [progression-and-balance.md](progression-and-balance.md).
- Actual spell and family names, which wait for canon.
