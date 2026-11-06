import type { Metadata } from "next";
import Link from "next/link";
import { electionData } from "@/lib/generated-data";
import { stanceLabel } from "@/lib/scoring";
import { ExternalLink } from "../components/ExternalLink";

export const metadata: Metadata = {
  title: "候補者一覧（届出順）",
  description: "2026年福岡市長選挙の13人の候補者を届出順で紹介。各候補者の公式情報と公開された立場の出典を確認できます。",
};

export default function CandidatesPage() {
  return (
    <div className="container py-10 sm:py-14">
      <p className="eyebrow">ALL 13 CANDIDATES / 届出順</p>
      <h1 className="mt-3 text-3xl font-black sm:text-4xl">候補者を、順位なしで見る</h1>
      <p className="mt-4 max-w-3xl text-[#4c6067]">
        このページは届出順で掲載しています。一致度の順序とは分け、どの候補者も同じ構成で確認できます。各立場は出典のある公開情報に基づき、未確認のものは「未確認」としています。
      </p>
      <Link className="mt-5 inline-block font-bold" href="/">20の質問に答えて比較する →</Link>
      <ol className="mt-9 space-y-6">
        {electionData.candidates.map((candidate, index) => (
          <li key={candidate.id} className="card p-5 sm:p-7">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-black text-[#4c6067]">届出順 {index + 1}</p>
                <h2 className="mt-1 text-3xl font-black">{candidate.name}</h2>
                <p className="text-sm text-[#4c6067]">{candidate.kana}</p>
              </div>
              <ExternalLink href={candidate.site} className="secondary-button text-sm">公式サイト</ExternalLink>
            </div>
            <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
              <div><dt className="inline font-bold">所属・推薦等：</dt><dd className="inline">{candidate.party}</dd></div>
              <div><dt className="inline font-bold">年齢：</dt><dd className="inline">{candidate.age}歳</dd></div>
              <div><dt className="inline font-bold">肩書等：</dt><dd className="inline">{candidate.occupation}</dd></div>
            </dl>
            <details className="mt-5 rounded-xl bg-[#f2f7f4] p-4">
              <summary className="min-h-7 cursor-pointer font-bold">公開情報から確認できる立場と出典</summary>
              <div className="mt-4 space-y-5">
                {electionData.questions.map((question) => {
                  const position = electionData.positions.find((item) => item.candidateId === candidate.id && item.questionId === question.id);
                  return (
                    <section key={question.id} className="border-b border-[#dce5e2] pb-5 last:border-0 last:pb-0">
                      <h3 className="font-bold">{question.text}<span className="ml-2 text-xs font-normal text-[#4c6067]">{question.category}</span></h3>
                      <p className="mt-2 font-bold text-[#005f61]">{position?.stance === null || position === undefined ? "立場未確認" : stanceLabel(position.stance)}</p>
                      <p className="mt-1 text-sm">{position?.evidence || "確認できる情報がないため、立場は推測していません。"}</p>
                      {position?.sourceUrl ? <ExternalLink href={position.sourceUrl} className="mt-1 inline-block break-all text-sm font-bold">出典</ExternalLink> : null}
                    </section>
                  );
                })}
              </div>
            </details>
          </li>
        ))}
      </ol>
    </div>
  );
}
