import { apiClient } from './client';

function normalize(recurringExpense) {
  return {
    ...recurringExpense,
    amount: Number(recurringExpense.amount),
    startDate: recurringExpense.startDate.slice(0, 10),
  };
}

export async function listRecurringExpensesRequest() {
  const { data } = await apiClient.get('/recurring-expenses');
  return data.recurringExpenses.map(normalize);
}

export async function createRecurringExpenseRequest(values) {
  const { data } = await apiClient.post('/recurring-expenses', values);
  return normalize(data.recurringExpense);
}

export async function updateRecurringExpenseRequest(id, changes) {
  const { data } = await apiClient.patch(`/recurring-expenses/${id}`, changes);
  return normalize(data.recurringExpense);
}

export async function deleteRecurringExpenseRequest(id) {
  await apiClient.delete(`/recurring-expenses/${id}`);
}
