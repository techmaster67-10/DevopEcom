const API = { products: '/api/products', customers: '/api/customers', orders: '/api/orders' };

// Escape user-provided text before putting it into innerHTML (prevents XSS)
function esc(v) {
  return String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
const inr = n => '₹' + Number(n).toLocaleString('en-IN');

async function getJSON(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(url + ' returned ' + r.status);
  return r.json();
}
async function postJSON(url, body) {
  const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const data = await r.json().catch(() => ({}));
  return { ok: r.ok, data };
}
function setMessage(el, text, ok) {
  el.textContent = text;
  el.className = 'msg ' + (ok ? 'ok' : 'err');
}
document.addEventListener('DOMContentLoaded', () => {
  const here = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav a').forEach(a => { if (a.getAttribute('href') === here) a.classList.add('active'); });
});
