# 25 早い道：本人は「貼る」だけ、AI が Cloudflare と Stripe を組む（Network secrets 型）

**状態：検証中（2026-11-20）。** 提供者がスマホだけで1回通して ✅ になるまで、本人には勧めない。
それまでは 20（画面で連携）・30（画面でリンク作成）の道を使う。

## 仕組み（公式・2026-11-20 確認）
- Claude のクラウド環境には **Network secrets** がある。本人が鍵を環境に貼ると、Anthropic の代理（agent proxy）が
  指定したホスト（例 `api.cloudflare.com`）への通信にだけ `Authorization: Bearer <鍵>` を付ける。**AI は鍵の値を見られない**。
- 値は保存後に再表示できない。直す時は「削除→追加し直し」。
- 「環境変数」は環境を使う全員が読める → 鍵を入れない。
- Codex にも同型の **HTTP secrets** がある（B はこの手順書の Codex 版が要る・未作成）。
- **大事**：見えない＝何もできない、ではない。AI は鍵を「使う」事はできる。だから **権限を最小**にし、**削除・本番切替は本人承認**にする（下の決まり）。

出典：[Cloud environments（Network secrets）](https://code.claude.com/docs/en/cloud-environments)／[Codex HTTP secrets](https://learn.chatgpt.com/docs/environments/cloud-environments)／[Cloudflare API token 作成](https://developers.cloudflare.com/fundamentals/api/get-started/create-token/)／[権限一覧](https://developers.cloudflare.com/fundamentals/api/reference/permissions/)／[トークンの Roll](https://developers.cloudflare.com/fundamentals/api/how-to/roll-token/)／[Stripe 制限付きキー](https://docs.stripe.com/keys/restricted-api-keys)／[Stripe Webhook 作成](https://docs.stripe.com/api/webhook_endpoints/create)／[Stripe 禁止業種](https://stripe.com/legal/restricted-businesses)

## 本人が触るのは4回
| 回 | 本人がやる | AI がやる |
|---|---|---|
| 1 | Cloudflare で API トークンを作る → Claude 環境の Network secrets に貼る（host `api.cloudflare.com`） | トークンの疎通を確かめ、Workers 公開・D1 作成・ID 差し替え・スキーマ投入・/api/health |
| 2 | Stripe の**テスト用**制限付きキー（画面に「エージェント用」の選択があればそれ・要確認）を作る → 貼る（host `api.stripe.com`） | 商品・価格・支払いリンクを API で作りページに差し込む。作った ID を進捗に記録 |
| 3 | Stripe の画面で Webhook を作り、署名秘密（whsec_）を Cloudflare の Worker の「Secrets」に本人が貼る（AI は URL と選ぶイベントを言う） | /api/health と管理画面で受信を確認 |
| 4 | テスト購入（4242）→ OK なら **テスト鍵を削除してから**本番鍵を貼る | 本番のリンクを作り直して差し込む。本番表示（livemode）をページに出す |

本人確認（KYC）・口座・2段階認証は Stripe の中で本人のみ。鍵の作成には Stripe の 2段階認証が要る（公式）→ 00 の持ち物に入れる。

## 画面の場所（スマホ）
- Network secrets は **Safari で `claude.ai/code`** を開く → 環境 → 編集 → 「Network secrets」行 → 「Add secret」。アプリの Code タブからは編集できない（公式は claude.ai/code と記載）。
- 入れる物：Allowed websites にホスト名1つ、Custom headers は既定（`Authorization` / `Bearer`）のまま、**Value 欄にだけ**鍵を貼る。Prefix 欄は触らない。前後の空白を入れない。
- 貼り間違えたら「削除→追加し直し」。

## 鍵の作り方（本人・権限は最小）
**Cloudflare**：My Profile → API Tokens → Create Token → 「Edit Cloudflare Workers」テンプレートを選ぶ → 権限に **D1：Edit** を足す → Account は自分のアカウントだけ → **有効期限を伴走期間＋2週間**（例 45日）→ 作成 → 値は1回しか出ない。
（テンプレートの中身と、`d1 create`／`secret put` に要る最小権限名は公式に一覧が無い。足りなければ AI が「この権限を足してください」と1つずつ言う）

**Stripe（まずテスト）**：開発者 → API キー → 「制限付きキーを作成」→ **書き込み**：Products・Prices・Payment Links・（Webhook Endpoints は本人が画面で作るなら不要）／**なし**：Refunds・Customers・Charges・Payouts・Balance ほか全部 → 作成。本番用は同じ権限で `rk_live_` を後から。
権限名の正式表記は画面の表記に従う（公式ドキュメントに一覧は無い）。

## AI の決まり（25 を使う時）
1. 鍵の値を**環境変数・ファイル・ログ・コミット・会話に書かない**。認証が通らなければ**止まって本人に聞く**（鍵を自分で置き直そうとしない）。
2. 代理経由の通信は **REST（curl/fetch）を基本**にする。wrangler が通るかは検証中。通らない時は REST に切替え、進捗に理由を書く。
3. 最初に疎通確認：Cloudflare `GET /client/v4/user/tokens/verify`、Stripe `GET /v1/balance` 相当の読み取りだけ。結果を日本語で本人に。
4. **削除系・本番鍵への切替・返金・価格の変更**は、やる前に本人に内容を見せて OK を取る。
5. 作った物の ID（Worker 名・D1 名と ID・product・price・payment link・webhook）を `state/PROGRESS.md` の台帳に記録。作り直しは「新規作成」でなく「既存を無効化（active=false）→再作成」。消さない。
6. テスト鍵と本番鍵を同時に貼らない。切替は「テスト鍵を削除→本番鍵を追加」の順。ページに livemode を表示。
7. 環境は**本人専用**。共有環境や他人を招いた環境に鍵を置かない（環境の全セッションで鍵が使える・公式）。
8. スクショに鍵の値が写っていたら「今すぐ Roll（作り直し）」と言い、画像は使わない。

## 終わる時・漏れた時（本人・3つ）
1. Claude の環境 → Network secrets → 該当の鍵を削除
2. Cloudflare → API Tokens → 該当トークンを **Roll**（旧トークンは無効）か削除
3. Stripe → API キー → 制限付きキーを失効（ロール時は旧キーを最長7日残せる）
※ 環境をアーカイブしても実行中のセッションには鍵が残る（公式）→ 先に鍵を削除。

## 戻し方
- Worker：git で前の版に戻して push（20 の 6）。
- Stripe：支払いリンクは無効化（active=false）。Price は削除不可→archive。
- D1：Time Travel（無料は7日）。

## まだ確かめていない事（提供者が実機で）
- wrangler が代理の Bearer 付与と両立するか（wrangler は自分で Authorization を付ける）。
- iPhone の Safari で Network secrets の画面まで行けるか（画面を撮って 90 に足す）。
- 「Edit Cloudflare Workers」テンプレート＋D1 Edit で `d1 create`・`migrations apply`・`secret put` が通るか。
- Stripe の本番制限付きキーが、本人確認の途中でも作れるか。
- 所要時間の実測（本人の手の分と、待ちの分を分けて）。
