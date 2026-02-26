import api from './index';
import type { User } from '../types';

export function getMeApi() {
  return api.get<User>('/users/me');
}

export function updateMeApi(data: { name?: string; email?: string; description?: string }) {
  return api.put<User>('/users/me', data);
}

export function uploadAvatarApi(file: File) {
  const formData = new FormData();
  formData.append('avatar', file);
  return api.post<{ avatarUrl: string }>('/users/me/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}
