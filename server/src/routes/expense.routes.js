import { Router } from 'express';
import {
  listExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
} from '../controllers/expense.controller.js';
import { validate } from '../middleware/validate.js';
import { createExpenseSchema, updateExpenseSchema } from '../validators/expense.validators.js';
import { authenticate } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const expenseRouter = Router();

expenseRouter.use(authenticate);

expenseRouter.get('/', asyncHandler(listExpenses));
expenseRouter.post('/', validate(createExpenseSchema), asyncHandler(createExpense));
expenseRouter.patch('/:id', validate(updateExpenseSchema), asyncHandler(updateExpense));
expenseRouter.delete('/:id', asyncHandler(deleteExpense));
