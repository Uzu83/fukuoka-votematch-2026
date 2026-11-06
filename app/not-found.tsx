import Link from "next/link";
export default function NotFound() {
  return <div className="narrow py-20"><h1 className="text-3xl font-black">ページが見つかりません</h1><p className="mt-4"><Link href="/">トップページへ戻る</Link></p></div>;
}
