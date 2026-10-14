import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';
import { prisma } from '../src/config/prisma.js';

const email = `budget-test-${Date.now()}@example.com`;
let token;
let categoryId;

describe('Budgets', () => {
  beforeAll(async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Budget Test', email, password: 'password123' });
    token = res.body.token;

    const categories = await request(app)
      .get('/api/categories')
      .set('Authorization', `Bearer ${token}`);
    categoryId = categories.body.categories[0].id;
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email } });
    await prisma.$disconnect();
  });

  it('creates a budget for a category via upsert', async () => {
    const res = await request(app)
      .put(`/api/budgets/${categoryId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ monthlyLimit: 500 });

    expect(res.status).toBe(200);
    expect(Number(res.body.budget.monthlyLimit)).toBe(500);
  });

  it('updates the same budget instead of creating a duplicate', async () => {
    await request(app)
      .put(`/api/budgets/${categoryId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ monthlyLimit: 700 });

    const list = await request(app).get('/api/budgets').set('Authorization', `Bearer ${token}`);
    const budgetsForCategory = list.body.budgets.filter((b) => b.categoryId === categoryId);
    expect(budgetsForCategory).toHaveLength(1);
    expect(Number(budgetsForCategory[0].monthlyLimit)).toBe(700);
  });

  it('rejects a budget for a category owned by another user', async () => {
    const otherRes = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Other', email: `other-${Date.now()}@example.com`, password: 'password123' });
    const otherToken = otherRes.body.token;

    const res = await request(app)
      .put(`/api/budgets/${categoryId}`)
      .set('Authorization', `Bearer ${otherToken}`)
      .send({ monthlyLimit: 100 });

    expect(res.status).toBe(404);

    await prisma.user.delete({ where: { id: otherRes.body.user.id } });
  });
});
