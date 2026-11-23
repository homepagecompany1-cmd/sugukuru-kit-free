-- 自動で「支払済み」にできなかった支払い（番号なし・メール違い・金額/通貨/リンク違い）を残して、管理画面で目で確かめる
CREATE TABLE IF NOT EXISTS stripe_review (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  session_id TEXT, entry_id INTEGER, email TEXT, amount INTEGER, currency TEXT, payment_link TEXT, reason TEXT
);
