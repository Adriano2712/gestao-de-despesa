import { z } from 'zod';

export const upsertBudgetSchema = z.object({
  monthlyLimit: z.number().positive('O limite deve ser maior que zero.'),
});
