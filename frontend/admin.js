const $ = s => document.querySelector(s);

async function loadLists() {
  try {
    const [products, customers] = await Promise.all([getJSON(API.products), getJSON(API.customers)]);
    $('#pRows').innerHTML = products.map(p => `<tr><td>${esc(p.id)}</td><td>${esc(p.name)}</td><td>${inr(p.price)}</td><td>${esc(p.stock)}</td></tr>`).join('');
    $('#cRows').innerHTML = customers.map(c => `<tr><td>${esc(c.id)}</td><td>${esc(c.name)}</td><td>${esc(c.email)}</td></tr>`).join('');
  } catch (e) {
    setMessage($('#pMsg'), 'Backend services are not available. Start Docker Compose first.', false);
  }
}

$('#productForm').addEventListener('submit', async e => {
  e.preventDefault();
  const body = { name: $('#pName').value.trim(), description: $('#pDesc').value.trim(), price: Number($('#pPrice').value), stock: Number($('#pStock').value) };
  const { ok, data } = await postJSON(API.products, body);
  setMessage($('#pMsg'), ok ? `Product "${data.name}" added (${data.id}).` : (data.error || 'Could not add product'), ok);
  if (ok) { e.target.reset(); $('#pStock').value = 10; loadLists(); }
});

$('#customerForm').addEventListener('submit', async e => {
  e.preventDefault();
  const body = { name: $('#cName').value.trim(), email: $('#cEmail').value.trim() };
  const { ok, data } = await postJSON(API.customers, body);
  setMessage($('#cMsg'), ok ? `Customer "${data.name}" added (${data.id}).` : (data.error || 'Could not add customer'), ok);
  if (ok) { e.target.reset(); loadLists(); }
});

loadLists();
