import type {
  Answer,
  Answers,
  CandidateResult,
  ElectionData,
} from "./types";

/** agreement = 1 - |user stance - candidate stance| / 4 */
export function agreement(user: number, candidate: number): number {
  return 1 - Math.abs(user - candidate) / 4;
}

export function scoreCandidate(
  data: ElectionData,
  candidateId: string,
  answers: Answers,
): Omit<CandidateResult, "tied"> {
  const candidate = data.candidates.find((item) => item.id === candidateId);
  if (!candidate) throw new Error(`Unknown candidate: ${candidateId}`);

  let weightedAgreement = 0;
  let totalWeight = 0;
  let knownCount = 0;
  let comparedCount = 0;

  const comparisons = data.questions.map((question) => {
    const answer: Answer = answers[question.id] ?? {
      stance: null,
      important: false,
    };
    const position = data.positions.find(
      (item) =>
        item.candidateId === candidateId && item.questionId === question.id,
    );
    const candidateStance = position?.stance ?? null;
    if (candidateStance !== null) knownCount += 1;

    const comparable = answer.stance !== null && candidateStance !== null;
    if (answer.stance !== null && candidateStance !== null) {
      const weight = answer.important ? 2 : 1;
      weightedAgreement +=
        agreement(answer.stance, candidateStance) * weight;
      totalWeight += weight;
      comparedCount += 1;
    }

    return {
      question,
      answer,
      candidateStance,
      agreement:
        answer.stance !== null && candidateStance !== null
          ? agreement(answer.stance, candidateStance)
          : null,
      evidence: position?.evidence ?? "",
      sourceUrl: position?.sourceUrl ?? "",
    };
  });

  return {
    candidate,
    score: totalWeight === 0 ? null : weightedAgreement / totalWeight,
    comparedCount,
    knownCount,
    totalQuestions: data.questions.length,
    comparisons,
  };
}

export function calculateResults(
  data: ElectionData,
  answers: Answers,
): CandidateResult[] {
  const unscored = data.candidates.map((candidate) => ({
    ...scoreCandidate(data, candidate.id, answers),
    tied: false,
  }));
  const bestScore = unscored.reduce<number | null>(
    (best, result) =>
      result.score !== null && (best === null || result.score > best)
        ? result.score
        : best,
    null,
  );
  const bestCount = unscored.filter(
    (result) => result.score !== null && result.score === bestScore,
  ).length;

  return unscored
    .map((result) => ({
      ...result,
      tied:
        bestCount > 1 && result.score !== null && result.score === bestScore,
    }))
    .map((result, index) => ({ result, index }))
    .sort((a, b) => {
      if (a.result.score === null && b.result.score === null) {
        return a.index - b.index;
      }
      if (a.result.score === null) return 1;
      if (b.result.score === null) return -1;
      return b.result.score - a.result.score || a.index - b.index;
    })
    .map(({ result }) => result);
}

export function stanceLabel(stance: number | null): string {
  if (stance === null) return "わからない／スキップ";
  return (
    {
      "2": "賛成",
      "1": "どちらかといえば賛成",
      "0": "どちらともいえない",
      "-1": "どちらかといえば反対",
      "-2": "反対",
    } as Record<string, string>
  )[String(stance)];
}
