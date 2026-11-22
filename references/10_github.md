# 10 GitHub（タスク2）

目的：コードと進捗の置き場。AI が読み書きし、Cloudflare がここから自動で公開する。

## 1. アカウント（本人・スマホのブラウザ）
1. `https://github.com/signup` を開く → メール・パスワード・ユーザー名を決める。
2. メールに届いたコードを入れる。
3. 2段階認証を勧められたら本人が設定する。**別アプリは不要**：iPhone は「設定 → パスワード」、Android は Google パスワードマネージャーで認証コードを作れる（GitHub の画面で「認証アプリ」を選び、QR をカメラで読む）。SMS でもよい。
   - **リカバリーコード（16桁の一覧）は必ずメモに保存**。認証アプリに GitHub が無くなった時は、ログイン画面の「More options」から SMS／パスキー／リカバリーコードで入る。
- 終わると：右上に自分のアイコンが出る。

## 2. リポジトリを作る（本人）
### おすすめ：テンプレートから（キットが最初から入る・取り込み不要）
1. `https://github.com/homepagecompany1-cmd/sugukuru-kit-free` を開く → **Use this template** → **Create a new repository**。
2. 名前は英数字（例 `my-shop`）。**Private** を選ぶ → **Create repository**。
- これで 4（取り込み）は飛ばしてよい。

### テンプレートが使えない時：空のリポから
1. 右上「＋」→ **New repository**。
2. 名前は英数字（例 `my-shop`）。**Private** を選ぶ。「Add a README」にチェックを入れる。
3. **Create repository**。
- 終わると：`https://github.com/<ユーザー名>/<リポ名>` が開く。

## 3. AI との接続
### A：Claude Code（スマホだけの人は、こちらがおすすめ）
0. 初回だけ：ブラウザで `https://claude.ai/code` を開く → 「GitHub を接続」が出る → GitHub の画面で **承認** → 戻る → **Claude GitHub App** のインストール案内 → **自分のアカウント**を選び、さっき作ったリポ（Private）を許可（Private リポはこの App が無いと開けない。公式：code.claude.com/docs/en/web-quickstart・確認日 2026-11-22）。
   環境は Pro/Max なら「Default」が自動で用意される。設定は不要。
1. Claude アプリ → **Code** タブ → 入力欄の下の「リポジトリを選ぶ」で、そのリポを選ぶ。
2. そのリポで新しいセッションを始め、「キットを読んで始めて」と送る（キットの入れ方は 4 へ）。
- 終わると：セッションの中で `git remote -v` に github.com が出て、`git push` が通る。

### B：Codex（スマホだけの人の道・公式確認 2026-11-22）
公式には「環境の作成と公開は web かデスクトップ」「スマホは、ある環境を選んでタスクを始める」とある（learn.chatgpt.com/docs/environments/cloud-environments）。スマホだけなら、次の順で試す：
1. **既定の環境（default environment）を使う**：ChatGPT アプリ → Codex → Cloud → 環境の選択で「既定の環境」が出れば、それを選ぶ。
   公式：「スマホから始めたタスクでも、つないだ GitHub のリポを取り込める」（docs/cloud）。最初の一言は
   「**<自分のユーザー名>/<リポ名> を取り込んで、その中の AGENTS.md を読んで、始めて**」。
   ※ 前提：GitHub を Codex につないであること。つなぐ画面がアプリに出なければ 2 へ。
2. **スマホのブラウザで chatgpt.com を開く** → Codex → **Create environment** → 「Connect GitHub」を承認 → リポを選ぶ → **Publish**。
   公式の「web」にスマホのブラウザが含まれるかは明記なし（未確認）。画面が崩れる時はブラウザの「PC 版サイトを表示」を試す。
3. それでも無理なら、**その人は Claude Code（Claude アプリの Code タブ）で始める**ほうが早い（A の手順・承認2回で済む）。
- AI がやること：本人がどの道で入ったかを `state/PROGRESS.md` の記録に書く（「Codex 既定の環境」「Codex ブラウザ環境」「Claude」）。
- 環境の **Network** は作業中は切られている事がある（旧版の公式に「既定でオフ」）。このキットは取り込み不要（テンプレート方式）なので、オフのままでよい。Cloudflare の確認（タスク3の /api/health）だけは、本人がスマホのブラウザで URL を開いて見る。

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

## 4.5 慣れる練習（タスク2 の仕上げ・5分）
1. AI が `templates/app/public/index.html` の見出しを1行だけ本人の名前や店名に変えて保存（commit→push／B は PR）
2. 本人が GitHub アプリでそのファイルを開き、変わっているのを見る（B は PR を Merge してから）
3. AI が「履歴（Commits）」の見方を1画面で案内 → 本人が「いつ・何を変えたか」が見えたらタスク2 完了
※ これで「AI に頼む→保存される→自分のスマホで見える」の1往復が身につく。次のタスク3で、この同じ流れが公開 URL になる。

## 5. 決まり
- 公開されるのは `main` だけ。A は `main` に commit → push（`git branch --show-current` で確認）。B は commit → 本人が PR を merge。本人は Git を知らなくてよい。
- リポは Private。公開範囲を変える時は本人に理由を説明して同意を得る。
- 鍵・トークンは絶対に commit しない（`.gitignore` に `.env` `*.pem` がある）。

## 終わりの確かめ方
- GitHub の画面（Safari）に `AGENTS.md` と `state/` と `templates/app/` が見える → 完了（本人が見る）。
- `state/PROGRESS.md` の記録に「GitHub リポ：<URL>」を書く。
