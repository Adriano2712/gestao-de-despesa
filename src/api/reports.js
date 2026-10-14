import { apiClient } from './client';

export async function monthlyReportRequest(month) {
  const { data } = await apiClient.get('/reports/monthly', { params: { month } });
  return data;
}

export async function historyReportRequest(months = 6) {
  const { data } = await apiClient.get('/reports/history', { params: { months } });
  return data.series;
}

export async function downloadExpensesCsv(month) {
  const response = await apiClient.get('/reports/export', {
    params: { month },
    responseType: 'blob',
  });

  const url = URL.createObjectURL(response.data);
  const link = document.createElement('a');
  link.href = url;
  link.download = `despesas-${month}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
