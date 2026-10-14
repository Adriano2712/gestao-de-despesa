import { Router } from 'express';
import { monthlyReport, historyReport, exportExpensesCsv } from '../controllers/report.controller.js';
import { authenticate } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const reportRouter = Router();

reportRouter.use(authenticate);

reportRouter.get('/monthly', asyncHandler(monthlyReport));
reportRouter.get('/history', asyncHandler(historyReport));
reportRouter.get('/export', asyncHandler(exportExpensesCsv));
