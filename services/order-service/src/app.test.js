const request = require('supertest');
const { app, orders } = require('./app');

const ok = data => Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(data) });
const fail = status => Promise.resolve({ ok: false, status, json: () => Promise.resolve({}) });

// Mock the Product + Customer services so tests don't need them running
function mockDependencies(product) {
  global.fetch = jest.fn(url => String(url).includes('/customers/')
    ? ok({ id: 'c1', name: 'Aarav Shah' })
    : ok(product));
}

beforeEach(() => { orders.length = 0; });

test('GET /health is UP when dependencies are UP', async () => {
  global.fetch = jest.fn(() => ok({ status: 'UP' }));
  const r = await request(app).get('/health');
  expect(r.statusCode).toBe(200);
  expect(r.body.status).toBe('UP');
});

test('GET /health is 503 when a dependency is down', async () => {
  global.fetch = jest.fn(() => fail(500));
  const r = await request(app).get('/health');
  expect(r.statusCode).toBe(503);
  expect(r.body.status).toBe('DOWN');
});

test('GET /orders starts empty', async () => {
  const r = await request(app).get('/orders');
  expect(r.statusCode).toBe(200);
  expect(r.body).toEqual([]);
});

test('POST /orders creates a confirmed order with correct total', async () => {
  mockDependencies({ id: 'p1', name: 'Laptop', price: 1000, stock: 5 });
  const r = await request(app).post('/orders').send({ customerId: 'c1', productId: 'p1', quantity: 2 });
  expect(r.statusCode).toBe(201);
  expect(r.body.total).toBe(2000);
  expect(r.body.status).toBe('CONFIRMED');
  expect(r.body.customerName).toBe('Aarav Shah');
  expect(orders).toHaveLength(1);
});

test('POST /orders rejects when stock is insufficient', async () => {
  mockDependencies({ id: 'p1', name: 'Laptop', price: 1000, stock: 1 });
  const r = await request(app).post('/orders').send({ customerId: 'c1', productId: 'p1', quantity: 2 });
  expect(r.statusCode).toBe(400);
  expect(r.body.error).toBe('Insufficient stock');
  expect(orders).toHaveLength(0);
});

test('POST /orders fails cleanly when a dependency returns an error', async () => {
  global.fetch = jest.fn(() => fail(404));
  const r = await request(app).post('/orders').send({ customerId: 'bad', productId: 'bad', quantity: 1 });
  expect(r.statusCode).toBe(400);
  expect(r.body.error).toBe('Could not create order');
});

test('POST /orders validates the request body', async () => {
  const missing = await request(app).post('/orders').send({ customerId: 'c1' });
  expect(missing.statusCode).toBe(400);
  const zero = await request(app).post('/orders').send({ customerId: 'c1', productId: 'p1', quantity: 0 });
  expect(zero.statusCode).toBe(400);
});
