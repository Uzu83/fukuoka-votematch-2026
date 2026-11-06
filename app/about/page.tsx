import type { Metadata } from "next";
import Link from "next/link";
import { electionData } from "@/lib/generated-data";
import { ExternalLink } from "../components/ExternalLink";

export const metadata: Metadata = {
  title: "判定方法・中立性・データ",
  description: "一致度の計算方法、候補者の立場の出典、中立性とプライバシーへの配慮、誤りの修正方法を公開しています。",
};

const repo = "https://github.com/Uzu83/fukuoka-votematch-2026";

export default function AboutPage() {
  const real = electionData.source === "data";
  return (
    <div className="narrow prose-jp py-10 sm:py-14">
      <p className="eyebrow">METHODOLOGY / OPEN SOURCE</p>
      <h1 className="mt-3 text-3xl font-black sm:text-4xl">見えないところも、公開する。</h1>
      <p className="text-lg text-[#4c6067]">このサイトは、誰でも判定方法と立場の根拠を確認できるオープンソースのボートマッチです。</p>

      <h2>これは何ですか？</h2>
      <p>2026年福岡市長選挙（投票日11月15日）について、市政の論点への回答と、各候補者が公表した立場を比較し、考えの近さを確かめるツールです。13人全員を比較し、候補者一覧は届出順で表示します。</p>
      <p><strong>福岡市・選挙管理委員会・候補者・政党が制作する公式サイトではありません。</strong>何らかの候補者・政党の当選を目的とするものではなく、特定の候補者を推薦するものでもありません。投票先は利用者ご自身の判断で決めてください。</p>

      <h2>一致度の計算方法</h2>
      <p>回答は「反対（−2）」から「賛成（＋2）」の5段階です。候補者の立場にも同じ数値を割り当て、質問ごとに次の式で一致度を求めます。</p>
      <pre tabIndex={0} aria-label="一致度の計算式" className="overflow-x-auto rounded-xl bg-[#edf6f1] p-4 text-sm"><code>質問ごとの一致度 = 1 − |あなたの回答 − 候補者の立場| ÷ 4{`\n`}候補者ごとの一致度 = 加重一致度の合計 ÷ 重みの合計 × 100（%）</code></pre>
      <ul>
        <li>「重視する」を選んだ質問の重みを2、その他を1とします。</li>
        <li>「わからない／スキップ」は0点ではなく、計算から外します。</li>
        <li>候補者の立場が未確認の質問も計算から外し、推測で補いません。</li>
        <li>計算に使えた質問数と、候補者の立場を確認できた質問数（情報の網羅性）を、一致度と一緒に示します。少ない質問だけで高い数字が出た場合も見分けられます。</li>
        <li>一致度が同じ候補者は同率で示し、すべての候補者を表示します。</li>
        <li>回答が一つもない場合、数値の順位は付けず、届出順で全候補者を表示します。</li>
      </ul>
      <p>一致度は立場の距離を機械的に表した数値であり、投票先の正解を示すものではありません。</p>

      <h2>質問と候補者の立場</h2>
      <p>質問の順番は全員共通で固定しています。表示のランダム化は行いません。候補者の立場は、公開された公約・公式サイト・報道等をもとに、出典と根拠となる記述を添えて整理しています。発言から推測せず、確認できない論点は必ず「未確認」にします。</p>
      {real ? (
        <ul>
          <li><a href="/SOURCES.md">データの出典一覧（Markdown）</a></li>
          <li><a href="/METHODOLOGY.md">データ作成の基準（Markdown）</a></li>
          <li><a href="/COVERAGE.md">候補者・質問ごとのカバレッジ</a></li>
          <li><a href="/REVIEW_NOTES.md">全セルのレビュー記録・データの残課題</a></li>
          <li><a href={`${repo}/tree/main/data`} target="_blank" rel="noopener noreferrer">質問・候補者・立場の生データ（JSON）</a></li>
        </ul>
      ) : <p><strong>現在は開発用の架空データで動作しています。実際の選挙情報ではありません。</strong></p>}

      <h2>プライバシー</h2>
      <p>判定はすべてブラウザ内で実行します。回答を送信・保存せず、Cookie・ログイン・外部のアクセス解析・広告も使いません。ページを更新すると回答は消えます。共有ボタンも、あなたの回答や一致した候補者名を送らず、サイトのURLだけを共有します。</p>

      <h2>誤りの指摘・参加方法</h2>
      <p>立場の読み違い、出典の誤り、質問の偏り、実装の問題は、コードとデータを公開しているGitHubリポジトリで受け付けます。個人情報は書かず、修正の根拠となる公開情報のURLを添えてください。</p>
      <ul>
        <li><ExternalLink href={`${repo}/issues/new`}>GitHub Issueで誤りを報告</ExternalLink></li>
        <li><ExternalLink href={`${repo}/pulls`}>修正のPull Requestを確認・提出</ExternalLink></li>
        <li><ExternalLink href={repo}>ソースコードとREADMEを見る</ExternalLink></li>
      </ul>

      <h2>投票に行きましょう</h2>
      <p>このサイトは判断材料の一つです。各候補者の公式情報と福岡市の案内もご確認ください。投票日は2026年11月15日（日）、期日前投票は11月14日（土）までです。</p>
      <p><ExternalLink href="https://www.city.fukuoka.lg.jp/senkan/senkyo/shisei/1115sityousen.html" className="font-bold">福岡市：令和8年福岡市長選挙（公式）</ExternalLink></p>
      <p className="mt-8"><Link href="/" className="primary-button no-underline">質問に答える</Link></p>
    </div>
  );
}
