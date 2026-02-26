<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits<{
  submit: [email: string, password: string];
}>();

defineProps<{
  loading?: boolean;
  error?: string;
}>();

const email = ref('');
const password = ref('');

function handleSubmit() {
  if (!email.value || !password.value) return;
  emit('submit', email.value, password.value);
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="auth-form">
    <div class="form-group">
      <label for="email">Email</label>
      <input id="email" v-model="email" type="email" placeholder="you@example.com" required />
    </div>
    <div class="form-group">
      <label for="password">Password</label>
      <input id="password" v-model="password" type="password" placeholder="Your password" required />
    </div>
    <p v-if="error" class="error-message">{{ error }}</p>
    <button type="submit" class="btn-primary" :disabled="loading" style="width: 100%; margin-top: 8px;">
      {{ loading ? 'Loading...' : 'Login' }}
    </button>
  </form>
</template>
