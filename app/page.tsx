import Link from "next/link";
import { MatchQuiz } from "./components/MatchQuiz";
import { ShareButton } from "./components/ShareButton";
import { ExternalLink } from "./components/ExternalLink";

export default function Home() {
  return (
    <>
      <section className="overflow-hidden border-b border-[#dce5e2] bg-[#edf6f1]">
        <div className="container py-12 sm:py-20">
          <div className="max-w-3xl">
            <p className="eyebrow">FUKUOKA MAYORAL ELECTION / 2026.11.15</p>
            <h1 className="mt-5 text-[clamp(2.1rem,6vw,4.3rem)] font-black leading-[1.25] tracking-tight">
              迷いを、<br />選ぶ手がかりに。
            </h1>
            <p className="mt-6 max-w-2xl text-lg font-medium leading-9 text-[#324c52]">
              20の質問に答えて、考えの近い候補者を比較する、無党派のボートマッチです。一致度だけでなく、立場の根拠と出典も確かめられます。
            </p>
            <div className="mt-6 inline-flex rounded-full border border-[#97bcb3] bg-white px-4 py-2 text-sm font-bold">
              投票日 11月15日（日）・期日前投票 14日（土）まで
            </div>
          </div>
          <div className="mt-8 grid gap-3 text-sm font-bold sm:grid-cols-3 sm:max-w-2xl">
            {["回答は送信・保存しません", "13人全員を比較します", "判定方法も公開します"].map((item) => (
              <div key={item} className="flex items-center gap-2"><span className="text-[#005f61]" aria-hidden="true">✓</span>{item}</div>
            ))}
          </div>
        </div>
      </section>

      <div className="narrow py-10 sm:py-14">
        <MatchQuiz />
      </div>

      <section className="border-y border-[#dce5e2] bg-white py-12">
        <div className="container grid gap-8 md:grid-cols-[1.2fr_1fr] md:items-start">
          <div>
            <p className="eyebrow">OPEN SOURCE / TRANSPARENT</p>
            <h2 className="mt-3 text-2xl font-black">「一致しました」で終わらせない。</h2>
            <p className="mt-3 text-[#4c6067]">
              答えの判定も候補者の立場も、公開データをもとに計算しています。あなたの回答と各候補者の立場を、質問ごとに見比べてください。候補者同士の主張を読み比べるページは届出順です。
            </p>
            <div className="mt-5 flex flex-wrap gap-4 font-bold">
              <Link href="/about">判定のしくみ・中立性</Link>
              <Link href="/candidates">候補者一覧（届出順）</Link>
            </div>
          </div>
          <div className="rounded-2xl bg-[#edf6f1] p-6">
            <h2 className="font-black">投票に行きましょう</h2>
            <p className="mt-2 text-sm text-[#4c6067]">このサイトは投票先を決めるものではありません。公式情報も確認し、あなた自身の判断で一票を。</p>
            <ExternalLink href="https://www.city.fukuoka.lg.jp/senkan/senkyo/shisei/1115sityousen.html" className="mt-3 inline-block font-bold">福岡市の選挙情報（公式）</ExternalLink>
          </div>
        </div>
      </section>
      <div className="narrow py-10"><ShareButton /></div>
    </>
  );
}
