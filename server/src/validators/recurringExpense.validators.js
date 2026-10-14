import { z } from 'zod';

export const createRecurringExpenseSchema = z.object({
  title: z.string().trim().min(1, 'Título é obrigatório.').max(120),
  amount: z.number().positive('O valor deve ser maior que zero.'),
  dayOfMonth: z.number().int().min(1).max(28, 'Use um dia entre 1 e 28 para valer em todos os meses.'),
  startDate: z.coerce.date(),
  categoryId: z.string().uuid().nullable().optional(),
});

export const updateRecurringExpenseSchema = z.object({
  title: z.string().trim().min(1).max(120).optional(),
  amount: z.number().positive().optional(),
  dayOfMonth: z.number().int().min(1).max(28).optional(),
  categoryId: z.string().uuid().nullable().optional(),
  active: z.boolean().optional(),
});
