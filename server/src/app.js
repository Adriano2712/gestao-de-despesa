import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env.js';
import { authRouter } from './routes/auth.routes.js';
import { categoryRouter } from './routes/category.routes.js';
import { expenseRouter } from './routes/expense.routes.js';
import { recurringExpenseRouter } from './routes/recurringExpense.routes.js';
import { budgetRouter } from './routes/budget.routes.js';
import { reportRouter } from './routes/report.routes.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';

export const app = express();

app.use(helmet());
app.use(cors({ origin: env.corsOrigin }));
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/expenses', expenseRouter);
app.use('/api/recurring-expenses', recurringExpenseRouter);
app.use('/api/budgets', budgetRouter);
app.use('/api/reports', reportRouter);

app.use(notFoundHandler);
app.use(errorHandler);
