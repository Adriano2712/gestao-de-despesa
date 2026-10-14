import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';
import { prisma } from '../src/config/prisma.js';

const suffix = Date.now();
const userA = { name: 'User A', email: `expense-a-${suffix}@example.com`, password: 'password123' };
const userB = { name: 'User B', email: `expense-b-${suffix}@example.com`, password: 'password123' };

let tokenA;
let tokenB;
let categoryIdA;
let expenseIdA;

describe('Expenses', () => {
  beforeAll(async () => {
    const resA = await request(app).post('/api/auth/register').send(userA);
    tokenA = resA.body.token;

    const resB = await request(app).post('/api/auth/register').send(userB);
    tokenB = resB.body.token;

    const categoriesA = await request(app)
      .get('/api/categories')
      .set('Authorization', `Bearer ${tokenA}`);
    categoryIdA = categoriesA.body.categories[0].id;
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: { in: [userA.email, userB.email] } } });
    await prisma.$disconnect();
  });

  it('creates an expense scoped to the authenticated user', async () => {
    const res = await request(app)
      .post('/api/expenses')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ title: 'Mercado', amount: 150.5, date: '2026-10-01', categoryId: categoryIdA });

    expect(res.status).toBe(201);
    expect(res.body.expense.title).toBe('Mercado');
    expenseIdA = res.body.expense.id;
  });

  it('rejects a negative amount', async () => {
    const res = await request(app)
      .post('/api/expenses')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ title: 'Inválida', amount: -10, date: '2026-10-01' });

    expect(res.status).toBe(400);
  });

  it("does not let user B see user A's expenses", async () => {
    const res = await request(app)
      .get('/api/expenses')
      .set('Authorization', `Bearer ${tokenB}`);

    expect(res.status).toBe(200);
    expect(res.body.expenses).toHaveLength(0);
  });

  it("does not let user B delete user A's expense", async () => {
    const res = await request(app)
      .delete(`/api/expenses/${expenseIdA}`)
      .set('Authorization', `Bearer ${tokenB}`);

    expect(res.status).toBe(404);
  });

  it('lets user A delete their own expense', async () => {
    const res = await request(app)
      .delete(`/api/expenses/${expenseIdA}`)
      .set('Authorization', `Bearer ${tokenA}`);

    expect(res.status).toBe(204);
  });
});
