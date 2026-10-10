import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { app } from '../src/app.js';
import { openDb } from '../src/db.js';

process.env.NODE_ENV = 'test';
await openDb();

test('Employee API with Auth', async (t) => {
  let token = '';

  await t.test('POST /api/auth/login returns token for valid credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({ username: 'admin', password: 'admin' });
    assert.strictEqual(res.status, 200);
    assert.ok(res.body.token);
    token = res.body.token;
  });

  await t.test('GET /api/employees returns initial demo employee (unprotected)', async () => {
    const res = await request(app).get('/api/employees');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.length, 1);
  });

  await t.test('POST /api/employees returns 401 if no token provided', async () => {
    const res = await request(app).post('/api/employees').send({ name: 'Alice', age: 30, salary: 60000 });
    assert.strictEqual(res.status, 401);
  });

  await t.test('POST /api/employees creates employee with valid input and token', async () => {
    const res = await request(app)
      .post('/api/employees')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Alice', age: 30, salary: 60000 });
    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.name, 'Alice');
  });

  await t.test('PUT /api/employees/:id updates existing employee', async () => {
    const res = await request(app)
      .put('/api/employees/2')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Alice Updated', age: 31, salary: 65000 });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.name, 'Alice Updated');
  });

  await t.test('DELETE /api/employees/:id deletes employee', async () => {
    const res = await request(app)
      .delete('/api/employees/2')
      .set('Authorization', `Bearer ${token}`);
    assert.strictEqual(res.status, 204);
  });
});
