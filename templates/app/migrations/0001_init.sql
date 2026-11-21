-- 申込（予約・待ちリストも同じ表で扱う）
CREATE TABLE IF NOT EXISTS entries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  kind TEXT NOT NULL DEFAULT 'apply',   -- apply / reserve / waitlist
  name TEXT,
  email TEXT,
  phone TEXT,
  wish1 TEXT,                           -- 希望日時1（予約の時）
  wish2 TEXT,                           -- 希望日時2
  note TEXT,
  status TEXT NOT NULL DEFAULT 'new',   -- new / done / cancel
  paid INTEGER NOT NULL DEFAULT 0,      -- 自動提供（Webhook）を使う時だけ 1 になる
  stripe_session TEXT
);
CREATE INDEX IF NOT EXISTS idx_entries_created ON entries(created_at);

-- Stripe の通知を二重に処理しないための記録（自動提供を使う時だけ）
CREATE TABLE IF NOT EXISTS stripe_events (
  id TEXT PRIMARY KEY,
  received_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 送信回数の制限（同じ IP から1時間に何回か）
CREATE TABLE IF NOT EXISTS rate (
  key TEXT PRIMARY KEY,
  count INTEGER NOT NULL DEFAULT 0,
  reset_at TEXT NOT NULL
);
