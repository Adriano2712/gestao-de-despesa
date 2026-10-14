import { Router } from 'express';
import {
  listRecurringExpenses,
  createRecurringExpense,
  updateRecurringExpense,
  deleteRecurringExpense,
} from '../controllers/recurringExpense.controller.js';
import { validate } from '../middleware/validate.js';
import {
  createRecurringExpenseSchema,
  updateRecurringExpenseSchema,
} from '../validators/recurringExpense.validators.js';
import { authenticate } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const recurringExpenseRouter = Router();

recurringExpenseRouter.use(authenticate);

recurringExpenseRouter.get('/', asyncHandler(listRecurringExpenses));
recurringExpenseRouter.post(
  '/',
  validate(createRecurringExpenseSchema),
  asyncHandler(createRecurringExpense)
);
recurringExpenseRouter.patch(
  '/:id',
  validate(updateRecurringExpenseSchema),
  asyncHandler(updateRecurringExpense)
);
recurringExpenseRouter.delete('/:id', asyncHandler(deleteRecurringExpense));
