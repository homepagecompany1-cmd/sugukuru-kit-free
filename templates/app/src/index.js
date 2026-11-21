// すぐ来るキット ひな形アプリ：Cloudflare Workers ＋ D1
// 画面：/ /apply /thanks /tokushoho /terms /privacy /admin
// API：POST /api/apply  GET /api/health  POST /api/stripe/webhook（自動提供を使う時だけ）
import { SITE, HOME, APPLY_FORM, THANKS, TOKUSHOHO, TERMS, PRIVACY, CSS } from "./pages.js";

// Stripe の支払いリンク（公開 URL なのでここに書いてよい）。本番有効化後に本番のリンクへ差し替える。
// パラメータ無しの素の buy.stripe.com リンクを入れる（申込番号は /thanks で自動で付ける）。
const STRIPE_LINK = "{{STRIPE_LINK}}";

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

function page(title, body, status = 200, extraHeaders = {}) {
  const html = `<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title><style>${CSS}</style></head><body><main>${body}</main><footer><a href="/">トップ</a><a href="/tokushoho">特定商取引法に基づく表記</a><a href="/terms">利用条件</a><a href="/privacy">プライバシー</a></footer></body></html>`;
  return new Response(html, { status, headers: { "content-type": "text/html; charset=utf-8", "x-frame-options": "DENY", "referrer-policy": "strict-origin-when-cross-origin", ...extraHeaders } });
}
const json = (o, status = 200) => new Response(JSON.stringify(o), { status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" } });

// 未置換の {{...}} が残っていないか（公開前の門。/api/health が ok:false になる）
function unreplaced() {
  const vals = [STRIPE_LINK, ...Object.values(SITE), HOME, THANKS, TOKUSHOHO, TERMS, PRIVACY];
  const hits = vals.filter((v) => typeof v === "string" && v.includes("{{"));
  return hits.length;
}

async function rateLimited(env, ip, limit = 10) {
  // 同じ IP から1時間に limit 回まで。期限切れの行はその都度掃除する
  const key = "apply:" + ip;
  const now = new Date();
  const row = await env.DB.prepare("SELECT count, reset_at FROM rate WHERE key=?").bind(key).first();
  if (!row || new Date(row.reset_at) < now) {
    const reset = new Date(now.getTime() + 3600 * 1000).toISOString();
    await env.DB.batch([
      env.DB.prepare("DELETE FROM rate WHERE reset_at < ?").bind(now.toISOString()),
      env.DB.prepare("INSERT OR REPLACE INTO rate(key,count,reset_at) VALUES(?,1,?)").bind(key, reset),
    ]);
    return false;
  }
  if (row.count >= limit) return true;
  await env.DB.prepare("UPDATE rate SET count=count+1 WHERE key=?").bind(key).run();
  return false;
}

function payLink(entryId) {
  if (!STRIPE_LINK || STRIPE_LINK.includes("{{")) return "";
  const u = new URL(STRIPE_LINK);
  if (entryId) u.searchParams.set("client_reference_id", String(entryId)); // Stripe 公式：Payment Links は client_reference_id を受け取り Checkout Session に入る
  return u.toString();
}

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    const p = url.pathname;

    if (req.method === "GET") {
      if (p === "/") return page(SITE.name, HOME);
      if (p === "/apply") return page("申し込み", APPLY_FORM);
      if (p === "/thanks") {
        const e = /^\d{1,12}$/.test(url.searchParams.get("e") || "") ? url.searchParams.get("e") : "";
        const link = payLink(e);
        const body = link
          ? THANKS.replace("{{STRIPE_LINK}}", esc(link))
          : THANKS.replace(/<p>お支払いはこちらから：<\/p>[\s\S]*?<\/a>/, "<p>お支払いの案内は準備中です。</p>");
        return page("受け付けました", body);
      }
      if (p === "/tokushoho") return page("特定商取引法に基づく表記", TOKUSHOHO);
      if (p === "/terms") return page("利用条件", TERMS);
      if (p === "/privacy") return page("プライバシーポリシー", PRIVACY);
      if (p === "/api/health") {
        const left = unreplaced();
        try { await env.DB.prepare("SELECT 1 FROM entries LIMIT 1").first(); }
        catch (e) { return json({ ok: false, db: "error", why: String(e.message || e).slice(0, 120) }, 500); }
        if (left) return json({ ok: false, db: "ok", why: `未置換の {{...}} が ${left} 箇所あります（pages.js / STRIPE_LINK）` }, 500);
        return json({ ok: true, db: "ok" });
      }
      if (p === "/admin") return admin(req, env, url);
    }

    if (req.method === "POST" && p === "/api/apply") {
      const ip = req.headers.get("cf-connecting-ip") || "0";
      const ct = req.headers.get("content-type") || "";
      if (!ct.includes("application/x-www-form-urlencoded") && !ct.includes("multipart/form-data")) return page("入力をご確認ください", "<h1>入力をご確認ください</h1><a class='btn' href='/apply'>戻る</a>", 400);
      if (Number(req.headers.get("content-length") || 0) > 20000) return page("入力をご確認ください", "<h1>入力が長すぎます</h1><a class='btn' href='/apply'>戻る</a>", 413);
      if (await rateLimited(env, ip)) return page("しばらくお待ちください", "<h1>送信が多すぎます</h1><p>1時間ほど待ってからもう一度お試しください。</p>", 429);
      const f = await req.formData();
      if (f.get("website")) return Response.redirect(url.origin + "/thanks", 303); // ボットのわな
      const name = (f.get("name") || "").toString().trim().slice(0, 60);
      const email = (f.get("email") || "").toString().trim().slice(0, 120);
      const phone = (f.get("phone") || "").toString().trim().slice(0, 20);
      const note = (f.get("note") || "").toString().trim().slice(0, 500);
      const wish1 = (f.get("wish1") || "").toString().trim().slice(0, 60);
      const wish2 = (f.get("wish2") || "").toString().trim().slice(0, 60);
      if (!name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return page("入力をご確認ください", "<h1>入力をご確認ください</h1><p>お名前とメールアドレスは必須です。</p><a class='btn' href='/apply'>戻る</a>", 400);
      // 連打・再送の二重登録：直近10分に同じメール・同じ内容があればそれを使う
      const same = await env.DB.prepare("SELECT id FROM entries WHERE email=? AND name=? AND note=? AND created_at > datetime('now','-10 minutes') ORDER BY id DESC LIMIT 1").bind(email, name, note).first();
      let id = same?.id;
      if (!id) {
        try {
          const r = await env.DB.prepare("INSERT INTO entries(kind,name,email,phone,wish1,wish2,note) VALUES('apply',?,?,?,?,?,?)").bind(name, email, phone, wish1, wish2, note).run();
          id = r.meta?.last_row_id;
        } catch (e) {
          return page("ただいま混み合っています", "<h1>保存できませんでした</h1><p>少し待ってからもう一度お試しください。</p><a class='btn' href='/apply'>戻る</a>", 503);
        }
      }
      return Response.redirect(url.origin + "/thanks?e=" + id, 303);
    }

    if (req.method === "POST" && p === "/admin/status") return adminStatus(req, env, url);

    if (req.method === "POST" && p === "/api/stripe/webhook") return stripeWebhook(req, env);

    return page("見つかりません", "<h1>ページが見つかりません</h1><a class='btn' href='/'>トップへ</a>", 404);
  },
};

// ---- 管理画面（ADMIN_KEY は Cloudflare の Secrets に本人が入れる）----
// 簡易版：鍵を URL に付ける。人に見せる画面になったら Cloudflare Access など別の認証へ。
const noStore = { "cache-control": "no-store" };
function safeEq(a, b) {
  const A = new TextEncoder().encode(String(a)), B = new TextEncoder().encode(String(b));
  if (A.length !== B.length) return false;
  let d = 0; for (let i = 0; i < A.length; i++) d |= A[i] ^ B[i];
  return d === 0;
}
function adminOk(env, url, req) {
  const k = url.searchParams.get("key") || req.headers.get("x-admin-key");
  return !!(env.ADMIN_KEY && k && safeEq(k, env.ADMIN_KEY));
}
async function admin(req, env, url) {
  if (!adminOk(env, url, req)) return page("管理", "<h1>管理</h1><p>鍵が違います。Cloudflare の Secrets に ADMIN_KEY を入れ、/admin?key=その値 で開いてください。</p>", 403, noStore);
  const q = (url.searchParams.get("q") || "").slice(0, 60);
  const onlyNew = url.searchParams.get("all") !== "1";
  const sql = `SELECT id,created_at,kind,name,email,phone,wish1,wish2,note,status,paid FROM entries WHERE (?='' OR name LIKE ? OR email LIKE ?) ${onlyNew ? "AND status='new'" : ""} ORDER BY id DESC LIMIT 200`;
  const rows = (await env.DB.prepare(sql).bind(q, `%${q}%`, `%${q}%`).all()).results || [];
  const key = url.searchParams.get("key") || "";
  const action = (extra) => "/admin/status?" + new URLSearchParams({ key, ...extra }).toString();
  const tr = rows.map((r) => `<tr><td>${r.id}</td><td>${esc(r.created_at)}</td><td>${esc(r.name)}<br><small>${esc(r.email)} ${esc(r.phone)}</small></td><td>${esc(r.wish1)} ${esc(r.wish2)}<br><small>${esc(r.note)}</small></td><td>${esc(r.status)}${r.paid ? " 💳支払済" : ""}<form method="post" action="${esc(action({}))}"><input type="hidden" name="id" value="${r.id}"><button name="status" value="done">対応済</button> <button name="status" value="cancel">取消</button></form></td></tr>`).join("");
  const nav = `<p class="small"><a href="/admin?${new URLSearchParams({ key }).toString()}">未対応だけ</a> ｜ <a href="/admin?${new URLSearchParams({ key, all: "1" }).toString()}">全部</a></p><form method="get" action="/admin"><input type="hidden" name="key" value="${esc(key)}"><input name="q" value="${esc(q)}" placeholder="名前かメールで探す"></form>`;
  return page("管理", `<h1>申込一覧（${rows.length}）</h1>${nav}<p class="small">「取消」は申込の状態だけを変えます。返金は Stripe の画面から。</p><table class="tbl"><tr><th>#</th><th>日時(UTC)</th><th>名前</th><th>内容</th><th>状態</th></tr>${tr}</table>`, 200, noStore);
}
async function adminStatus(req, env, url) {
  if (!adminOk(env, url, req)) return json({ ok: false }, 403);
  const origin = req.headers.get("origin") || "";
  if (origin && origin !== url.origin) return json({ ok: false, why: "origin" }, 403);
  const f = await req.formData();
  const id = Number(f.get("id")); const st = String(f.get("status"));
  if (!id || !["new", "done", "cancel"].includes(st)) return json({ ok: false }, 400);
  await env.DB.prepare("UPDATE entries SET status=? WHERE id=?").bind(st, id).run();
  return Response.redirect(url.origin + "/admin?" + new URLSearchParams({ key: url.searchParams.get("key") || "" }).toString(), 303);
}

// ---- Stripe Webhook（自動提供を使う時だけ。STRIPE_WEBHOOK_SECRET は Cloudflare の Secrets に本人が入れる）----
// Stripe 公式：署名は Stripe-Signature の t と v1（複数ある事がある）。`${t}.${body}` の HMAC-SHA256 と定数時間で比べる。
async function stripeWebhook(req, env) {
  if (!env.STRIPE_WEBHOOK_SECRET) return json({ ok: false, why: "webhook not enabled" }, 404);
  const sig = req.headers.get("stripe-signature") || "";
  const body = await req.text();
  let t = ""; const v1s = [];
  for (const kv of sig.split(",")) { const i = kv.indexOf("="); if (i < 0) continue; const k = kv.slice(0, i).trim(), v = kv.slice(i + 1).trim(); if (k === "t") t = v; if (k === "v1") v1s.push(v); }
  if (!t || !v1s.length) return json({ ok: false }, 400);
  if (Math.abs(Date.now() / 1000 - Number(t)) > 300) return json({ ok: false, why: "stale" }, 400);
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(env.STRIPE_WEBHOOK_SECRET), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const mac = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`${t}.${body}`));
  const hex = [...new Uint8Array(mac)].map((b) => b.toString(16).padStart(2, "0")).join("");
  if (!v1s.some((v) => safeEq(hex, v))) return json({ ok: false, why: "bad signature" }, 400);
  const ev = JSON.parse(body);
  const dup = await env.DB.prepare("SELECT id FROM stripe_events WHERE id=?").bind(ev.id).first();
  if (dup) return json({ ok: true, dup: true });
  try {
    if (ev.type === "checkout.session.completed" || ev.type === "checkout.session.async_payment_succeeded") {
      const s = ev.data.object;
      if (s.payment_status === "paid") {
        const ref = /^\d{1,12}$/.test(s.client_reference_id || "") ? Number(s.client_reference_id) : 0;
        if (ref) await env.DB.prepare("UPDATE entries SET paid=1, stripe_session=? WHERE id=?").bind(s.id, ref).run();
        else {
          const email = s.customer_details?.email || s.customer_email || "";
          if (email) await env.DB.prepare("UPDATE entries SET paid=1, stripe_session=? WHERE id=(SELECT id FROM entries WHERE email=? AND paid=0 ORDER BY id DESC LIMIT 1)").bind(s.id, email).run();
        }
      }
    }
    if (ev.type === "charge.refunded") {
      const pi = ev.data.object.payment_intent || "";
      if (pi) await env.DB.prepare("UPDATE entries SET status='cancel' WHERE stripe_session IN (SELECT stripe_session FROM entries WHERE stripe_session=?)").bind(pi).run(); // 一致しない時は何もしない（手動で確認）
    }
    // 処理が通ってから記録する（途中で失敗したら 500 を返し、Stripe に再送してもらう）
    await env.DB.prepare("INSERT INTO stripe_events(id) VALUES(?)").bind(ev.id).run();
  } catch (e) {
    return json({ ok: false, why: "db" }, 500);
  }
  return json({ ok: true });
}
