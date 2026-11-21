# 95 PC がある人の進め方（AI が画面を見て進め、本人は承認だけ）

本人が **自分の PC** を持っていれば、スマホより速い。AI が本人の PC のブラウザを動かし、本人は「ログイン・2段階認証・本人確認・規約同意・承認ボタン」だけ押す。
**本人の PC・本人のアカウント・本人の AI** で動かす。提供者の PC では動かさない（キットの決まり）。

## 入口（タスク1「環境の確認」で最初に聞く）
AI：「PC（Mac か Windows）はありますか？ ある→この手順書。ない→スマホの手順（90／91）」

## PC の条件（公式・2026-11-20 確認）
| | A：Claude | B：Codex |
|---|---|---|
| アプリ | Claude Desktop | ChatGPT デスクトップアプリ（Codex 内蔵） |
| Mac | 画面操作（computer use）は **macOS 14 以上**（公式） | 公式に最低版の記載なし。最新の macOS を推奨 |
| Windows | 対応（公式）。細かい版の記載は見つからず→最新の Windows 10/11 で試す | Windows 11 推奨（10 は 1809 以上で動く範囲） |
| メモリ | 公式の記載なし。目安 8GB 以上 | 記載なし。目安 8GB 以上 |
| プラン | 画面操作は **Pro / Max / Ultra**（Team・Enterprise は現時点で不可） | ChatGPT の有料プラン（Codex が使える物） |
| ブラウザ | Chrome（Claude in Chrome 拡張） | 不要（Computer Use が画面を見る） |
| 権限 | 拡張を入れる・画面操作を Settings で ON | Mac：画面収録・アクセシビリティを許可 |

出典：[Install Claude Desktop](https://support.claude.com/en/articles/10065433-install-claude-desktop)／[Let Claude use your computer](https://support.claude.com/en/articles/14128542-let-claude-use-your-computer-in-cowork)／[Claude in Chrome](https://support.claude.com/en/articles/12012173-get-started-with-claude-in-chrome)／[Codex app](https://learn.chatgpt.com/docs/app)／[Codex Computer Use](https://learn.chatgpt.com/docs/app/computer-use)／[Codex Windows](https://learn.chatgpt.com/docs/windows)

古い PC でも、ブラウザが動けば **スマホの手順をそのまま PC のブラウザで**やれば良い（速さはスマホと同じ）。

## 流れ（A：Claude）
1. 本人：Claude Desktop を入れて自分の Claude でログイン → Chrome に Claude in Chrome を入れる。
2. 本人：PC に git を入れ、GitHub にログインしてリポを clone（AI が手順を1つずつ言う）。Claude Desktop の **Code** でそのフォルダを開き「このキットを読んで始めて」を貼る。Chrome の操作も同じセッションから頼む（Claude in Chrome が入っていれば使える。使えない時は本人が Chrome を操作し、AI は画面を見て案内）。
3. AI：名乗る → 進捗を読む → タスクの順は同じ。**違いは「本人がやる事」の所で、AI が Chrome を開いて画面を進める**。
4. 本人がやる所だけ止まる：ログイン・2段階認証・本人確認の写真・規約の同意・「Deploy」「Save」など最後のボタン。AI は「ここを押してください」と言って待つ。D1 の作成や SQL の貼り付けも、PC では AI が画面を進めてよい（押す前に本人に見せる）。
5. 鍵・パスワード・ワンタイムコードは本人が打つ。AI は入力欄に触らず、**本人が打つ間は画面の取得を止める**。打ち終わって画面を閉じてから再開。

## 流れ（B：Codex）
1. 本人：**ChatGPT デスクトップアプリ**（chatgpt.com からダウンロード。Codex はこのアプリの中の「Codex」タブ）を入れて自分のアカウントでログイン → Computer Use を ON（Mac は画面収録・アクセシビリティの許可）。
2. 本人：Codex でこのリポを開き「このキットを読んで始めて」を貼る。
3〜5 は A と同じ。Windows は操作中のウィンドウを前に出したままにする。

## やってはいけない
- 提供者の PC に本人のアカウントでログインさせる／提供者が本人のアカウントで操作する。
- AI がパスワード・コード・カード番号・口座を入力する。
- 本人が見ていない間に決済や削除のボタンを押す。

## スマホと PC の両方がある時
PC で進め、2段階認証の SMS はスマホで受ける。進捗は同じリポなので、途中でスマホに切り替えても続きからできる。
