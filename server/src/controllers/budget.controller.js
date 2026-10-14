import { prisma } from '../config/prisma.js';
import { HttpError } from '../middleware/errorHandler.js';

async function getOwnedCategory(userId, categoryId) {
  const category = await prisma.category.findFirst({ where: { id: categoryId, userId } });
  if (!category) {
    throw new HttpError(404, 'Categoria não encontrada.');
  }
  return category;
}

export async function listBudgets(req, res) {
  const budgets = await prisma.budget.findMany({
    where: { userId: req.userId },
    include: { category: true },
  });
  res.json({ budgets });
}

export async function upsertBudget(req, res) {
  const { categoryId } = req.params;
  const { monthlyLimit } = req.body;
  await getOwnedCategory(req.userId, categoryId);

  const budget = await prisma.budget.upsert({
    where: { categoryId },
    update: { monthlyLimit },
    create: { userId: req.userId, categoryId, monthlyLimit },
    include: { category: true },
  });
  res.json({ budget });
}

export async function deleteBudget(req, res) {
  const { categoryId } = req.params;
  await getOwnedCategory(req.userId, categoryId);

  await prisma.budget.deleteMany({ where: { categoryId, userId: req.userId } });
  res.status(204).send();
}
