import { z } from 'zod';

export const createExpenseSchema = z.object({
  title: z.string().trim().min(1, 'Título é obrigatório.').max(120),
  amount: z.number().positive('O valor deve ser maior que zero.'),
  date: z.coerce.date(),
  categoryId: z.string().uuid().nullable().optional(),
});

export const updateExpenseSchema = createExpenseSchema.partial();
