import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';
import { prisma } from '../src/config/prisma.js';

const email = `report-test-${Date.now()}@example.com`;
let token;
let categoryId;

function currentMonth() {
  return new Date().toISOString().slice(0, 7);
}

describe('Reports', () => {
  beforeAll(async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Report Test', email, password: 'password123' });
    token = res.body.token;

    await request(app)
      .patch('/api/auth/me')
      .set('Authorization', `Bearer ${token}`)
      .send({ salary: 3000 });

    const categories = await request(app)
      .get('/api/categories')
      .set('Authorization', `Bearer ${token}`);
    categoryId = categories.body.categories[0].id;

    const month = currentMonth();
    await request(app)
      .post('/api/expenses')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Mercado', amount: 200, date: `${month}-05`, categoryId });
    await request(app)
      .post('/api/expenses')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Feira', amount: 50, date: `${month}-10`, categoryId });
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email } });
    await prisma.$disconnect();
  });

  it('returns the monthly report with totals by category', async () => {
    const res = await request(app)
      .get(`/api/reports/monthly?month=${currentMonth()}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.salary).toBe(3000);
    expect(res.body.totalExpenses).toBe(250);
    expect(res.body.remaining).toBe(2750);
    expect(res.body.categories).toHaveLength(1);
    expect(res.body.categories[0].total).toBe(250);
  });

  it('returns a monthly history series', async () => {
    const res = await request(app)
      .get('/api/reports/history?months=3')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.series).toHaveLength(3);
    expect(res.body.series[res.body.series.length - 1].month).toBe(currentMonth());
    expect(res.body.series[res.body.series.length - 1].total).toBe(250);
  });

  it('exports a CSV file with the expenses of the month', async () => {
    const res = await request(app)
      .get(`/api/reports/export?month=${currentMonth()}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toContain('text/csv');
    expect(res.text).toContain('Mercado');
    expect(res.text).toContain('Feira');
    expect(res.text.split('\n')[0]).toBe('Data,Titulo,Categoria,Valor');
  });
});
