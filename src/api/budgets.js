import { apiClient } from './client';

function normalize(budget) {
  return { ...budget, monthlyLimit: Number(budget.monthlyLimit) };
}

export async function listBudgetsRequest() {
  const { data } = await apiClient.get('/budgets');
  return data.budgets.map(normalize);
}

export async function upsertBudgetRequest(categoryId, monthlyLimit) {
  const { data } = await apiClient.put(`/budgets/${categoryId}`, { monthlyLimit });
  return normalize(data.budget);
}

export async function deleteBudgetRequest(categoryId) {
  await apiClient.delete(`/budgets/${categoryId}`);
}
