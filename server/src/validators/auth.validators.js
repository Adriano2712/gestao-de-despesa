import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().trim().min(1, 'Nome é obrigatório.').max(120),
  email: z.string().trim().email('E-mail inválido.').toLowerCase(),
  password: z.string().min(8, 'A senha deve ter pelo menos 8 caracteres.').max(72),
});

export const loginSchema = z.object({
  email: z.string().trim().email('E-mail inválido.').toLowerCase(),
  password: z.string().min(1, 'Senha é obrigatória.'),
});

export const updateMeSchema = z.object({
  salary: z.number().nonnegative('O salário não pode ser negativo.'),
});
