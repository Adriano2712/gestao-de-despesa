import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';
import { prisma } from '../src/config/prisma.js';

const email = `recurring-test-${Date.now()}@example.com`;
let token;

function currentMonth() {
  return new Date().toISOString().slice(0, 7);
}

describe('Recurring expenses', () => {
  beforeAll(async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Recurring Test', email, password: 'password123' });
    token = res.body.token;
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email } });
    await prisma.$disconnect();
  });

  it('creates a recurring expense template', async () => {
    const res = await request(app)
      .post('/api/recurring-expenses')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Aluguel', amount: 1200, dayOfMonth: 5, startDate: '2026-01-01' });

    expect(res.status).toBe(201);
    expect(res.body.recurringExpense.title).toBe('Aluguel');
  });

  it('materializes the recurring expense into the current month, idempotently', async () => {
    const month = currentMonth();

    const first = await request(app)
      .get(`/api/expenses?month=${month}`)
      .set('Authorization', `Bearer ${token}`);
    const recurringMatches = first.body.expenses.filter((e) => e.title === 'Aluguel');
    expect(recurringMatches).toHaveLength(1);
    expect(recurringMatches[0].recurringExpenseId).toBeTruthy();

    const second = await request(app)
      .get(`/api/expenses?month=${month}`)
      .set('Authorization', `Bearer ${token}`);
    const recurringMatchesAgain = second.body.expenses.filter((e) => e.title === 'Aluguel');
    expect(recurringMatchesAgain).toHaveLength(1);
  });

  it('deletes a recurring expense template without deleting materialized expenses', async () => {
    const list = await request(app)
      .get('/api/recurring-expenses')
      .set('Authorization', `Bearer ${token}`);
    const id = list.body.recurringExpenses[0].id;

    const res = await request(app)
      .delete(`/api/recurring-expenses/${id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(204);

    const month = currentMonth();
    const expenses = await request(app)
      .get(`/api/expenses?month=${month}`)
      .set('Authorization', `Bearer ${token}`);
    const stillThere = expenses.body.expenses.find((e) => e.title === 'Aluguel');
    expect(stillThere).toBeTruthy();
    expect(stillThere.recurringExpenseId).toBeNull();
  });
});
