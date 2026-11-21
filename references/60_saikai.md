# 60 保存・翌日の再開・戻し方（タスク11）

## 保存の決まり
- 進捗は `state/PROGRESS.md`、商品は `state/PRODUCT.md`、運用手順は `state/UNYO.md`。コードと記録は **GitHub の `main`** に入った物だけが残る（A は push、B は PR の merge）。
- D1 のデータは Cloudflare の中、鍵は Cloudflare／Stripe の画面の中。GitHub には入らない（場所が違う）。
- クラウドのセッションは時間が経つと VM が消える。**push していない変更は消える**。1つ終わるごとに push。
- 鍵・トークンは Cloudflare／Stripe の画面の中だけ。ファイルに書かない。

## 翌日の再開（本人）
1. A：Claude アプリ → Code タブ → 同じリポで新しいセッション → 「続きから」と送る。
   B：Codex → 同じ環境で新しいタスク → 「続きから」。
2. AI は `AGENTS.md` → `state/PROGRESS.md` を読み、残りを表で出す。

## 再開時に AI が確かめる事（☑が古くなっていないか）
- `git pull` が通る／`main` にいる
- 公開 URL が 200 を返す（`curl`）
- `/api/health` が `{"db":"ok"}`
- Stripe の支払いリンクが開く（本人がタップ）
- 失効していれば該当タスクを `失敗` に戻し、理由を書いて直す

## 戻し方
- コードを壊した：AI が `git revert <commit>` → push → Cloudflare が自動で前の状態を公開。
- Cloudflare の画面から：**Deployments → 前の版 → Rollback**（本人）。
- D1 のデータを消した：D1 の **Time Travel** で過去の時点へ戻せる（公式：**無料プランは 7 日**・有料は 30 日）。復元は `wrangler d1 time-travel restore` が要るので、本人のスマホだけでは難しい→伴走者に相談（本人の画面共有で）。戻すと、その時点より後の申込は消える。先に `/admin` のスクショで残す。

## やめる・引き継ぐ
- すべて本人名義のアカウントなので、伴走者がいなくなっても本人だけで続けられる。
- 別の人に渡す時は GitHub の **Collaborators** に追加（本人の操作）。キットの利用条件（LICENSE.md）は「本人1名または1事業」。従業員・委託先に見せるのは可、キット自体を渡すのは不可。引き継いだら前の人の権限を外す。
