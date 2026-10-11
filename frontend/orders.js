const $ = s => document.querySelector(s);
let all = [];

function render() {
  const q = $('#filter').value.trim().toLowerCase();
  const list = all.filter(o => !q || [o.id, o.customerName, o.productName].some(v => String(v).toLowerCase().includes(q)));
  $('#rows').innerHTML = list.length
    ? list.map(o => `<tr>
        <td><b>${esc(o.id)}</b></td><td>${esc(o.customerName)}</td><td>${esc(o.productName)}</td>
        <td>${esc(o.quantity)}</td><td>${inr(o.unitPrice)}</td><td>${inr(o.total)}</td>
        <td><span class="pill up">${esc(o.status)}</span></td>
        <td>${o.createdAt ? new Date(o.createdAt).toLocaleString('en-IN') : '–'}</td></tr>`).join('')
    : `<tr><td colspan="8" class="empty">${all.length ? 'No orders match your search.' : 'No orders yet. Place one from the Shop page.'}</td></tr>`;
}

async function load() {
  try {
    all = (await getJSON(API.orders)).slice().reverse();
    $('#statCount').textContent = all.length;
    $('#statRevenue').textContent = inr(all.reduce((s, o) => s + o.total, 0));
    $('#statItems').textContent = all.reduce((s, o) => s + o.quantity, 0);
    $('#message').textContent = '';
    render();
  } catch (e) {
    setMessage($('#message'), 'Could not load orders. Is the Order Service running?', false);
  }
}

$('#filter').addEventListener('input', render);
$('#refresh').addEventListener('click', load);
load();
