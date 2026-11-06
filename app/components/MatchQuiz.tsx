"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { electionData } from "@/lib/generated-data";
import { calculateResults, stanceLabel } from "@/lib/scoring";
import type { Answer, Answers, Stance } from "@/lib/types";
import { CandidateResultCard } from "./CandidateResultCard";
import { ShareButton } from "./ShareButton";
import Link from "next/link";

const options: { value: Stance; label: string; short: string }[] = [
  { value: 2, label: "賛成", short: "賛成" },
  { value: 1, label: "どちらかといえば賛成", short: "やや賛成" },
  { value: 0, label: "どちらともいえない", short: "どちらとも" },
  { value: -1, label: "どちらかといえば反対", short: "やや反対" },
  { value: -2, label: "反対", short: "反対" },
];

export function MatchQuiz() {
  const [stage, setStage] = useState<"intro" | "quiz" | "result">("intro");
  const [answers, setAnswers] = useState<Answers>({});
  const [current, setCurrent] = useState(0);
  const questionHeading = useRef<HTMLHeadingElement>(null);
  const resultsHeading = useRef<HTMLHeadingElement>(null);
  const questions = electionData.questions;
  const question = questions[current];
  const currentAnswer = answers[question.id];
  const answeredCount = Object.values(answers).filter(
    (answer) => answer?.stance !== null && answer !== undefined,
  ).length;
  const results = useMemo(() => calculateResults(electionData, answers), [answers]);

  useEffect(() => {
    if (stage === "quiz") questionHeading.current?.focus();
    if (stage === "result") resultsHeading.current?.focus();
  }, [current, stage]);

  function next(skip = false) {
    if (skip) {
      setAnswers((previous) => ({
        ...previous,
        [question.id]: { stance: null, important: false },
      }));
    } else if (currentAnswer?.stance === null || currentAnswer === undefined) {
      return;
    }
    if (current < questions.length - 1) {
      setCurrent((index) => index + 1);
    } else {
      setStage("result");
    }
  }

  function start() { setStage("quiz"); setCurrent(0); }
  function back() {
    if (current === 0) setStage("intro");
    else setCurrent((index) => index - 1);
  }
  function reset() {
    setAnswers({});
    setCurrent(0);
    setStage("intro");
  }

  if (stage === "intro") {
    return (
      <div className="card p-6 text-center sm:p-10">
        <span className="eyebrow">VOTE MATCH / 所要時間の目安 3〜5分</span>
        <h2 className="mt-3 text-3xl font-black">あなたの考えを聞かせてください</h2>
        <p className="mx-auto mt-4 max-w-xl text-left text-[#4c6067]">
          市政の論点について、賛成から反対まで5段階で答えます。特に大切にしたい問題は「重視する」を選ぶと2倍の重みになります。わからない質問は飛ばせます。
        </p>
        <div className="mx-auto mt-5 max-w-lg rounded-xl bg-[#f1f6f3] p-4 text-left text-sm">
          <p><strong className="text-[#005f61]">プライバシー：</strong>回答はこのブラウザ内だけで計算します。サーバーへの送信、Cookie、保存、外部のアクセス解析はありません。ページを更新すると回答は消えます。</p>
        </div>
        <button type="button" className="primary-button mt-7 min-w-64 text-lg" onClick={start}>
          はじめる <span aria-hidden="true">→</span>
        </button>
        <p className="mt-5 text-xs text-[#4c6067]">特定の候補者・政党を推薦するものではありません。</p>
      </div>
    );
  }

  if (stage === "result") {
    return (
      <div>
        <p className="eyebrow">YOUR RESULTS</p>
        <h2 ref={resultsHeading} tabIndex={-1} className="mt-2 text-3xl font-black focus:outline-none">
          比較結果
        </h2>
        <p className="mt-4 text-[#4c6067]">
          {answeredCount === 0
            ? "比較できる回答がありません。全候補者を届出順で表示しています。質問に答えると、一致度を計算できます。"
            : `${questions.length}問中${answeredCount}問に回答しました。一致度の高い順に、13人全員を表示しています。`}
        </p>
        <div className="mt-5 rounded-xl border border-[#cbdad8] bg-[#f1f6f3] p-4 text-sm text-[#324c52]">
          <strong>数字は「投票すべき順位」ではありません。</strong>
          <p>一致度は、回答と公表された立場が一致した質問だけで計算します。立場が未確認の候補者も除外せず、確認できた質問数（情報の網羅性）を併記しています。同率の場合は同率と表示します。</p>
        </div>
        <ol className="mt-7 space-y-4">
          {results.map((result) => (
            <CandidateResultCard key={result.candidate.id} result={result} />
          ))}
        </ol>
        <div className="no-print mt-8 flex flex-col gap-5 border-t border-[#cbdad8] pt-8">
          <div className="flex flex-wrap gap-3">
            <button className="primary-button" type="button" onClick={() => setStage("quiz")}>
              回答を見直す
            </button>
            <button className="secondary-button" type="button" onClick={reset}>
              最初からやり直す
            </button>
          </div>
          <div className="flex flex-wrap gap-4 font-bold">
            <Link href="/candidates">候補者一覧（届出順）</Link>
            <Link href="/about">計算方法を確認する</Link>
          </div>
          <ShareButton />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-end justify-between gap-4 text-sm font-bold">
        <span>質問 {current + 1} / {questions.length}</span>
        <span className="text-[#4c6067]">回答済み {answeredCount}問</span>
      </div>
      <progress
        className="mt-2 h-3 w-full appearance-none overflow-hidden rounded-full border-0 bg-[#dce5df] [&::-moz-progress-bar]:bg-[#007a70] [&::-webkit-progress-bar]:bg-[#dce5df] [&::-webkit-progress-value]:bg-[#007a70]"
        value={current + 1}
        max={questions.length}
        aria-label={`質問の進行状況：${questions.length}問中${current + 1}問目`}
      />
      <div className="card mt-5 p-5 sm:p-8">
        <p className="eyebrow">{question.category}</p>
        <h2 ref={questionHeading} id="question-heading" tabIndex={-1} className="mt-3 text-[1.45rem] font-black leading-relaxed focus:outline-none">
          {question.text}
        </h2>
        <fieldset className="mt-7" aria-describedby="question-help">
          <legend className="sr-only">{question.text}へのあなたの回答</legend>
          <p id="question-help" className="sr-only">5段階から1つ選び、次へを押してください。わからない場合はスキップできます。</p>
          <div className="space-y-2">
            {options.map((option) => {
              const selected = currentAnswer?.stance === option.value;
              return (
                <label key={option.value} className={`flex min-h-14 cursor-pointer items-center gap-3 rounded-xl border-2 px-4 py-3 font-bold transition-colors ${selected ? "border-[#005f61] bg-[#e4f2ec] text-[#00474c]" : "border-[#d7e1df] bg-white hover:border-[#688f87]"}`}>
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    value={option.value}
                    checked={selected}
                    className="size-5 shrink-0 accent-[#005f61]"
                    onChange={() => {
                      setAnswers((previous) => ({
                        ...previous,
                        [question.id]: {
                          stance: option.value,
                          important: previous[question.id]?.important ?? false,
                        },
                      }));
                    }}
                  />
                  {option.label}
                </label>
              );
            })}
          </div>
        </fieldset>
        <label className="mt-5 flex min-h-12 cursor-pointer items-start gap-3 rounded-xl p-2 hover:bg-[#f1f6f3]">
          <input
            type="checkbox"
            className="mt-1 size-5 shrink-0 accent-[#005f61]"
            checked={currentAnswer?.important ?? false}
            onChange={(event) => {
              setAnswers((previous) => ({
                ...previous,
                [question.id]: {
                  stance: previous[question.id]?.stance ?? null,
                  important: event.target.checked,
                },
              }));
            }}
          />
          <span><strong>この問題を重視する（一致度への重み ×2）</strong><span className="block text-sm text-[#4c6067]">特に大切にしたい論点にチェックしてください。</span></span>
        </label>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button type="button" className="secondary-button" onClick={back}>
            <span aria-hidden="true">←</span> 戻る
          </button>
          <button type="button" className="primary-button" onClick={() => next()} aria-describedby="next-hint">
            {current === questions.length - 1 ? "結果を見る" : "次へ"} <span aria-hidden="true">→</span>
          </button>
        </div>
        <p id="next-hint" className="mt-3 text-right text-sm text-[#4c6067]">
          {currentAnswer?.stance === null || currentAnswer === undefined ? "回答を選ぶと次へ進めます" : `あなたの回答：${stanceLabel(currentAnswer.stance)}`}
        </p>
        <button type="button" className="mt-3 min-h-12 w-full text-center font-bold text-[#4c6067] underline" onClick={() => next(true)}>
          わからない／この質問をスキップ
        </button>
      </div>
    </div>
  );
}
