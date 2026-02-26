import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { User } from '../types';
import { loginApi, registerApi } from '../api/auth';
import { getMeApi } from '../api/user';

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('token'));
  const user = ref<User | null>(null);

  const isAuthenticated = computed(() => !!token.value);

  function setAuth(newToken: string, newUser: User) {
    token.value = newToken;
    user.value = newUser;
    localStorage.setItem('token', newToken);
  }

  function clearAuth() {
    token.value = null;
    user.value = null;
    localStorage.removeItem('token');
  }

  async function login(email: string, password: string) {
    const { data } = await loginApi(email, password);
    setAuth(data.token, data.user);
  }

  async function register(name: string, email: string, password: string) {
    const { data } = await registerApi(name, email, password);
    setAuth(data.token, data.user);
  }

  async function fetchUser() {
    try {
      const { data } = await getMeApi();
      user.value = data;
    } catch {
      clearAuth();
    }
  }

  function logout() {
    clearAuth();
  }

  return { token, user, isAuthenticated, login, register, fetchUser, logout, setAuth };
});
