import { prisma } from '../config/prisma.js';
import { HttpError } from '../middleware/errorHandler.js';
import { materializeRecurringExpenses } from '../services/recurringExpense.service.js';

async function assertOwnedCategory(userId, categoryId) {
  if (!categoryId) return;
  const category = await prisma.category.findFirst({
    where: { id: categoryId, userId },
  });
  if (!category) {
    throw new HttpError(400, 'Categoria inválida.');
  }
}

async function getOwnedExpense(userId, expenseId) {
  const expense = await prisma.expense.findFirst({
    where: { id: expenseId, userId },
  });
  if (!expense) {
    throw new HttpError(404, 'Despesa não encontrada.');
  }
  return expense;
}

function monthRange(month) {
  if (!month) return null;
  const [year, monthIndex] = month.split('-').map(Number);
  if (!year || !monthIndex) {
    throw new HttpError(400, 'Parâmetro "month" inválido, use o formato YYYY-MM.');
  }
  const start = new Date(Date.UTC(year, monthIndex - 1, 1));
  const end = new Date(Date.UTC(year, monthIndex, 1));
  return { gte: start, lt: end };
}

export async function listExpenses(req, res) {
  const { month, categoryId } = req.query;

  if (month) {
    await materializeRecurringExpenses(req.userId, month);
  }

  const expenses = await prisma.expense.findMany({
    where: {
      userId: req.userId,
      ...(categoryId ? { categoryId } : {}),
      ...(month ? { date: monthRange(month) } : {}),
    },
    include: { category: true },
    orderBy: { date: 'desc' },
  });
  res.json({ expenses });
}

export async function createExpense(req, res) {
  const { title, amount, date, categoryId } = req.body;
  await assertOwnedCategory(req.userId, categoryId);

  const expense = await prisma.expense.create({
    data: { userId: req.userId, title, amount, date, categoryId: categoryId || null },
    include: { category: true },
  });
  res.status(201).json({ expense });
}

export async function updateExpense(req, res) {
  await getOwnedExpense(req.userId, req.params.id);
  if (req.body.categoryId !== undefined) {
    await assertOwnedCategory(req.userId, req.body.categoryId);
  }

  const expense = await prisma.expense.update({
    where: { id: req.params.id },
    data: req.body,
    include: { category: true },
  });
  res.json({ expense });
}

export async function deleteExpense(req, res) {
  await getOwnedExpense(req.userId, req.params.id);
  await prisma.expense.delete({ where: { id: req.params.id } });
  res.status(204).send();
}
