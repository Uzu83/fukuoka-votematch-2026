import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const dataDir = path.join(root, "data");
const required = ["questions.json", "candidates.json", "positions.json"];
export const hasRealData = required.every((file) =>
  fs.existsSync(path.join(dataDir, file)),
);
const sourceOverride = process.env.DATA_SOURCE;
if (sourceOverride && sourceOverride !== "data" && sourceOverride !== "fixtures")
  throw new Error("DATA_SOURCE must be data or fixtures");
if (sourceOverride === "data" && !hasRealData)
  throw new Error("DATA_SOURCE=data requires all three real data JSON files");
export const source = sourceOverride ?? (hasRealData ? "data" : "fixtures");

export function loadData() {
  const read = (file) =>
    JSON.parse(fs.readFileSync(path.join(root, source, file), "utf8"));
  const data = {
    questions: read("questions.json"),
    candidates: read("candidates.json"),
    positions: read("positions.json"),
    source,
    ...(fs.existsSync(path.join(root, source, "pledges.json"))
      ? { pledges: read("pledges.json") }
      : {}),
  };
  const fail = (message) => {
    throw new Error(`${source}: ${message}`);
  };
  if (!Array.isArray(data.questions) || data.questions.length === 0)
    fail("questions.json must contain questions");
  if (data.candidates.length !== 13)
    fail(`Expected 13 candidates; found ${data.candidates.length}`);
  const ids = (items) => new Set(items.map((item) => item.id));
  if (ids(data.questions).size !== data.questions.length)
    fail("Question IDs must be unique");
  if (ids(data.candidates).size !== data.candidates.length)
    fail("Candidate IDs must be unique");
  const questionIds = ids(data.questions);
  const candidateIds = ids(data.candidates);
  const seenPositions = new Set();
  for (const position of data.positions) {
    if (!candidateIds.has(position.candidateId))
      fail(`Missing candidate ${position.candidateId}`);
    if (!questionIds.has(position.questionId))
      fail(`Missing question ${position.questionId}`);
    const pair = `${position.candidateId}:${position.questionId}`;
    if (seenPositions.has(pair)) fail(`Duplicate position: ${pair}`);
    seenPositions.add(pair);
    if (![-2, -1, 0, 1, 2, null].includes(position.stance))
      fail(`Invalid stance at ${pair}`);
    if (typeof position.evidence !== "string")
      fail(`Evidence must be a string at ${pair}`);
    if (position.sourceUrl === null) position.sourceUrl = "";
    if (typeof position.sourceUrl !== "string")
      fail(`sourceUrl must be a string or null at ${pair}`);
  }
  if (data.pledges) {
    if (!Array.isArray(data.pledges)) fail("pledges.json must be an array");
    const pledgeCandidateIds = new Set(data.pledges.map((item) => item.candidateId));
    if (pledgeCandidateIds.size !== 13) fail("13 pledge entries required");
    for (const candidate of data.candidates) {
      const entry = data.pledges.find((item) => item.candidateId === candidate.id);
      if (!entry) fail(`Missing pledges for ${candidate.id}`);
      if (!Array.isArray(entry.pledges) || entry.pledges.length > 3)
        fail(`0–3 pledges required for ${candidate.id}`);
      for (const pledge of entry.pledges) {
        if (typeof pledge.text !== "string" || !pledge.text.trim())
          fail(`Pledge text required for ${candidate.id}`);
        if (Array.from(pledge.text).length > 40)
          fail(`Pledge text exceeds 40 characters for ${candidate.id}`);
        try { new URL(pledge.sourceUrl); }
        catch { fail(`Valid sourceUrl required for ${candidate.id}`); }
      }
    }
  }
  return data;
}

export function prepare() {
  const data = loadData();
  const module = `// Generated from ${source}/. Do not edit.\n` +
    `import type { ElectionData } from "./types";\n` +
    `export const electionData: ElectionData = ${JSON.stringify(data)};\n`;
  fs.writeFileSync(path.join(root, "lib", "generated-data.ts"), module);
  console.log(
    `Using ${source}: ${data.candidates.length} candidates, ${data.questions.length} questions`,
  );
  if (source === "fixtures") {
    console.warn("WARNING: These are FICTITIOUS SAMPLE FIXTURES, not election data.");
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) prepare();

function fileURLToPath(url) {
  return decodeURIComponent(new URL(url).pathname);
}
