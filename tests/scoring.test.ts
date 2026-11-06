import { describe, expect, it } from "vitest";
import { electionData } from "../lib/generated-data";
import { agreement, calculateResults } from "../lib/scoring";
import type { ElectionData, Position } from "../lib/types";

const makePosition = (
  candidateId: string,
  questionId: string,
  stance: Position["stance"],
): Position => ({
  candidateId, questionId, stance, sourceUrl: "https://example.com", evidence: "test",
});
const base: ElectionData = {
  source: "fixtures",
  questions: [
    { id: "q1", text: "Q1", category: "A" },
    { id: "q2", text: "Q2", category: "B" },
  ],
  candidates: [
    { id: "a", name: "A", kana: "A", party: "無所属", age: 40, occupation: "会社員", site: "https://example.com" },
    { id: "b", name: "B", kana: "B", party: "無所属", age: 50, occupation: "会社員", site: "https://example.com" },
  ],
  positions: [makePosition("a", "q1", 2), makePosition("a", "q2", -2), makePosition("b", "q1", -2), makePosition("b", "q2", null)],
};

describe("agreement", () => {
  it("gives 100% to identical stances and 0% to opposite stances", () => {
    expect(agreement(2, 2)).toBe(1);
    expect(agreement(-2, -2)).toBe(1);
    expect(agreement(2, -2)).toBe(0);
    expect(agreement(1, -1)).toBe(0.5);
  });
});

describe("calculateResults", () => {
  it("ranks every candidate without deleting low scorers", () => {
    const results = calculateResults(base, { q1: { stance: 2, important: false } });
    expect(results).toHaveLength(2);
    expect(results[0].candidate.id).toBe("a");
    expect(results[0].score).toBe(1);
    expect(results[1].score).toBe(0);
  });

  it("skips unknown user answers and null candidate stances", () => {
    const results = calculateResults(base, { q1: { stance: null, important: true }, q2: { stance: 2, important: false } });
    expect(results[0].comparedCount).toBe(1); // candidate A only
    expect(results[0].score).toBe(0); // A q2 opposite
    expect(results[0].knownCount).toBe(2);
    expect(results[1].score).toBeNull(); // B q2 unknown, q1 skipped
    expect(results[1].comparedCount).toBe(0);
    expect(results[1].knownCount).toBe(1);
  });

  it("weights important questions exactly twice", () => {
    const results = calculateResults(base, {
      q1: { stance: 2, important: true },
      q2: { stance: 1, important: false },
    });
    // candidate A: (100% * 2 + 25% * 1) / 3 = 75%
    expect(results[0].score).toBe(0.75);
  });

  it("marks ties for first place and comes after their score", () => {
    const tied: ElectionData = {
      ...base,
      positions: [makePosition("a", "q1", 1), makePosition("b", "q1", 1)],
    };
    const results = calculateResults(tied, { q1: { stance: 1, important: false } });
    expect(results).toHaveLength(2);
    expect(results.every((result) => result.score === 1 && result.tied)).toBe(true);
  });

  it("returns every candidate, with null scores, when all questions are skipped", () => {
    const answers = Object.fromEntries(electionData.questions.map((q) => [q.id, { stance: null, important: false }]));
    const results = calculateResults(electionData, answers);
    expect(results).toHaveLength(13);
    expect(results.every((result) => result.score === null && result.comparedCount === 0)).toBe(true);
    expect(results.map((r) => r.candidate.id)).toEqual(electionData.candidates.map((c) => c.id));
    expect(results.every((result) => result.comparisons.length === electionData.questions.length)).toBe(true);
  });
});
