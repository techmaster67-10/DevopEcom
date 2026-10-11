const request = require('supertest');
const { app } = require('./app');

test('GET /health', async () => {
  const r = await request(app).get('/health');
  expect(r.statusCode).toBe(200);
  expect(r.body.status).toBe('UP');
});

test('GET /customers returns customers', async () => {
  const r = await request(app).get('/customers');
  expect(r.statusCode).toBe(200);
  expect(r.body.length).toBeGreaterThan(0);
});

test('GET /customers/:id returns one customer', async () => {
  const r = await request(app).get('/customers/c1');
  expect(r.statusCode).toBe(200);
  expect(r.body.id).toBe('c1');
});

test('GET /customers/:id returns 404 for unknown id', async () => {
  const r = await request(app).get('/customers/nope');
  expect(r.statusCode).toBe(404);
});

test('POST /customers creates a customer', async () => {
  const r = await request(app).post('/customers').send({ name: 'Test User', email: 'test@example.com' });
  expect(r.statusCode).toBe(201);
  expect(r.body.email).toBe('test@example.com');
});

test('POST /customers rejects missing email', async () => {
  const r = await request(app).post('/customers').send({ name: 'No Email' });
  expect(r.statusCode).toBe(400);
});
