import { Router } from 'express';
import { listBudgets, upsertBudget, deleteBudget } from '../controllers/budget.controller.js';
import { validate } from '../middleware/validate.js';
import { upsertBudgetSchema } from '../validators/budget.validators.js';
import { authenticate } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const budgetRouter = Router();

budgetRouter.use(authenticate);

budgetRouter.get('/', asyncHandler(listBudgets));
budgetRouter.put('/:categoryId', validate(upsertBudgetSchema), asyncHandler(upsertBudget));
budgetRouter.delete('/:categoryId', asyncHandler(deleteBudget));
