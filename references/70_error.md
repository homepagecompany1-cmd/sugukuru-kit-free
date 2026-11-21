# 70 エラー表（同じ手を3回繰り返さない）

| 出た物 | 原因の候補 | 本人の操作 | AI の操作 |
|---|---|---|---|
| `git push` が `403` / `Permission denied` | GitHub との接続がない・リポを選んでいない | A：Claude の GitHub 接続でリポを選び直す／B：Codex の環境で GitHub を再接続 | 再接続後に `git push` |
| `curl` が `host not allowed` / 接続拒否 | 環境のネット許可に無い | 環境の Allowed domains に `*.workers.dev`（とキット配布先）を足す | 足した後に再実行 |
| Cloudflare のビルドが `name` の不一致で失敗 | Worker 名と `wrangler.toml` の `name` が違う | 画面の Worker 名を教える | `wrangler.toml` を合わせて push |
| ビルド失敗 `Missing entry-point` | `main` のパスが違う／Root directory の設定 | Root directory を確認 | `wrangler.toml` の `main` を確認 |
| `/api/health` が `{"db":"error"}` | database_id が仮のまま・スキーマ未投入 | D1 の Console で SQL を実行 | `wrangler.toml` の ID を確認 |
| `/api/health` が `ok:false` で `未置換` | pages.js か STRIPE_LINK に `{{...}}` が残っている | 足りない情報を答える | 置き換えて push |
| ビルド失敗 7404 `Database not found` | D1 の ID が仮のまま先にビルドした | D1 を作って ID を伝える（タスク4） | ID を入れて push |
| push したのにビルドが走らない | `main` 以外に push した／PR が merge されていない | B：PR を merge | A：`git branch --show-current` → main に merge して push |
| `D1_ERROR: no such table` | スキーマ未投入 | D1 Console に `migrations/0001_init.sql` を貼って実行 | SQL を渡す |
| Stripe「本番環境が有効ではありません」 | 本人確認・事業情報が未完了か審査中 | ダッシュボードの未完了項目を埋める | 状態を `審査待ち` に |
| Stripe が Web サイト URL を求める | 販売条件ページ未公開 | — | 40_hanbai_joken.md を先に終える |
| 支払いリンクが「テスト」と表示 | テスト環境で作った | 本番環境に切り替えて作り直す | リンクを差し替え |
| 無料枠超過（Workers 429 / D1 エラー） | 1日の上限 | 翌日 00:00 UTC（日本 9時）に戻る | 回数制限を入れる |
| 2段階認証・SMS が届かない | 通信・番号違い | 本人がサービスのヘルプで対応 | 待つ。代行しない |
| ログインが戻らない | アプリ内ブラウザ | Safari/Chrome で開き直す | — |
| セッションが期限切れ | VM が消えた | 同じリポで新しいセッション →「続きから」 | `state/PROGRESS.md` から再開 |

## 3回同じエラーなら
- `state/PROGRESS.md` の「失敗の記録」に、出た文・試した事・次の一手を書いて push。
- 本人に「伴走者に見せてください」と言い、見せる物は**エラーの文とスクショ**。鍵・氏名・住所・口座・お客さんの名前やメールは塗る。
- push も保存もできない時は、進んだ所と次の一手を5行にまとめて本人に渡し、「次のセッションの最初にこれを貼ってください」と言う。
