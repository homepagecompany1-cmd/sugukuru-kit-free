// 文面はここだけ直せばよい。{{...}} は本人の情報に置き換える（AI がやる）。
// 「必ず」「絶対」「No.1」「通常◯円→」は書かない（景品表示法）。

export const SITE = {
  name: "{{サイト名}}",
  tagline: "{{ひとこと（何を誰に）}}",
  seller: "{{販売事業者名}}",
  manager: "{{運営統括責任者（氏名）}}",
  address: "{{所在地（個人事業主で非公開にする時は「請求があれば遅滞なく開示します」）}}",
  email: "{{連絡先メール}}",
  phone: "{{電話番号（個人事業主で非公開にする時は「請求があれば遅滞なく開示します」）}}",
  price: "{{価格（税込）}}",
  delivery: "{{引き渡し時期（例：決済後3日以内にメールで）}}",
  refund: "{{返品・キャンセルの条件}}",
  env: "スマホ・PC のブラウザ",
};

export const HOME = `
<h1>${SITE.name}</h1>
<p class="lead">${SITE.tagline}</p>
<section class="card">
  <h2>内容</h2>
  <p>{{商品の説明（3行まで・事実だけ）}}</p>
  <p class="price">${SITE.price}</p>
  <a class="btn" href="/apply">申し込む</a>
</section>
`;

export const APPLY_FORM = `
<h1>申し込み</h1>
<form method="post" action="/api/apply" class="card">
  <label>お名前<input name="name" required maxlength="60"></label>
  <label>メール<input name="email" type="email" required maxlength="120"></label>
  <label>電話（任意）<input name="phone" maxlength="20"></label>
  <label>ご希望・メモ（任意）<textarea name="note" maxlength="500"></textarea></label>
  <input type="text" name="website" class="hp" tabindex="-1" autocomplete="off">
  <button type="submit" class="btn">送信する</button>
  <p class="small">送信すると <a href="/privacy">プライバシーポリシー</a> と <a href="/terms">利用条件</a> に同意したことになります。</p>
</form>
`;

export const THANKS = `
<h1>受け付けました</h1>
<p>{{受付後の案内（例：3日以内にメールでご連絡します）}}</p>
<p>お支払いはこちらから：</p>
<a class="btn" href="{{STRIPE_LINK}}">お支払いへ進む</a>
<p class="small"><a href="/tokushoho">特定商取引法に基づく表記</a></p>
`;

export const TOKUSHOHO = `
<h1>特定商取引法に基づく表記</h1>
<table class="tbl">
<tr><th>販売事業者</th><td>${SITE.seller}</td></tr>
<tr><th>運営統括責任者</th><td>${SITE.manager}</td></tr>
<tr><th>所在地</th><td>${SITE.address}</td></tr>
<tr><th>連絡先</th><td>メール：${SITE.email}<br>電話：${SITE.phone}</td></tr>
<tr><th>販売価格</th><td>${SITE.price}（各ページに税込で表示）</td></tr>
<tr><th>商品代金以外の必要料金</th><td>なし（通信費はお客様負担）</td></tr>
<tr><th>支払方法・支払時期</th><td>クレジットカード等（Stripe）・お申し込み時</td></tr>
<tr><th>引き渡し時期</th><td>${SITE.delivery}</td></tr>
<tr><th>返品・キャンセル</th><td>${SITE.refund}</td></tr>
<tr><th>動作環境</th><td>${SITE.env}</td></tr>
</table>
`;

export const TERMS = `
<h1>利用条件</h1>
<p>本サービスは ${SITE.seller} が提供します。</p>
<ol>
<li>提供する物：{{提供する物を1〜2行で}}</li>
<li>提供しない物：{{やらない事（例：成果の保証・法律相談）}}</li>
<li>お支払い後の取消・返金：${SITE.refund}</li>
<li>免責：当方の故意または重大な過失による場合を除き、当方の責任はお支払いいただいた代金の額を上限とします。</li>
<li>準拠法・裁判所：日本法。{{所在地の都道府県}}の裁判所を第一審の専属的合意管轄裁判所とします。</li>
</ol>
`;

export const PRIVACY = `
<h1>プライバシーポリシー</h1>
<ul>
<li>集める情報：お名前・メールアドレス・電話番号（任意）・ご記入内容。送信回数の制限のため IP アドレスを1時間だけ保持します。</li>
<li>目的：お申し込みへの連絡・提供・お支払いの確認。</li>
<li>保存期間：提供完了から1年。削除をご希望の場合は ${SITE.email} までご連絡ください。</li>
<li>第三者提供：法令に基づく場合を除き行いません。決済は Stripe が処理し、カード情報は当方に届きません。</li>
<li>保管場所：Cloudflare, Inc.（米国法人）のデータベースに保管します（保存地域は作成時の設定によります）。Cloudflare のデータ処理契約（DPA）に基づく保護措置を確認しています。</li>
<li>外国にある第三者への提供（個人情報保護法28条）：決済処理を Stripe Japan, Inc.／Stripe, LLC（米国）に委託し、お名前・メールアドレス・決済情報が米国に移転されます。米国の個人情報保護制度は個人情報保護委員会の公表資料（https://www.ppc.go.jp/personalinfo/legal/kaiseihogohou/#gaikoku ）をご参照ください。Stripe は PCI DSS レベル1、暗号化、アクセス制御等の措置を講じ、当方と DPA を締結しています。お申し込みの送信をもって、外国にある第三者への提供に同意いただいたものとします。</li>
</ul>
`;

export const CSS = `
*{box-sizing:border-box}body{margin:0;font-family:-apple-system,"Hiragino Sans","Noto Sans JP",sans-serif;background:#faf8f4;color:#222;line-height:1.7}
main{max-width:640px;margin:0 auto;padding:20px 16px 60px}h1{font-size:1.5rem;margin:.4em 0}h2{font-size:1.1rem}
.lead{font-size:1.05rem;color:#444}.card{background:#fff;border:1px solid #e6e1d8;border-radius:14px;padding:18px;margin:16px 0}
.price{font-size:1.3rem;font-weight:700;color:#b5500a}.btn{display:block;text-align:center;background:#f39800;color:#fff;text-decoration:none;border:0;border-radius:12px;padding:14px;font-size:1.05rem;font-weight:700;width:100%;margin-top:12px}
label{display:block;margin:10px 0 4px;font-weight:600}input,textarea{width:100%;padding:12px;border:1px solid #cfc8bb;border-radius:10px;font-size:1rem}textarea{min-height:100px}
.hp{position:absolute;left:-9999px;opacity:0;height:0}.small{font-size:.85rem;color:#666}.tbl{width:100%;border-collapse:collapse;background:#fff}.tbl th,.tbl td{border:1px solid #e6e1d8;padding:10px;text-align:left;vertical-align:top}.tbl th{width:36%;background:#f6f2ea}
footer{max-width:640px;margin:0 auto;padding:16px;font-size:.85rem;color:#666;border-top:1px solid #e6e1d8}footer a{margin-right:12px;color:#666}
`;
