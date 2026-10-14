import { apiClient } from './client';

export async function listCategoriesRequest() {
  const { data } = await apiClient.get('/categories');
  return data.categories;
}

export async function createCategoryRequest({ name, color }) {
  const { data } = await apiClient.post('/categories', { name, color });
  return data.category;
}

export async function deleteCategoryRequest(id) {
  await apiClient.delete(`/categories/${id}`);
}
