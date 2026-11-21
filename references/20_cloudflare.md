# 20 Cloudflare（タスク4・5）

目的：無料で公開する場所。**GitHub に push すると Cloudflare が自動でビルドして公開**する（Workers Builds）。
この方式なら **API トークンを AI に渡さなくてよい**。
早い道（本人は鍵を貼るだけ・AI が API で組む）は `25_hayamichi.md`。「検証中」の間はこの 20 を使う。

**順番が大事：D1（タスク4）を先に作ってから、連携ビルド（タスク5）。** 仮の `database_id` のままビルドすると失敗する（Cloudflare のエラー 7404「Database not found」）。

## 1. アカウント（本人）
1. `https://dash.cloudflare.com/sign-up` → メール・パスワード → 届いたメールで確認。
2. プランは **Free** のまま。クレジットカードは入れなくてよい（求められたら「後で」）。
- 終わると：ダッシュボードが開く。

## 2. D1 データベース（タスク4）
申込・予約・注文を保存する場所。無料枠内。

### 本人がやる
1. 左メニュー **Storage & Databases** → **D1 SQL Database** → **Create Database**。
2. 名前は `app-db`。Location は自動でよい → **Create**。
3. できた画面の **Database ID**（英数字とハイフン）を AI に伝える（秘密ではない。鍵ではない）。
4. 同じ画面の **Console** を開き、AI が渡す SQL（`templates/app/migrations/0001_init.sql` の中身）を貼って **Execute**。
- 終わると：Console に「Tables」として entries / stripe_events / rate が見える。

### AI がやる
1. `templates/app/wrangler.toml` の `database_id = "REPLACE_WITH_D1_ID"` を本物に置き換える（`database_name` は `app-db`）。
2. commit → push。`state/PROGRESS.md` の記録に「D1 の名前：app-db」。
- タスク4 完了の条件：wrangler.toml に本物の ID が入って push 済み・SQL 投入済み。

## 3. GitHub 連携でアプリを作る（タスク5・本人の画面）
Cloudflare 公式の手順（2026-11 確認）：
1. 左メニュー **Workers & Pages** → **Create application**。
2. **GitHub** を選ぶ → GitHub にログインして **Cloudflare Workers & Pages** のアプリを許可 → 対象のリポ（`my-shop` など）だけを選ぶ。
3. リポを選ぶ → 設定画面：
   - **Worker 名（Project name）**：`wrangler.toml` の `name` と**完全に同じ**にする（違うと失敗）。初期値は `my-app`。変えるなら AI に言って `wrangler.toml` も変えてもらう。
   - **Root directory**：`templates/app`（**ずっとこのまま**。アプリはこの中で育てる）
   - **Build command**：空欄（依存は自動で入る）
   - **Deploy command**：`npx wrangler deploy`
   - **Production branch**：`main`
4. **Save and Deploy**。
- 終わると：ビルドのログが流れ、成功すると `https://<Worker名>.<アカウント名>.workers.dev` が表示される。

## 4. 公開 URL を確かめる（AI）
```bash
curl -s -o /dev/null -w "%{http_code}\n" https://<Worker名>.<アカウント>.workers.dev/
curl -s https://<Worker名>.<アカウント>.workers.dev/api/health
```
トップが 200・`/api/health` が `{"ok":true,"db":"ok"}` なら完了。`"ok":false` の時は `why` に理由が出る（未置換の `{{...}}` が残っている時も `ok:false`）。
通信が拒否されたら、環境の **Allowed domains** に `*.workers.dev` を足してもらう（本人の操作）。
`state/PROGRESS.md` の記録に公開 URL と Worker 名を書く。

## 5. 直し方・更新の流れ（毎回同じ）
AI がコードを直す → commit → `main` に push → Cloudflare が自動でビルド → 本番が変わる。
**時間で判断しない**：本人が **Workers & Pages → (Worker) → Deployments** で「最新のビルドが成功・コミットの文が合っている」を見るか、AI が公開 URL で変えた文言を `curl` で確かめる。
ビルドが走らない時は、push 先が `main` でない事が多い（AI が `git branch --show-current` で確認）。
失敗したら Deployments / Builds のログを本人がスクショで AI に見せる（鍵は映らない）。

## 6. 戻し方
- Cloudflare の **Deployments** で前の版を選んで **Rollback**（本人・1タップ）。
- Rollback した後は Git が新しいままなので、次の push で壊れた版が戻る。**AI が `git revert` して push** まで一組でやる。

## 7. 無料枠（公式・2026-11）
- Workers：1日 10 万リクエスト。D1：1日 読み 500 万行・書き 10 万行・保存 5GB。ビルドは月の回数枠あり。
- 超えると翌日 00:00 UTC（日本 9時）まで止まる。
- 本人が見る所：ダッシュボードの **Workers & Pages → (Worker) → Metrics**、D1 の **Metrics**。週1回見る。
- 超えそうなら AI が受付停止の案内ページを出す案を本人に出す。

## 決まり
- 独自ドメインは最初は付けない（必要になったら別途）。
- Cloudflare の API トークンは作らない・AI に渡さない。
