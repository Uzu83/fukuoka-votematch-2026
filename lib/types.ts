export type Stance = -2 | -1 | 0 | 1 | 2;

export type Question = {
  id: string;
  text: string;
  category: string;
};

export type Candidate = {
  id: string;
  name: string;
  kana: string;
  party: string;
  age: number;
  occupation: string;
  site: string;
};

export type Position = {
  candidateId: string;
  questionId: string;
  stance: Stance | null;
  sourceUrl: string;
  evidence: string;
};

export type CandidatePledges = {
  candidateId: string;
  pledges: { text: string; sourceUrl: string }[];
};

export type ElectionData = {
  questions: Question[];
  candidates: Candidate[];
  positions: Position[];
  pledges?: CandidatePledges[];
  source: "fixtures" | "data";
};

export type Answer = {
  stance: Stance | null;
  important: boolean;
};

export type Answers = Record<string, Answer | undefined>;

export type Comparison = {
  question: Question;
  answer: Answer;
  candidateStance: Stance | null;
  agreement: number | null;
  evidence: string;
  sourceUrl: string;
};

export type CandidateResult = {
  candidate: Candidate;
  /** Null when no answered question can be compared. */
  score: number | null;
  comparedCount: number;
  knownCount: number;
  totalQuestions: number;
  tied: boolean;
  comparisons: Comparison[];
};
