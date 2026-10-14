import { prisma } from '../config/prisma.js';
import { HttpError } from '../middleware/errorHandler.js';

async function assertOwnedCategory(userId, categoryId) {
  if (!categoryId) return;
  const category = await prisma.category.findFirst({ where: { id: categoryId, userId } });
  if (!category) {
    throw new HttpError(400, 'Categoria inválida.');
  }
}

async function getOwnedRecurringExpense(userId, id) {
  const recurring = await prisma.recurringExpense.findFirst({ where: { id, userId } });
  if (!recurring) {
    throw new HttpError(404, 'Despesa recorrente não encontrada.');
  }
  return recurring;
}

export async function listRecurringExpenses(req, res) {
  const recurringExpenses = await prisma.recurringExpense.findMany({
    where: { userId: req.userId },
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  });
  res.json({ recurringExpenses });
}

export async function createRecurringExpense(req, res) {
  const { title, amount, dayOfMonth, startDate, categoryId } = req.body;
  await assertOwnedCategory(req.userId, categoryId);

  const recurringExpense = await prisma.recurringExpense.create({
    data: { userId: req.userId, title, amount, dayOfMonth, startDate, categoryId: categoryId || null },
    include: { category: true },
  });
  res.status(201).json({ recurringExpense });
}

export async function updateRecurringExpense(req, res) {
  await getOwnedRecurringExpense(req.userId, req.params.id);
  if (req.body.categoryId !== undefined) {
    await assertOwnedCategory(req.userId, req.body.categoryId);
  }

  const recurringExpense = await prisma.recurringExpense.update({
    where: { id: req.params.id },
    data: req.body,
    include: { category: true },
  });
  res.json({ recurringExpense });
}

export async function deleteRecurringExpense(req, res) {
  await getOwnedRecurringExpense(req.userId, req.params.id);
  await prisma.recurringExpense.delete({ where: { id: req.params.id } });
  res.status(204).send();
}
