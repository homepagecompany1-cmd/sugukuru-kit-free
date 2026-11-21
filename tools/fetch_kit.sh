#!/usr/bin/env bash
# キットの配布 URL から全ファイルを今のフォルダに取り込む。
# 使い方: bash fetch_kit.sh <配布URL> [--force]
#   配布URL は末尾に /index.json が付いていてもよい（取り除く）。
#   既にあるファイルは上書きしない（進捗や本人の設定を守る）。全部入れ直す時だけ --force。
set -euo pipefail
BASE="${1:?配布URLを指定}"
FORCE="${2:-}"
BASE="${BASE%/}"; BASE="${BASE%/index.json}"; BASE="${BASE%/}"
# GitHub のページ URL（https://github.com/OWNER/REPO）なら、ファイルを取れる raw の URL に直す
case "$BASE" in
  https://github.com/*/*) BASE="https://raw.githubusercontent.com/${BASE#https://github.com/}"; BASE="${BASE%.git}"; BASE="${BASE%/}/main";;
esac
command -v curl >/dev/null || { echo "curl がありません"; exit 1; }
IDX="$(curl -fsSL "$BASE/index.json")"
new=0; kept=0
while IFS= read -r f; do
  case "$f" in ""|*..*|/*) continue;; esac
  if [ -e "$f" ] && [ "$FORCE" != "--force" ]; then kept=$((kept+1)); continue; fi
  mkdir -p "$(dirname "$f")"
  curl -fsSL "$BASE/$f" -o "$f"
  new=$((new+1))
done < <(printf '%s' "$IDX" | grep -o '"path": *"[^"]*"' | sed 's/"path": *"\(.*\)"/\1/')
echo "取り込み: 新規 $new・既存のまま $kept"
echo "次: git add -A && git commit -m 'すぐ来るキットを取り込み' && git push（Codex は画面で commit/PR）"
