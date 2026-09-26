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

### Workshop mode

The owner can choose to run a stage as a conversation instead of competing
drafts. **Decided** (owner, 2026-09-26): stage 1 runs this way. In workshop
mode, steps 2 to 5 above are replaced by:

1. **Talk it through.** The owner and Claude iterate in a project thread.
   The owner gives ideas; each round, Claude builds on them with a few
   concrete, distinct options, says which it finds strongest and why, and
   asks for the owner's reaction. Together they decide what makes the most
   compelling story.
2. **Keep a running record** in `drafts/<stage>/`, one file per topic (for
   example [drafts/premise/setting.md](drafts/premise/setting.md)). Mark
   each idea as the owner's, **Agreed**, **Proposed** or **Rejected**, so
   that any later session can pick up the conversation where it stopped.
3. **Write it up.** When the owner is happy, the agreed ideas go into the
   stage's template. Claude checks the result against
   [review.md](review.md) and raises any weak spots with the owner.
4. **Owner approval**, then canonize as in step 6.

## Changing canon

A change to an approved document needs the owner's approval before it lands
on `main`. Propose it in a `needs decision` issue that lists every
downstream document and content file affected. Once the owner has decided,
push one change that:

- edits the canon document directly (don't add contradicting notes);
- updates the affected downstream documents and content, or opens issues
  for them;
- references the issue (`Fixes #N`).

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
