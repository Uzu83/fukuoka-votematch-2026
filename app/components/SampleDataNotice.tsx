export function SampleDataNotice() {
  return (
    <aside role="alert" className="border-y-2 border-[#a35000] bg-[#fff4df] py-4">
      <div className="container text-sm">
        <strong className="block text-base">【開発用サンプルデータで表示中】</strong>
        <p>氏名・政党・立場はすべて架空であり、実際の選挙情報ではありません。公開前に本物のデータへ置き換えます。</p>
      </div>
    </aside>
  );
}
