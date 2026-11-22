# 00 準備と環境の確認（タスク1）

> スマホだけの人へ：**Claude Code（Claude アプリの Code タブ）のほうが手数が少ない**（GitHub の承認2回で始められる）。Codex は環境の作成・公開を PC かブラウザで1回やる必要がある。AI は本人がどちらを使っているかに合わせて案内し、乗り換えは勧めない。

## 本人に最初に聞く3つ
1. 持っている AI は **Claude（Pro/Max/Ultra/Team）** か **ChatGPT（Codex が使えるプラン）** か。
0. **PC（Mac/Windows）はあるか**。ある→ `95_pc_route.md`（速い）。ない→スマホの手順。
2. スマホは iPhone か Android か（画面の名前が少し違う）。
3. 使えるメールアドレスと電話番号があるか（3つのサービスの登録と本人確認に要る）。

## どこで動いているか（AI が実測）
- A（Claude Code）：`echo $CLAUDE_CODE_REMOTE` が `true` ならクラウド、空ならローカル PC（公式の環境変数）。どちらでも `git remote -v` に github.com が出ること。
- B（Codex）：Codex のクラウドタスクで動いていれば、作業場に GitHub からのチェックアウトがある。`git remote -v` で確認。
- **保存の仕方を決める**（記録に書く）：
  - A：`git push origin main` が通るか試す（通らないなら 10_github.md の接続へ）。
  - B：push はしない。commit → 本人が Codex の画面で **PR を作る→GitHub で merge**。
  - ローカル PC：git と GitHub のログイン（`gh auth login` か Git の認証）を本人が入れる。

## 必要なもの（お金）
- Claude または ChatGPT の契約（本人がすでに持っている物）。追加の固定費は **0 円**（無料枠の範囲）。
- Cloudflare：無料プラン（Workers 1日 10 万リクエスト・D1 1日 読み 500 万行／書き 10 万行・保存 5GB。2026-11 時点の公式）。
- Stripe：月額なし。売れた時の決済手数料のみ（返金しても手数料は戻らない）。
- 独自ドメインは**要らない**（`◯◯.workers.dev` を使う）。

## スマホでの約束ごと
- 登録・ログインは **普通のブラウザ（Safari／Chrome）**で。アプリ内ブラウザ（LINE や Instagram の中）で開くとログインが戻らない事がある。
- 認証アプリ（2段階認証）や SMS のコードは本人が入れる。AI は聞かない。
- 鍵（API トークン・制限付きキー）を貼る場所は Claude の環境の Network secrets（Safari で claude.ai/code）か各サービスの画面だけ。会話には貼らない（25）。
- 「あとで」と言われたら、どこまで進んだかを `state/PROGRESS.md` に書いて commit → push。

## 本人の「持ち物」チェック（AI が表で聞く）
| 物 | 要る場面 |
|---|---|
| メールアドレス | GitHub・Cloudflare・Stripe |
| 電話番号（SMS）または認証アプリ | GitHub の2段階認証・Stripe（制限付きキーの作成に 2段階認証が必須・公式） |
| 本人確認書類（運転免許証など） | Stripe の本人確認 |
| 銀行口座（本人名義） | Stripe の入金先 |
| 事業の名称・住所・連絡先 | 販売条件ページ（特商法） |

## 終わりの確かめ方
- リポが開けていて、A は `git push origin main` が通った／B は commit できて本人が PR を merge できた／ローカルは push が通った → タスク1 を `完了`。
- 通らない → `本人操作待ち`（10_github.md の接続手順へ）。
- GitHub の登録がまだの人：先に 10_github.md の 1・2（登録・リポ作成）をやってから戻る。
