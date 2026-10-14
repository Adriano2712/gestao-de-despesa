import { prisma } from '../config/prisma.js';

function monthRange(month) {
  const [year, monthIndex] = month.split('-').map(Number);
  const start = new Date(Date.UTC(year, monthIndex - 1, 1));
  const end = new Date(Date.UTC(year, monthIndex, 1));
  return { start, end };
}

// Idempotent: safe to call repeatedly for the same user/month, never creates duplicates.
export async function materializeRecurringExpenses(userId, month) {
  const { start, end } = monthRange(month);
  if (start > new Date()) return;

  const templates = await prisma.recurringExpense.findMany({
    where: { userId, active: true, startDate: { lt: end } },
  });

  for (const template of templates) {
    const alreadyMaterialized = await prisma.expense.findFirst({
      where: { recurringExpenseId: template.id, date: { gte: start, lt: end } },
    });
    if (alreadyMaterialized) continue;

    const daysInMonth = new Date(
      Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + 1, 0)
    ).getUTCDate();
    const day = Math.min(template.dayOfMonth, daysInMonth);
    const date = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), day));

    if (date < template.startDate) continue;

    await prisma.expense.create({
      data: {
        userId,
        categoryId: template.categoryId,
        title: template.title,
        amount: template.amount,
        date,
        recurringExpenseId: template.id,
      },
    });
  }
}
