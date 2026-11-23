# ひな形アプリ（Cloudflare Workers ＋ D1）

| ファイル | 役目 | 直す人 |
|---|---|---|
| `wrangler.toml` | Worker 名・D1 の ID | AI（本人の画面の値で） |
| `src/pages.js` | 全部の文面（トップ・フォーム・特商法・利用条件・プライバシー・thanks） | AI（本人の答えで） |
| `src/index.js` | 画面の出し分け・保存・管理画面・Stripe の支払いリンク | AI |
| `migrations/0001_init.sql`・`0002_stripe_review.sql` | D1 の表（本人が D1 Console に順に貼る） | — |

## 画面
- `/` トップ → `/apply` 申込フォーム → `/thanks`（支払いリンクのボタン）
- `/tokushoho` `/terms` `/privacy`
- `/admin?key=<ADMIN_KEY>` 申込一覧・対応済／取消
- `/api/health` → `{"ok":true,"db":"ok"}`

## 秘密（Cloudflare の Worker → Settings → Variables and Secrets に本人が入れる）
- `ADMIN_KEY`：管理画面の鍵（本人が決めた長い文字列）
- `STRIPE_WEBHOOK_SECRET`：自動提供（Webhook）を使う時だけ

## 手元での確認（AI）
```bash
npm install
npm run check        # 文法と設定の確認（デプロイしない）
```
公開は Cloudflare の GitHub 連携（push → 自動ビルド）。`wrangler deploy` を AI が直接打つ必要はない。
