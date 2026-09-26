# Working on Zylia

Guidance for agents (and humans) contributing to this repository.

## Before you start

1. Read [docs/overview.md](docs/overview.md) for the vision and scope.
2. Find the task in [GitHub issues](https://github.com/abarth/zylia/issues).
   If it isn't there, open one with a milestone label (`M1: core loop`, ...),
   area labels, and a "Done when" list. Reference the issue in your commit
   message (`Fixes #N`) so it closes when the work lands on `main`. Issues
   labeled `needs decision` wait on the project owner; don't implement them
   until the decision is recorded (see [Decisions](#decisions)).
3. Read the design doc for the system you're touching (docs/design/) or the
   story docs for content you're writing (docs/story/).

## Decisions

Major decisions about the game go through GitHub issues, not chat:

1. **Ask.** Open an issue labeled `needs decision` (plus milestone and area
   labels). Lay out the options with their trade-offs, give a
   recommendation, and link the design doc that will record the answer.
   Mark the question as an **Open question** in that doc.
2. **Owner decides.** The owner answers in the issue's comments and relabels
   it `decided`. Don't act on a `needs decision` issue before that.
3. **Apply.** An agent picks up `decided` issues, reads the owner's answer
   closely, and pushes it to `main`: move the question to
   **Decided** in the design doc (or the story framework), phrased as the
   owner's rules, and update any code, content, schema or README it
   affects. Parts the owner left open stay **Open questions**; mechanics
   you add to fill gaps are **Proposed**, never Decided. Update or open
   follow-up issues for the work the decision unblocks rather than building
   large new features in the same change.
4. **Close.** Reference the issue from the commit message (`Fixes #N`) so
   the push closes it, or close it with a comment linking the commit.

Smaller questions can still be settled in chat; record the outcome in the
relevant doc either way.

## Rules of thumb

- **Content is data.** Maps, NPCs, dialogue, items, enemies and encounter
  groups live in `content/` as JSON. Never hard-code content in `src/`.
  The schema is documented in [docs/content/schema.md](docs/content/schema.md)
  and enforced by `src/content/validate.ts`; keep all three in sync.
- **Design before code** for new systems. Update or write the design doc in
  `docs/design/` first, including open questions, then implement.
- **Story before dialogue.** Story is written through the staged process in
  [docs/story/process.md](docs/story/process.md). Dialogue and content may
  only use facts from `docs/story/canon/`; drafts are not canon. If a scene
  needs a new fact, that's a canon change and needs the owner's approval.
- **Draw your design decisions.** For every decision about a direction or a
  concept, write ten ideas and let `npm run pick` choose among them, about
  a hundred times per design round, and log the draws (owner decision; see
  [docs/story/process.md](docs/story/process.md#randomness)).
- **Game pixels only.** All game code works at the fixed 256x224 internal
  resolution (`src/engine/constants.ts`). Scaling to the window is handled
  once in `src/engine/display.ts`.
- **Keep game state serializable.** `GameState` must stay plain JSON so saves
  work (see docs/design/save-system.md).

## Landing changes

Push changes directly to `main`; don't open pull requests (owner decision).

1. Start from the latest `main` (`git pull --rebase origin main`).
2. Run `npm run check` and `npm run build`. `check` type-checks and runs the
   tests, which include full content validation and a reachability check
   (every NPC, chest and sign must be reachable from the start position).
   Both must pass: never push a red `main`.
3. Commit with a message that says what changed and references its issue
   (`Fixes #N` closes it, `Refs #N` for partial work).
4. Push to `main`. If the push is rejected because `main` moved, rebase onto
   `origin/main`, run the checks again, and push.

Every push to `main` redeploys the game to GitHub Pages at
https://abarth.github.io/zylia/ (the deploy runs the same checks first). If
a push breaks `main` anyway, fix it forward right away or revert it.

To look at your change, run `npm run dev` and open the page. Use
`?map=<id>&x=<x>&y=<y>&encounters=off` to jump straight to what you changed.

## Documentation conventions

- Design docs mark each idea as **Decided**, **Proposed** or **Open question**
  so later contributors know what is settled.
- Prefer small, focused documents that link to each other over one large one.
- When a decision changes, update the doc rather than appending a
  contradiction.
