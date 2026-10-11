const $ = s => document.querySelector(s);

async function load() {
  const [products, customers, orders] = await Promise.all([getJSON(API.products), getJSON(API.customers), getJSON(API.orders)]);
  $('#products').innerHTML = products.map(p =>
    `<article class="card"><h3>${esc(p.name)}</h3><p>${esc(p.description)}</p><p class="price">${inr(p.price)}</p><small>Stock: ${esc(p.stock)}</small></article>`).join('');
  $('#productId').innerHTML = products.map(p => `<option value="${esc(p.id)}">${esc(p.name)} — ${inr(p.price)}</option>`).join('');
  $('#customerId').innerHTML = customers.map(c => `<option value="${esc(c.id)}">${esc(c.name)}</option>`).join('');
  renderOrders(orders);
}

function renderOrders(orders) {
  $('#orders').innerHTML = orders.length
    ? orders.slice().reverse().slice(0, 5).map(o =>
        `<div class="order"><b>${esc(o.id)}</b> — ${esc(o.customerName)} ordered ${esc(o.productName)} × ${esc(o.quantity)} — ${inr(o.total)}</div>`).join('')
    : 'No orders yet.';
}

$('#orderForm').addEventListener('submit', async e => {
  e.preventDefault();
  const body = { customerId: $('#customerId').value, productId: $('#productId').value, quantity: Number($('#quantity').value) };
  const { ok, data } = await postJSON(API.orders, body);
  setMessage($('#message'), ok ? `Order ${data.id} created successfully.` : (data.error || 'Order failed'), ok);
  if (ok) load();
});

load().catch(() => setMessage($('#message'), 'Backend services are not available. Start Docker Compose first.', false));
