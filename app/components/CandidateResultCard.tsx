import type { CandidateResult } from "@/lib/types";
import { stanceLabel } from "@/lib/scoring";
import { ExternalLink } from "./ExternalLink";

function CandidateStance({ stance }: { stance: number | null }) {
  return <>{stance === null ? "立場未確認" : stanceLabel(stance)}</>;
}

export function CandidateResultCard({ result }: { result: CandidateResult }) {
  const { candidate, comparisons } = result;
  return (
    <li className="card overflow-hidden">
      <div className="grid gap-4 p-5 sm:grid-cols-[1fr_auto] sm:items-center sm:p-6">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-2xl font-black">{candidate.name}</h3>
            {result.tied ? <span className="rounded-full bg-[#dff2eb] px-2 py-1 text-xs font-black">同率1位</span> : null}
          </div>
          <p className="mt-1 text-sm text-[#4c6067]">{candidate.party}　{candidate.age}歳　{candidate.occupation}</p>
          <p className="mt-3 text-sm">
            情報の網羅性：{result.totalQuestions}問中<strong>{result.knownCount}問</strong>
            <span className="block text-[#4c6067]">一致度の計算に使えたのは {result.comparedCount}問です。未回答と立場未確認の質問は、有利・不利にならないよう除外しています。</span>
          </p>
        </div>
        <div className="min-w-36 border-t border-[#dce5e2] pt-3 text-left sm:border-t-0 sm:pt-0 sm:text-right">
          {result.score === null ? (
            <><span className="block text-xl font-black">比較対象なし</span><span className="text-sm text-[#4c6067]">回答と立場の両方が必要です</span></>
          ) : (
            <><span className="text-sm font-bold">一致度</span><strong className="ml-2 text-4xl tabular-nums text-[#005f61] sm:ml-0 sm:block">{Math.round(result.score * 100)}<span className="text-xl">%</span></strong></>
          )}
        </div>
      </div>
      <details className="border-t border-[#dce5e2] bg-[#f7faf8]">
        <summary className="min-h-14 cursor-pointer px-5 py-4 font-bold marker:text-[#005f61] sm:px-6">
          質問ごとの回答・立場・出典を見る
          <span className="block text-sm font-normal text-[#4c6067]">自分の考えとすり合わせて確認してください</span>
        </summary>
        <div className="space-y-5 px-5 pb-6 pt-2 sm:px-6">
          {comparisons.map(({ question, answer, candidateStance, evidence, sourceUrl }) => (
            <section key={question.id} className="rounded-xl border border-[#dce5e2] bg-white p-4">
              <p className="text-xs font-black text-[#005f61]">{question.category}</p>
              <h4 className="mt-1 font-bold leading-relaxed">{question.text}</h4>
              <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                <div className="rounded-md bg-[#edf6f1] p-3"><dt className="font-bold">あなた{answer.important ? "（重視 ×2）" : ""}</dt><dd>{stanceLabel(answer.stance)}</dd></div>
                <div className="rounded-md bg-[#f1f3f2] p-3"><dt className="font-bold">{candidate.name}</dt><dd><CandidateStance stance={candidateStance} /></dd></div>
              </dl>
              <div className="mt-3 border-l-2 border-[#a8c6bd] pl-3 text-sm">
                <p className={evidence ? "" : "text-[#4c6067]"}>{evidence || "この質問について、確認できる立場の情報はありません。推測はしていません。"}</p>
                {sourceUrl ? <ExternalLink href={sourceUrl} className="mt-2 inline-block break-all font-bold">根拠となる出典を見る</ExternalLink> : null}
              </div>
            </section>
          ))}
          <p className="text-sm"><ExternalLink href={candidate.site}>候補者の公式サイト</ExternalLink></p>
        </div>
      </details>
    </li>
  );
}
