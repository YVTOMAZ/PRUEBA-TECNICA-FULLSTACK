import api from './index';
import type { AuthResponse } from '../types';

export function loginApi(email: string, password: string) {
  return api.post<AuthResponse>('/auth/login', { email, password });
}

export function registerApi(name: string, email: string, password: string) {
  return api.post<AuthResponse>('/auth/register', { name, email, password });
}
