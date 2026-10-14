import { prisma } from '../config/prisma.js';
import { materializeRecurringExpenses } from '../services/recurringExpense.service.js';
import { HttpError } from '../middleware/errorHandler.js';

function currentMonth() {
  return new Date().toISOString().slice(0, 7);
}

function monthRange(month) {
  const [year, monthIndex] = month.split('-').map(Number);
  if (!year || !monthIndex || monthIndex < 1 || monthIndex > 12) {
    throw new HttpError(400, 'Parâmetro "month" inválido, use o formato YYYY-MM.');
  }
  const start = new Date(Date.UTC(year, monthIndex - 1, 1));
  const end = new Date(Date.UTC(year, monthIndex, 1));
  return { start, end };
}

function shiftMonth(month, offset) {
  const [year, monthIndex] = month.split('-').map(Number);
  const date = new Date(Date.UTC(year, monthIndex - 1 + offset, 1));
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`;
}

function csvCell(value) {
  let str = String(value);
  if (/^[=+\-@]/.test(str)) {
    str = `'${str}`;
  }
  return `"${str.replace(/"/g, '""')}"`;
}

export async function monthlyReport(req, res) {
  const month = req.query.month || currentMonth();
  await materializeRecurringExpenses(req.userId, month);
  const { start, end } = monthRange(month);

  const [user, expenses, budgets] = await Promise.all([
    prisma.user.findUnique({ where: { id: req.userId } }),
    prisma.expense.findMany({
      where: { userId: req.userId, date: { gte: start, lt: end } },
      include: { category: true },
    }),
    prisma.budget.findMany({ where: { userId: req.userId } }),
  ]);

  const budgetByCategoryId = new Map(budgets.map((b) => [b.categoryId, Number(b.monthlyLimit)]));
  const totalsByCategory = new Map();

  for (const expense of expenses) {
    const key = expense.categoryId || 'none';
    const current = totalsByCategory.get(key) || {
      categoryId: expense.categoryId,
      name: expense.category?.name || 'Sem categoria',
      color: expense.category?.color || '#898781',
      total: 0,
    };
    current.total += Number(expense.amount);
    totalsByCategory.set(key, current);
  }

  const categories = [...totalsByCategory.values()]
    .map((row) => ({ ...row, budgetLimit: budgetByCategoryId.get(row.categoryId) ?? null }))
    .sort((a, b) => b.total - a.total);

  const totalExpenses = categories.reduce((sum, c) => sum + c.total, 0);
  const salary = Number(user.salary);

  res.json({ month, salary, totalExpenses, remaining: salary - totalExpenses, categories });
}

export async function historyReport(req, res) {
  const months = Math.min(Math.max(parseInt(req.query.months, 10) || 6, 1), 24);
  const current = currentMonth();

  const series = [];
  for (let i = months - 1; i >= 0; i--) {
    const month = shiftMonth(current, -i);
    await materializeRecurringExpenses(req.userId, month);
    const { start, end } = monthRange(month);
    const result = await prisma.expense.aggregate({
      where: { userId: req.userId, date: { gte: start, lt: end } },
      _sum: { amount: true },
    });
    series.push({ month, total: Number(result._sum.amount || 0) });
  }

  res.json({ series });
}

export async function exportExpensesCsv(req, res) {
  const month = req.query.month || currentMonth();
  await materializeRecurringExpenses(req.userId, month);
  const { start, end } = monthRange(month);

  const expenses = await prisma.expense.findMany({
    where: { userId: req.userId, date: { gte: start, lt: end } },
    include: { category: true },
    orderBy: { date: 'asc' },
  });

  const header = 'Data,Titulo,Categoria,Valor\n';
  const rows = expenses
    .map((expense) =>
      [
        expense.date.toISOString().slice(0, 10),
        csvCell(expense.title),
        csvCell(expense.category?.name || 'Sem categoria'),
        Number(expense.amount).toFixed(2),
      ].join(',')
    )
    .join('\n');

  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="despesas-${month}.csv"`);
  res.send(`${header}${rows}\n`);
}
