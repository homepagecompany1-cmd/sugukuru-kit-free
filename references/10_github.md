# 10 GitHub（タスク3）

目的：コードと進捗の置き場。AI が読み書きし、Cloudflare がここから自動で公開する。

## 1. アカウント（本人・スマホのブラウザ）
1. `https://github.com/signup` を開く → メール・パスワード・ユーザー名を決める。
2. メールに届いたコードを入れる。
3. 2段階認証を勧められたら本人が設定する（SMS か認証アプリ）。
- 終わると：右上に自分のアイコンが出る。

## 2. リポジトリを作る（本人）
1. 右上「＋」→ **New repository**。
2. 名前は英数字（例 `my-shop`）。**Private** を選ぶ。「Add a README」にチェックを入れる。
3. **Create repository**。
- 終わると：`https://github.com/<ユーザー名>/<リポ名>` が開く。

## 3. AI との接続
### A：Claude Code
1. Claude アプリ → **Code** タブ → 初回は「GitHub を接続」→ **Claude GitHub App** を許可し、さっき作ったリポを選ぶ。
2. そのリポで新しいセッションを始め、「キットを読んで始めて」と送る（キットの入れ方は 4 へ）。
- 終わると：セッションの中で `git remote -v` に github.com が出て、`git push` が通る。

### B：Codex
1. Codex（ChatGPT）のクラウドで **環境** を作る → GitHub を接続 → リポを選ぶ。
2. 環境の **Network** で外部への通信を許可する（少なくとも `*.workers.dev` と `raw.githubusercontent.com`）。
3. その環境でタスクを始め、「キットを読んで始めて」と送る。

## 4. キットをリポに入れる（AI がやる）
配布先は GitHub の公開リポ（`https://github.com/homepagecompany1-cmd/sugukuru-kit-free`）。この URL を本人から渡されたら、まず `index.json` を取り、中の一覧どおりに取り込む：
```bash
# 配布元の取り込みスクリプトを読んでから実行（中身は index.json の path を curl で取るだけ）
curl -fsSL "https://raw.githubusercontent.com/homepagecompany1-cmd/sugukuru-kit-free/main/tools/fetch_kit.sh" -o /tmp/fetch_kit.sh && cat /tmp/fetch_kit.sh && bash /tmp/fetch_kit.sh "https://github.com/homepagecompany1-cmd/sugukuru-kit-free"
git status && git add -A && git commit -m "すぐ来るキットを取り込み"
git push origin main   # A のみ。B は本人が Codex の画面で PR → merge
```
既にあるファイルは上書きしない（再取り込みで進捗や本人の設定が消えないように）。全部入れ直す時だけ `--force`。
通信が拒否されたら：A は環境の **Allowed domains** にキットのドメインを足す（本人が claude.ai/code の環境編集で）。B は環境の Network に足す。

本人が ZIP で持っている場合：スマホから GitHub の **Add file → Upload files** はフォルダ単位で難しいので、**配布 URL を使う方法を勧める**。

## 5. 決まり
- 公開されるのは `main` だけ。A は `main` に commit → push（`git branch --show-current` で確認）。B は commit → 本人が PR を merge。本人は Git を知らなくてよい。
- リポは Private。公開範囲を変える時は本人に理由を説明して同意を得る。
- 鍵・トークンは絶対に commit しない（`.gitignore` に `.env` `*.pem` がある）。

## 終わりの確かめ方
- GitHub の画面（Safari）に `AGENTS.md` と `state/` と `templates/app/` が見える → 完了（本人が見る）。
- `state/PROGRESS.md` の記録に「GitHub リポ：<URL>」を書く。
