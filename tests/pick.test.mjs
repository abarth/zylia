import { describe, expect, it } from "vitest";
import {
  checkDecision,
  countEntries,
  drawIndices,
  formatEntry,
  parseArgs,
} from "../tools/pick.mjs";

const ten = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"];

describe("pick", () => {
  it("draws distinct indices in range", () => {
    for (let k = 1; k <= 10; k++) {
      const picked = drawIndices(10, k);
      expect(picked).toHaveLength(k);
      expect(new Set(picked).size).toBe(k);
      for (const i of picked) expect(i >= 0 && i < 10).toBe(true);
    }
  });

  it("uses the random source it is given", () => {
    expect(drawIndices(10, 1, () => 7)).toEqual([7]);
    // 0 takes the first of the remaining pool each time.
    expect(drawIndices(10, 3, () => 0)).toEqual([0, 1, 2]);
  });

  it("requires exactly ten distinct ideas", () => {
    expect(checkDecision({ question: "Q?", options: ten })).toBeNull();
    expect(checkDecision({ question: "Q?", options: ten.slice(0, 9) })).toMatch(/exactly 10/);
    expect(checkDecision({ question: "Q?", options: [...ten.slice(0, 9), "a"] })).toMatch(/repeats/);
    expect(checkDecision({ question: "", options: ten })).toMatch(/question/);
    expect(checkDecision({ question: "Q?", options: ten, pick: 11 })).toMatch(/1 to 10/);
  });

  it("numbers log entries after the ones already there", () => {
    const entry = formatEntry(4, { question: "Q?", options: ten }, [2], new Date(0));
    expect(entry).toContain("### 4. Q?");
    expect(entry).toContain("**Drawn: 3 (c)**");
    expect(countEntries(entry + formatEntry(5, { question: "R?", options: ten }, [0]))).toBe(2);
  });

  it("parses its flags", () => {
    expect(parseArgs(["--log", "x.md", "--pick", "2", "Q?", "a"])).toEqual({
      log: "x.md",
      batch: null,
      pick: 2,
      rest: ["Q?", "a"],
    });
  });
});
