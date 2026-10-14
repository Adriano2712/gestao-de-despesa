import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string().trim().min(1, 'Nome é obrigatório.').max(60),
  color: z
    .string()
    .trim()
    .regex(/^#[0-9a-fA-F]{6}$/, 'Cor deve ser um hexadecimal, ex: #ff0000.')
    .optional(),
});

export const updateCategorySchema = createCategorySchema.partial();
