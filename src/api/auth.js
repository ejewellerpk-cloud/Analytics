import { apiClient } from './client'

export async function login({ email, password }) {
  const { data } = await apiClient.post('/auth/login', { email, password })
  return data
}

export async function logout() {
  try {
    await apiClient.post('/auth/logout')
  } catch {
    /* token may already be invalid */
  }
}

export async function fetchProfile() {
  const { data } = await apiClient.get('/profile')
  return data
}
