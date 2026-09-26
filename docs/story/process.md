# Story Process

The story is built in stages. Each stage produces documents from a template
in [templates/](templates/), goes through review, and is approved by the
project owner before the next stage starts. Later stages may send changes
back up (a chapter needs a new fact about a character), which are handled as
explicit canon changes.

## Stages

| # | Stage | Produces (from template) | Lands in `canon/` as | Depends on |
| --- | --- | --- | --- | --- |
| 1 | **Premise and theme** | [premise.md](templates/premise.md) | `premise.md` | Principles |
| 2 | **World** | [world.md](templates/world.md), [faction.md](templates/faction.md), [location.md](templates/location.md) | `world.md`, `factions/*.md`, `locations/*.md` | Premise |
| 3 | **Cast** | [character.md](templates/character.md), [antagonist.md](templates/antagonist.md), [ensemble.md](templates/ensemble.md) | `characters/*.md`, `ensemble.md` | Premise, world |
| 4 | **Arc** | [arc.md](templates/arc.md) | `arc.md`, first entries in `threads.md` | Premise, world, cast |
| 5 | **Chapters** | [chapter.md](templates/chapter.md) | `chapters/ch<N>-<slug>.md` | Arc |
| 6 | **Scenes and dialogue** | [scene.md](templates/scene.md), then `content/dialogue/*.json` | `chapters/ch<N>/scenes/*.md` | Chapter |

Stages 1-4 are about the whole game and happen once (with revisions).
Stages 5-6 repeat per chapter and can run in parallel across chapters once
the arc is approved.

Game-system decisions interact with the story and should be made alongside
it: the magic system ([../design/magic.md](../design/magic.md)) must have a
place in the world (stage 2), and the roster size and party rules
([../design/characters-and-stats.md](../design/characters-and-stats.md))
shape the cast (stage 3).

## How a stage runs

1. **Brief.** Open (or pick up) the GitHub issue for the stage. It names the
   inputs: which canon documents this stage must honor.
2. **Pitches** (stages 1, 3 and 4): write **at least three genuinely
   different** drafts in `drafts/<stage>/`, each a complete template. "Different"
   means different core ideas, not variations in wording. For stages 2, 5
   and 6 a single draft is enough unless the issue asks for more.
3. **Review.** Each draft gets a written review using [review.md](review.md),
   by a different agent than the author, saved next to the draft as
   `<draft>.review.md`. Reviewers argue against the draft; their job is to
   find what isn't compelling yet.
4. **Revise** in response to the review. Repeat review if the draft changed a
   lot.
5. **Owner decision.** Summarize the options for the project owner: one
   paragraph per draft, its review scores, and a recommendation. The owner
   picks one, combines ideas, or sends it back.
6. **Canonize.** Move the approved document to `canon/` with
   `status: canon`, add new names to [canon/glossary.md](canon/glossary.md)
   and new setups to [canon/threads.md](canon/threads.md). Rejected drafts
   stay in `drafts/` as a record of ideas considered.

## Changing canon

A change to an approved document is a pull request that:

- edits the canon document directly (don't add contradicting notes);
- lists every downstream document and content file affected, and updates
  them or opens issues for them;
- is approved by the owner before merge.

## Document conventions

Every story document starts with front matter:

```yaml
---
id: <kebab-case id, unique within its folder>
status: draft | in-review | canon | rejected
stage: premise | world | cast | arc | chapter | scene
depends-on: [<paths of canon documents this relies on>]
---
```

Invented names are introduced in bold the first time they appear in a
document, and must be in the glossary once canon.
