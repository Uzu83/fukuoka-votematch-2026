import Link from "next/link";

export function SiteHeader() {
  return (
    <>
      <a className="skip-link" href="#main">本文へ移動</a>
      <header className="border-b border-[#dce5e2] bg-[#fbfcfafa]">
        <div className="container flex min-h-16 items-center justify-between gap-4">
          <Link href="/" className="font-black tracking-tight text-[#142b35] no-underline">
            <span className="mr-2 text-[#005f61]" aria-hidden="true">◈</span>
            ふくおか・みらいマッチ
          </Link>
          <nav aria-label="メインナビゲーション" className="flex gap-4 text-sm font-bold">
            <Link href="/candidates">候補者</Link>
            <Link href="/about">しくみ</Link>
          </nav>
        </div>
      </header>
    </>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-[#dce5e2] py-8 text-sm">
      <div className="container space-y-2 text-[#4c6067]">
        <p>非公式・無党派のオープンソースプロジェクト</p>
        <p><Link href="/about">判定方法・データの出典・修正方法</Link></p>
        <p>投票日：2026年11月15日（日）　期日前投票：11月14日（土）まで</p>
      </div>
    </footer>
  );
}
