<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits<{
  submit: [name: string, email: string, password: string];
}>();

defineProps<{
  loading?: boolean;
  error?: string;
}>();

const name = ref('');
const email = ref('');
const password = ref('');

function handleSubmit() {
  if (!name.value || !email.value || !password.value) return;
  emit('submit', name.value, email.value, password.value);
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="auth-form">
    <div class="form-group">
      <label for="name">Name</label>
      <input id="name" v-model="name" type="text" placeholder="Your name" required />
    </div>
    <div class="form-group">
      <label for="email">Email</label>
      <input id="email" v-model="email" type="email" placeholder="you@example.com" required />
    </div>
    <div class="form-group">
      <label for="password">Password</label>
      <input id="password" v-model="password" type="password" placeholder="Min. 6 characters" required minlength="6" />
    </div>
    <p v-if="error" class="error-message">{{ error }}</p>
    <button type="submit" class="btn-primary" :disabled="loading" style="width: 100%; margin-top: 8px;">
      {{ loading ? 'Loading...' : 'Register' }}
    </button>
  </form>
</template>
