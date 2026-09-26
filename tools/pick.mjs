#!/usr/bin/env node
// Random picker for design work. The owner's rule (docs/story/process.md,
// "Randomness"): every time an agent makes a decision about a direction or
// a concept, it writes ten ideas and lets this program choose among them,
// so that an outside source of randomness steers the design instead of the
// model's habits.
//
// One decision:
//   npm run pick -- --log FILE "Question?" "idea 1" "idea 2" ... "idea 10"
// Several decisions at once (a JSON array of {question, options, pick?}):
//   npm run pick -- --log FILE --batch decisions.json
// Draw several distinct ideas instead of one:
//   npm run pick -- --pick 3 "Question?" "idea 1" ... "idea 10"
//
// Draws use crypto.randomInt. With --log, each decision, its ten ideas and
// the draw are appended to a Markdown log so the owner can see them.

import { randomInt } from "node:crypto";
import { appendFileSync, existsSync, readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

export const IDEAS_PER_DECISION = 10;

/** Picks `k` distinct indices in [0, n) with `rng(max)` returning [0, max). */
export function drawIndices(n, k, rng = randomInt) {
  if (k < 1 || k > n) throw new Error(`can't pick ${k} of ${n}`);
  const pool = [...Array(n).keys()];
  const picked = [];
  for (let i = 0; i < k; i++) {
    const j = rng(pool.length);
    picked.push(pool[j]);
    pool.splice(j, 1);
  }
  return picked;
}

/** Checks one decision and returns an error message, or null if it's fine. */
export function checkDecision(d) {
  if (typeof d.question !== "string" || d.question.trim() === "") {
    return "a decision needs a question";
  }
  if (!Array.isArray(d.options) || d.options.length !== IDEAS_PER_DECISION) {
    const got = Array.isArray(d.options) ? d.options.length : 0;
    return `"${d.question}" has ${got} ideas; write exactly ${IDEAS_PER_DECISION}`;
  }
  if (d.options.some((o) => typeof o !== "string" || o.trim() === "")) {
    return `"${d.question}" has an empty idea`;
  }
  if (new Set(d.options.map((o) => o.trim())).size !== d.options.length) {
    return `"${d.question}" repeats an idea`;
  }
  const k = d.pick ?? 1;
  if (!Number.isInteger(k) || k < 1 || k > IDEAS_PER_DECISION) {
    return `"${d.question}" can pick 1 to ${IDEAS_PER_DECISION} ideas, not ${k}`;
  }
  return null;
}

/** Number of decisions already in a log. */
export function countEntries(logText) {
  return logText.split("\n").filter((line) => /^### \d+\. /.test(line)).length;
}

/** One log entry in Markdown. `picked` holds zero-based indices. */
export function formatEntry(number, decision, picked, when = new Date()) {
  const lines = [`### ${number}. ${decision.question}`, ""];
  decision.options.forEach((o, i) => lines.push(`${i + 1}. ${o}`));
  const drawn = picked.map((i) => `${i + 1} (${decision.options[i]})`).join("; ");
  lines.push("", `**Drawn: ${drawn}** _${when.toISOString()}_`, "");
  return lines.join("\n") + "\n";
}

export function parseArgs(argv) {
  const opts = { log: null, batch: null, pick: 1, rest: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--log") opts.log = argv[++i];
    else if (a === "--batch") opts.batch = argv[++i];
    else if (a === "--pick") opts.pick = Number(argv[++i]);
    else opts.rest.push(a);
  }
  return opts;
}

function main(argv) {
  const opts = parseArgs(argv);
  let decisions;
  if (opts.batch) {
    decisions = JSON.parse(readFileSync(opts.batch, "utf8"));
    if (!Array.isArray(decisions)) throw new Error("the batch file must hold a JSON array");
  } else {
    const [question, ...options] = opts.rest;
    decisions = [{ question, options, pick: opts.pick }];
  }
  const problems = decisions.map(checkDecision).filter(Boolean);
  if (problems.length > 0) {
    for (const p of problems) console.error(`pick: ${p}`);
    process.exitCode = 1;
    return;
  }

  let number = opts.log && existsSync(opts.log) ? countEntries(readFileSync(opts.log, "utf8")) : 0;
  let log = "";
  for (const d of decisions) {
    number++;
    const picked = drawIndices(d.options.length, d.pick ?? 1);
    console.log(`${number}. ${d.question}`);
    for (const i of picked) console.log(`   -> ${i + 1}. ${d.options[i]}`);
    log += formatEntry(number, d, picked);
  }
  if (opts.log) {
    appendFileSync(opts.log, log);
    console.log(`(${number} decisions in ${opts.log})`);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    main(process.argv.slice(2));
  } catch (e) {
    console.error(`pick: ${e.message}`);
    process.exitCode = 1;
  }
}
