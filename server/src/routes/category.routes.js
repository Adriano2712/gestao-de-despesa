import { Router } from 'express';
import {
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/category.controller.js';
import { validate } from '../middleware/validate.js';
import { createCategorySchema, updateCategorySchema } from '../validators/category.validators.js';
import { authenticate } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const categoryRouter = Router();

categoryRouter.use(authenticate);

categoryRouter.get('/', asyncHandler(listCategories));
categoryRouter.post('/', validate(createCategorySchema), asyncHandler(createCategory));
categoryRouter.patch('/:id', validate(updateCategorySchema), asyncHandler(updateCategory));
categoryRouter.delete('/:id', asyncHandler(deleteCategory));
