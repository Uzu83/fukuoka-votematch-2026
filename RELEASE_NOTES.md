# 公開前確認

とりまとめ用の実施記録です。実際の手元の結果を更新してからアーカイブできます。

- 2026-11-06（JST）: data/ の20問・13人・260件のデータで `npm test`（19件）、Next.jsの静的エクスポート、Playwrightのモバイル／キーボード操作とaxe-core WCAG AA検査（4件）を実施。
- 完全一致回帰: 13人全員成功、同率は発生せず。共通既知立場だけで完全同一の候補者ペアもなし。
- モバイルLighthouse（localhostの静的出力）: Performance 100 / Accessibility 100 / Best Practices 100 / SEO 100、LCP 0.9秒、CLS 0、TBT 80ミリ秒。実行環境によって異なります。
- `sourceUrl: null`（立場未確認）をURLなしとして受け入れ、出典リンクを出さない設計。
- data/SOURCES.md、data/METHODOLOGY.mdを追加し、候補者・質問ごとのカバレッジもサイトへ公開。
- 本番： https://fukuoka-votematch-2026-uzu83s-projects.vercel.app （Vercel READY）。
- 権限の相違からチーム指定のGit連携は不可。同じ実データで検証済みの静的出力を個人プロジェクトに本番アップロード。リポジトリからの自動デプロイ連携は未設定。
