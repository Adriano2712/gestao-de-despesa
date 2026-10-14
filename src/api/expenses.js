import { apiClient } from './client';

function normalizeExpense(expense) {
  return { ...expense, amount: Number(expense.amount), date: expense.date.slice(0, 10) };
}

export async function listExpensesRequest({ month, categoryId } = {}) {
  const { data } = await apiClient.get('/expenses', { params: { month, categoryId } });
  return data.expenses.map(normalizeExpense);
}

export async function createExpenseRequest({ title, amount, date, categoryId }) {
  const { data } = await apiClient.post('/expenses', { title, amount, date, categoryId });
  return normalizeExpense(data.expense);
}

export async function updateExpenseRequest(id, changes) {
  const { data } = await apiClient.patch(`/expenses/${id}`, changes);
  return normalizeExpense(data.expense);
}

export async function deleteExpenseRequest(id) {
  await apiClient.delete(`/expenses/${id}`);
}
