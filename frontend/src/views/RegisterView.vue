<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import RegisterForm from '../components/RegisterForm.vue';

const authStore = useAuthStore();
const router = useRouter();
const loading = ref(false);
const error = ref('');

async function handleRegister(name: string, email: string, password: string) {
  loading.value = true;
  error.value = '';
  try {
    await authStore.register(name, email, password);
    router.push('/crypto');
  } catch (err: unknown) {
    const axiosErr = err as { response?: { data?: { message?: string } } };
    error.value = axiosErr.response?.data?.message || 'Registration failed. Please try again.';
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="auth-page">
    <div class="auth-card">
      <h1>Register</h1>
      <p class="auth-subtitle">Create an account to get started</p>
      <RegisterForm :loading="loading" :error="error" @submit="handleRegister" />
      <p class="auth-footer">
        Already have an account? <router-link to="/login">Login</router-link>
      </p>
    </div>
  </div>
</template>

<style scoped>
.auth-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 140px);
}

.auth-card {
  background-color: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 40px;
  width: 100%;
  max-width: 420px;
}

.auth-card h1 {
  font-size: 24px;
  margin-bottom: 8px;
}

.auth-subtitle {
  color: var(--text-muted);
  font-size: 14px;
  margin-bottom: 24px;
}

.auth-footer {
  text-align: center;
  font-size: 14px;
  color: var(--text-muted);
  margin-top: 20px;
}
</style>
