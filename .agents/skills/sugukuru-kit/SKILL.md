---
name: sugukuru-kit
description: スマホ1台（PC なし）の初心者が、自分の Claude Code または Codex で Web アプリを作り、Cloudflare の無料ドメインに公開し、Stripe の支払いリンクを置ける所まで進める案内役。「キットを読んで始めて」「続きから」「残りのタスク」「アプリを作りたい」「公開したい」「Stripe をつなぎたい」と言われたら使う。鍵・本人確認・規約同意は本人が入れる。
---

# すぐ来るキット（案内役）

入口は `AGENTS.md`（リポ直下。このスキルはリポに同梱して使う前提）。ここでは「どの手順書をいつ読むか」と「進捗の付け方」だけ。

## 動き方
1. 名乗る（A：Claude Code／B：Codex）。
2. `state/PROGRESS.md` を読み、残りを表で出す（列：#・タスク・状態・本人がやる事・AI がやる事）。
3. 上から1つだけ進める。本人がやる操作は**1画面1操作**で、「どの画面」「何を押す」「終わると何が見える」の3つを必ず言う。
4. 終わりを確かめる（下の表）。確かめたら `state/PROGRESS.md` を更新し commit → push。
5. 次のタスクへ。1回の返事で2つ以上のタスクを進めない。

## 各タスクの「終わりの確かめ方」
| タスク | 確かめ方 | 誰が |
|---|---|---|
| 環境の確認 | どこで動くか（クラウド／ローカル）を記録・リポが開けている・保存が通る（A：push／B：commit→本人が PR を merge） | AI |
| 商品を決める | `state/PRODUCT.md` に「誰に・何を・いくらで・渡す物」が書けている | 本人＋AI |
| GitHub | リポにこのキットが入り、`main` に反映されている | AI＋本人 |
| D1（先） | `wrangler.toml` の database_id が本物に置き換わり、SQL が投入済み | AI＋本人 |
| Cloudflare 連携（後） | ビルドが成功し、`https://<名前>.<account>.workers.dev/` が 200・`/api/health` が `{"ok":true}` | 本人が画面で／AI が curl |
| 販売条件ページ | `/tokushoho` と `/terms` が公開 URL で開け、本人の情報が入っている | 本人が目で |
| Stripe | 本番の支払いリンクを置けた（`本人操作待ち`→通し確認でテスト環境の決済が通ったら `完了`） | 本人 |
| 提供 | 買った人に渡す物が、手動なら手順、自動なら動作で確認済み | 本人＋AI |
| 通し確認 | 表示→申込→保存→決済→提供→取消 が本番で1回通った | 本人 |

## 読む手順書（必要な時だけ）
- 準備と環境：[references/00_junbi.md](../../../references/00_junbi.md)
- 商品とアプリの選び方：[references/80_app_erabu.md](../../../references/80_app_erabu.md)
- GitHub：[references/10_github.md](../../../references/10_github.md)
- Cloudflare：[references/20_cloudflare.md](../../../references/20_cloudflare.md)
- Stripe：[references/30_stripe.md](../../../references/30_stripe.md)
- 販売条件（特商法・返金・問い合わせ）：[references/40_hanbai_joken.md](../../../references/40_hanbai_joken.md)
- 購入後の提供と通し確認：[references/50_teikyo.md](../../../references/50_teikyo.md)
- 再開・復旧：[references/60_saikai.md](../../../references/60_saikai.md)
- エラー表：[references/70_error.md](../../../references/70_error.md)
- スマホの画面つき手順（スクショを貼られたらここ）：Claude [references/90_smaho_claude.md](../../../references/90_smaho_claude.md)／Codex [references/91_smaho_codex.md](../../../references/91_smaho_codex.md)
- 会話の台本（本人の一言→AI の返し）：[references/92_kaiwa_script.md](../../../references/92_kaiwa_script.md)
- 早い道（本人は鍵を貼るだけ・承認4回・検証中）：[references/25_hayamichi.md](../../../references/25_hayamichi.md)
- PC がある人（AI が画面を進め本人は承認だけ・PC の条件）：[references/95_pc_route.md](../../../references/95_pc_route.md)
- ひな形アプリ：[templates/app/README.md](../../../templates/app/README.md)

## 言ってはいけない事
- 「必ず売れる／稼げる／保証」。到達点は「公開して支払いリンクを置ける」まで。
- 鍵の値を聞く・表示する・ファイルに書く。
- 本人の代わりに規約へ同意する・本人確認をする。

## 進捗の書き方（state/PROGRESS.md）
- 状態は `未着手 / AI作業中 / 本人操作待ち / 審査待ち / 失敗 / 完了 / 対象外` のどれか。
- 「失敗」には理由と次の一手を1行で。
- 鍵・ID 以外の事実（公開 URL・ブランチ名・Worker 名・最後に確かめた日）は `state/PROGRESS.md` の下の「記録」に残す。
