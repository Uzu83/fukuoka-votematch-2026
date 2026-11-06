import { describe, expect, it } from "vitest";
import { electionData } from "../lib/generated-data";
import { calculateResults } from "../lib/scoring";
import type { Answers } from "../lib/types";
import pledgeData from "../data/pledges.json";
import type { CandidatePledges } from "../lib/types";

/**
 * Regression test for EVERY real candidate. If candidates have identical known
 * stance vectors, a tie is the mathematically correct outcome, reported below.
 * If no stances are known, ranking is undefined and the candidate must not fail
 * silently: the test explicitly reports the data problem.
 */
describe.each(electionData.candidates)("candidate $id: identical answer regression", (candidate) => {
  it(`${candidate.name} is ranked first (or tied first) when answers exactly match known stances`, () => {
    const knownPositions = electionData.positions.filter(
      (position) => position.candidateId === candidate.id && position.stance !== null,
    );
    expect(
      knownPositions.length,
      `${candidate.name}: too few known stances; the ranking test needs at least one known stance`,
    ).toBeGreaterThan(0);

    const answers: Answers = Object.fromEntries(
      electionData.questions.map((question) => {
        const stance = knownPositions.find((position) => position.questionId === question.id)?.stance ?? null;
        return [question.id, { stance, important: false }];
      }),
    );
    const results = calculateResults(electionData, answers);
    const best = results[0].score;
    const tiedLeaders = results.filter((result) => result.score === best);
    const identical = tiedLeaders.filter((result) =>
      electionData.questions.every((question) =>
        result.comparisons.find((item) => item.question.id === question.id)?.candidateStance ===
        answers[question.id]?.stance,
      ),
    );
    if (tiedLeaders.length > 1) {
      console.info(`${candidate.name}: tied #1 with ${tiedLeaders.length} candidates; identical vectors: ${identical.map((result) => result.candidate.name).join(", ")}`);
    }
    expect(
      results[0].candidate.id === candidate.id || (results[0].tied && tiedLeaders.some((result) => result.candidate.id === candidate.id)),
      `${candidate.name} failed: score=${tiedLeaders.find((result) => result.candidate.id === candidate.id)?.score}; best=${best}; known stances=${knownPositions.length}. Identical candidates: ${identical.map((result) => result.candidate.name).join(", ")}`,
    ).toBe(true);
  });
});

describe("重点公約", () => {
  const entries = pledgeData as CandidatePledges[];

  it("13人全員に届出順のエントリがある", () => {
    expect(entries.map((entry) => entry.candidateId)).toEqual(
      electionData.candidates.map((candidate) => candidate.id),
    );
    expect(new Set(entries.map((entry) => entry.candidateId)).size).toBe(13);
  });

  it("各公約は1〜3件、40字以内で、本文と出典URLを持つ", () => {
    for (const entry of entries) {
      expect(entry.pledges.length).toBeGreaterThan(0);
      expect(entry.pledges.length).toBeLessThanOrEqual(3);
      for (const pledge of entry.pledges) {
        expect(pledge.text.trim().length).toBeGreaterThan(0);
        expect([...pledge.text].length).toBeLessThanOrEqual(40);
        const source = new URL(pledge.sourceUrl);
        expect(source.protocol).toBe("https:");
        expect(source.hostname.length).toBeGreaterThan(0);
      }
    }
  });

  it("同じ候補者の公約が重複しない", () => {
    for (const entry of entries) {
      expect(new Set(entry.pledges.map((pledge) => pledge.text)).size).toBe(
        entry.pledges.length,
      );
    }
  });
});
