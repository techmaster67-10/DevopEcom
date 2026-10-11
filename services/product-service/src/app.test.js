const request = require('supertest');
const { app } = require('./app');

test('GET /health', async () => {
  const r = await request(app).get('/health');
  expect(r.statusCode).toBe(200);
  expect(r.body.status).toBe('UP');
});

test('GET /products returns products', async () => {
  const r = await request(app).get('/products');
  expect(r.statusCode).toBe(200);
  expect(r.body.length).toBeGreaterThan(0);
});

test('GET /products/:id returns one product', async () => {
  const r = await request(app).get('/products/p1');
  expect(r.statusCode).toBe(200);
  expect(r.body.id).toBe('p1');
});

test('GET /products/:id returns 404 for unknown id', async () => {
  const r = await request(app).get('/products/does-not-exist');
  expect(r.statusCode).toBe(404);
});

test('POST /products creates a product', async () => {
  const r = await request(app).post('/products').send({ name: 'Webcam', description: '1080p', price: 2500, stock: 7 });
  expect(r.statusCode).toBe(201);
  expect(r.body.name).toBe('Webcam');
  expect(r.body.price).toBe(2500);
});

test('POST /products rejects missing name/price', async () => {
  const r = await request(app).post('/products').send({ description: 'no name' });
  expect(r.statusCode).toBe(400);
});

test('GET /metrics exposes Prometheus metrics', async () => {
  const r = await request(app).get('/metrics');
  expect(r.statusCode).toBe(200);
  expect(r.text).toContain('process_cpu');
});
