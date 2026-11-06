import { describe, expect, it } from "vitest";
import { electionData } from "../lib/generated-data";
import { calculateResults } from "../lib/scoring";
import type { Answers } from "../lib/types";

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
