# すぐ来るキット

> ## AIエージェントへ（本人からこの URL を渡された時は、ここから始めてください）
> 1. 本人に聞く：「GitHub に空のリポ（Private・README あり）を作って、そのリポを Claude の Code タブ（または Codex）で開いていますか？」
>    まだなら、`references/10_github.md` を読んで、画面の操作を1つずつ案内する（本人のアカウントは操作しない）。
> 2. 開けていたら、そのリポの中で次を実行して、キットを取り込む：
>    `curl -fsSL https://raw.githubusercontent.com/homepagecompany1-cmd/sugukuru-kit-free/main/tools/fetch_kit.sh -o /tmp/fetch_kit.sh && cat /tmp/fetch_kit.sh && bash /tmp/fetch_kit.sh https://github.com/homepagecompany1-cmd/sugukuru-kit-free`
> 3. 取り込んだ `AGENTS.md` を読み、その指示どおり、`state/PROGRESS.md` の残りを表で出して、1つずつ進める。
> 4. 鍵・パスワード・本人確認・規約への同意は、本人が自分で入れる。AI は入力しない。


スマホ1台で、自分の Claude Code か Codex に読ませて、Web アプリを作って公開し、支払いリンクを置く所まで進めるキット。

## 使い方（本人）
0. PC があるなら `references/95_pc_route.md`（速い）。無ければ次へ。PC が無くても速い道 `references/25_hayamichi.md`（本人は鍵を貼るだけ・検証中）。
1. GitHub でリポを作る（Private・README あり）。
2. Claude アプリの **Code** タブ（または Codex のクラウド）でそのリポを開く。
3. 最初の一言：**「このキットを読んで始めて： https://github.com/homepagecompany1-cmd/sugukuru-kit-free」**
4. あとは AI が「残りのタスク」を表で出し、1つずつ案内します。鍵・本人確認・規約同意は自分で入れます。

## 中身
- `AGENTS.md`：入口（Claude と Codex のどちらでも読む）
- `.claude/skills/` `.agents/skills/`：案内役スキル（同じ中身）
- `references/`：手順書（準備・GitHub・Cloudflare・Stripe・販売条件・提供・再開・エラー・商品の決め方）
- `templates/app/`：ひな形アプリ（Cloudflare Workers ＋ D1）
- `state/`：進捗・商品・運用の記録（AI が更新）
- `tools/fetch_kit.sh`：取り込みの道具
- `CLAUDE.md`：`AGENTS.md` を読ませる1行（Claude 用）
- `LICENSE.md`：利用条件
