<script setup lang="ts">
import { ref } from 'vue';
import type { User } from '../types';

const props = defineProps<{
  user: User;
  loading?: boolean;
  error?: string;
}>();

const emit = defineEmits<{
  save: [data: { name: string; email: string; description: string }];
  cancel: [];
}>();

const name = ref(props.user.name);
const email = ref(props.user.email);
const description = ref(props.user.description);

function handleSubmit() {
  emit('save', { name: name.value, email: email.value, description: description.value });
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="edit-form">
    <div class="form-group">
      <label for="name">Name</label>
      <input id="name" v-model="name" type="text" required />
    </div>
    <div class="form-group">
      <label for="email">Email</label>
      <input id="email" v-model="email" type="email" required />
    </div>
    <div class="form-group">
      <label for="description">Description</label>
      <textarea id="description" v-model="description" placeholder="Tell something about yourself..." />
    </div>
    <p v-if="error" class="error-message">{{ error }}</p>
    <div class="form-actions">
      <button type="button" class="btn-secondary" @click="emit('cancel')">Cancel</button>
      <button type="submit" class="btn-primary" :disabled="loading">
        {{ loading ? 'Saving...' : 'Save' }}
      </button>
    </div>
  </form>
</template>

<style scoped>
.edit-form {
  width: 100%;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>
