# ふくおか・みらいマッチ

2026年福岡市長選挙のための、無党派・非公式のオープンソースボートマッチです。

20の質問に答えると、考えの近い候補者を比較できます。候補者一覧では、各候補者が重点的に訴える公約3項目を届出順・同じ形式で確認できます（40字以内・出典つき、スコアには不使用）。一致度だけでなく、質問ごとの候補者の立場・根拠・出典を確認できます。投票先を推薦するサービスではありません。**投票日は2026年11月15日（日）、期日前投票は11月14日（土）までです。**

- 公開リポジトリ：https://github.com/Uzu83/fukuoka-votematch-2026
- 福岡市の公式選挙情報：https://www.city.fukuoka.lg.jp/senkan/senkyo/shisei/1115sityousen.html

## なぜOSSなのか

質問、候補者の立場、出典、計算式、表示方法をすべて公開し、誰でも検証できるようにします。特定の候補者・政党の当選を目的としていません。結果で候補者を除外したりシャッフルしたりせず、一覧は届出順で表示します。コードの誤りや立場の読み違いだけでなく、質問設計の偏りもIssueやPull Requestで指摘してください。

## プライバシー

- 回答と比較計算はブラウザ内だけで実行します。
- 回答をサーバーへ送信しません。Cookie、localStorage、会員登録、広告、外部解析もありません。
- ページ更新で回答は消えます。
- 共有ボタンはサイトURLだけを共有し、回答や一致した候補者名を共有しません。
- バックエンドはなく、Next.jsの静的エクスポート（`output: "export"`）を使用します。

## 開発

Node.js 20.9以上（開発時は24）が必要です。

```sh
npm ci
npm run dev
```

`npm run dev`の前にデータを自動準備します。開発サーバーは通常 `http://localhost:3000` です。

```sh
npm run typecheck   # TypeScript
npm test            # Vitest（data/またはfixtures/に対して実行）
npm run build       # データ検証・静的生成。out/へ出力
npm start           # ビルド済みout/を http://localhost:3000 で確認
npx playwright test # モバイル・キーボード・WCAG AAの自動検査（要 Chrome）
```

`npm run lighthouse`は3000番ポートのページに対してLighthouseを実行します。

`data/questions.json`、`data/candidates.json`、`data/positions.json`が3つそろえば本番データとして検証・埋め込みします。そろっていない間は**架空の表示確認用データ**（`fixtures/`）に切り替わり、ページで警告します。サンプルデータでのビルドを選挙情報として公開しないでください。

変更容易性のため、埋め込み用の`lib/generated-data.ts`は生成物でGit管理外です。JSONを直接編集し、`npm run data:prepare`で再生成します。データを更新したら必ず再テスト・再ビルドしてください。

## データ形式

### `data/pledges.json`

```json
[{"candidateId":"c01","pledges":[{"text":"40字以内の中立的な要約","sourceUrl":"https://…"}]}]
```

13人全員のエントリを届出順で用意し、各人0〜3項目にします。公式サイト・政策集の冒頭や重点見出し、本人回答の強調から選び、20問やスコアから選びません。出典が3件に満たない場合は確認できたものだけ掲載します。


### `data/questions.json`

順番が質問の表示順になります。シャッフルしません。

```json
[{"id": "q01", "text": "質問文", "category": "まちづくり"}]
```

### `data/candidates.json`

配列の順序は**届出順**です。13人を維持します。

```json
[{"id": "c01", "name": "候補者名", "kana": "ふりがな", "party": "無所属など", "age": 50, "occupation": "肩書", "site": "https://…"}]
```

### `data/positions.json`

```json
[{"candidateId": "c01", "questionId": "q01", "stance": 2, "sourceUrl": "https://…", "evidence": "立場を判断できる根拠の抜粋"}]
```

| `stance` | 意味 |
| --- | --- |
| `2` | 賛成 |
| `1` | どちらかといえば賛成 |
| `0` | どちらともいえない |
| `-1` | どちらかといえば反対 |
| `-2` | 反対 |
| `null` | 不明・未確認。推測しない |

`candidateId`・`questionId`の組み合わせは1件だけにしてください。全候補者×全質問のエントリを用意し、不明は`null`で示します。`sourceUrl`・`evidence`は文字列にします。研究データで未確認の`sourceUrl: null`は、ビルド時に空文字へ正規化してリンクを出しません。出典一覧とデータ化の基準は`data/SOURCES.md`・`data/METHODOLOGY.md`に記載し、サイトでも公開します。JSONの内容はライセンスMITのコードとは区別し、各引用・出典の権利関係に従います。

## 一致度

質問ごとの一致度は以下です。

```
agreement = 1 - |user_stance - candidate_stance| / 4
```

重視する質問を2、その他を1として、回答と候補者の立場の両方が存在する質問について加重平均します。

```
match_percentage = sum(agreement * weight) / sum(weight) * 100
```

ユーザーの「わからない／スキップ」と候補者の`null`は0点ではなく、分母・分子とも除外します。全候補者について、計算に使えた質問数と立場を確認できた質問数（`knownCount / totalQuestions`）を表示し、少ない情報による高い数字を誤解させないようにしています。

結果は13人全員を一致度順に表示し、1位が同率なら同率と表示します。回答がない場合は全員を「比較対象なし」として届出順で表示します。結果は投票順位ではなく、立場の近さの一つの指標です。

### テスト

- 完全一致・正反対・スキップ・重視×2・同率・全てスキップの計算。
- **13人それぞれについて**、その候補者の公開立場をそのまま回答した場合に、本人が1位または同率1位になること。データの重複ベクトル・未知立場の不足で成立しないときはテストが失敗して理由を示し、公開前にデータを検証できます。
- **22件のユニットテスト**で上記計算に加え、13人分の重点公約の届出順・件数・40字以内・出典URLを検証。
- モバイルで20問の操作・全員の詳細・戻る／進む・全問スキップ・キーボード操作と、axe-coreによるWCAG AA自動検査。

## Vercel

静的サイトなので、サーバー処理・環境変数・データベースは必要ありません。

```sh
npx vercel --prod
```

フレームワーク`Next.js`、ビルド`npm run build`でデプロイできます。`output: "export"`の出力先はNext.jsプリセットに任せ、Vercelプロジェクト側・`vercel.json`側の`outputDirectory`指定は外してください。手動で静的ファイルをアップロードする場合の出力先は`out`です。GitHub連携時も同じビルドコマンドです。

## 貢献・誤りの報告

- [Issueを作成](https://github.com/Uzu83/fukuoka-votematch-2026/issues/new)：修正の根拠となる公開URLを添えてください。個人情報は載せないでください。
- [Pull Request](https://github.com/Uzu83/fukuoka-votematch-2026/pulls)：データ訂正は他の候補者にも同じ基準を適用し、`npm test`・`npm run build`を通してください。
- 選挙の公式情報、投票所、投票方法は必ず福岡市の案内を確認してください。

## ライセンス

コードは[MIT License](./LICENSE)です。データ・引用・外部出典はそれぞれの提供元に帰属します。
