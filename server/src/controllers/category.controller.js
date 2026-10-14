import { prisma } from '../config/prisma.js';
import { HttpError } from '../middleware/errorHandler.js';

async function getOwnedCategory(userId, categoryId) {
  const category = await prisma.category.findFirst({
    where: { id: categoryId, userId },
  });
  if (!category) {
    throw new HttpError(404, 'Categoria não encontrada.');
  }
  return category;
}

export async function listCategories(req, res) {
  const categories = await prisma.category.findMany({
    where: { userId: req.userId },
    orderBy: { name: 'asc' },
  });
  res.json({ categories });
}

export async function createCategory(req, res) {
  const { name, color } = req.body;

  const existing = await prisma.category.findUnique({
    where: { userId_name: { userId: req.userId, name } },
  });
  if (existing) {
    throw new HttpError(409, 'Você já tem uma categoria com este nome.');
  }

  const category = await prisma.category.create({
    data: { userId: req.userId, name, color },
  });
  res.status(201).json({ category });
}

export async function updateCategory(req, res) {
  await getOwnedCategory(req.userId, req.params.id);
  const category = await prisma.category.update({
    where: { id: req.params.id },
    data: req.body,
  });
  res.json({ category });
}

export async function deleteCategory(req, res) {
  await getOwnedCategory(req.userId, req.params.id);
  await prisma.category.delete({ where: { id: req.params.id } });
  res.status(204).send();
}
