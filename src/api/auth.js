import { apiClient } from './client';

function normalizeUser(user) {
  return { ...user, salary: Number(user.salary) };
}

export async function registerRequest({ name, email, password }) {
  const { data } = await apiClient.post('/auth/register', { name, email, password });
  return { token: data.token, user: normalizeUser(data.user) };
}

export async function loginRequest({ email, password }) {
  const { data } = await apiClient.post('/auth/login', { email, password });
  return { token: data.token, user: normalizeUser(data.user) };
}

export async function fetchMe() {
  const { data } = await apiClient.get('/auth/me');
  return normalizeUser(data.user);
}

export async function updateSalaryRequest(salary) {
  const { data } = await apiClient.patch('/auth/me', { salary });
  return normalizeUser(data.user);
}
