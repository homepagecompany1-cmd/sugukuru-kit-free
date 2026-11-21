# 91 スマホの画面つき手順（Codex／ChatGPT アプリ）— 困った時はここ

本人がスクショを貼ってきたら、AI は下の表で「どの画面か」を当て、**押す場所を1つだけ**答える。
画像は `images/codex/`（**まだ無い**。提供者が実機で撮って足す。無い間は文字の表で案内する）。

公式（learn.chatgpt.com/docs/mobile・/docs/cloud・2026-11-20 確認）：
- スマホの Codex は「クラウド」か「つないだ Mac/Windows」で動く。
- **クラウド環境の作成と公開は PC かブラウザ（chatgpt.com）で先にやる**必要がある。スマホだけの人は Safari で `chatgpt.com/codex` を開いて環境を作る。
- 変更は Codex の画面で **commit か PR** を本人が押す（AI が自動で `git push` する前提にしない）。

| # | 画像 | この画面は | 押す所 | 次に見える物 |
|---|---|---|---|---|
| 01 | （未） | ChatGPT アプリの左メニュー | **Codex** | タスク一覧 |
| 02 | （未） | 新しいタスク（環境の選択） | 環境を選ぶ（無ければ 03 へ） | 入力欄 |
| 03 | （未） | Safari で `chatgpt.com/codex` → 環境 | **Create environment** → GitHub を接続 → リポを選ぶ | 環境の設定 |
| 04 | （未） | 環境の設定 | **Internet access** を ON にして、許可ドメインにキットの配布先と `*.workers.dev` を足す → 保存 | 02 に戻る |
| 05 | （未） | 最初の一言を貼った状態 | 送信 | AI が「B（Codex）で進めます」と名乗る |
| 06 | （未） | 変更ができた画面 | **Create PR**（または commit） | GitHub に PR |
| 07 | （未） | GitHub の PR 画面（Safari） | **Merge pull request** → **Confirm** | main が更新され Cloudflare がビルド |

## 入れるドメイン（1行1つ）
```
raw.githubusercontent.com
*.workers.dev
```

## 最初の一言（そのまま貼る）
```
このキットを読んで始めて： https://github.com/homepagecompany1-cmd/sugukuru-kit-free
```

## よくある詰まり
| 見えた物 | 答え |
|---|---|
| Codex がメニューに無い | プランに Codex が含まれていない。公式の対応プランを確認 |
| 環境が選べない | 環境を PC かブラウザで先に作って公開する（03） |
| 外部に通信できない | 04 の Internet access が OFF か、ドメインが無い |
| 変更が本番に出ない | PR を merge していない（07）。merge 後に Cloudflare がビルド |
| スクショの画面が表に無い | 画面の題名を聞き、決め打ちしない |

## 画像の足し方（提供者）
`images/codex/NN_名前.png` に置き、上の表の「（未）」を差し替える。人の名前・メール・題は塗る（`tools/mosaic.py`）。
