const SERVICES = [
  { name: 'Product Service', url: '/api/health/product', port: 3001 },
  { name: 'Customer Service', url: '/api/health/customer', port: 3002 },
  { name: 'Order Service', url: '/api/health/order', port: 3003 }
];

async function check(svc) {
  const start = performance.now();
  try {
    const r = await fetch(svc.url, { cache: 'no-store' });
    const data = await r.json().catch(() => ({}));
    return { ...svc, up: r.ok && data.status === 'UP', ms: Math.round(performance.now() - start), detail: data.error || (data.dependencies ? 'Dependencies: ' + data.dependencies : '') };
  } catch (e) {
    return { ...svc, up: false, ms: null, detail: 'Unreachable' };
  }
}

async function refresh() {
  const results = await Promise.all(SERVICES.map(check));
  document.querySelector('#services').innerHTML = results.map(s => `
    <article class="card">
      <h3>${esc(s.name)}</h3>
      <span class="pill ${s.up ? 'up' : 'down'}">${s.up ? 'UP' : 'DOWN'}</span>
      <p><small>Port ${s.port}${s.ms !== null ? ' · ' + s.ms + ' ms' : ''}</small></p>
      <p><small>${esc(s.detail)}</small></p>
    </article>`).join('');
  document.querySelector('#checked').textContent = 'Last checked: ' + new Date().toLocaleTimeString('en-IN');
}

document.querySelector('#refresh').addEventListener('click', refresh);
refresh();
setInterval(refresh, 10000);
