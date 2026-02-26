<script setup lang="ts">
import type { User } from '../types';

defineProps<{
  user: User;
}>();

defineEmits<{
  edit: [];
}>();
</script>

<template>
  <div class="profile-card">
    <div class="profile-avatar">
      <img v-if="user.avatarUrl" :src="user.avatarUrl" :alt="user.name" />
      <div v-else class="avatar-placeholder">{{ user.name.charAt(0).toUpperCase() }}</div>
    </div>
    <div class="profile-info">
      <h2>{{ user.name }}</h2>
      <p class="profile-email">{{ user.email }}</p>
      <p v-if="user.description" class="profile-description">{{ user.description }}</p>
      <p v-else class="profile-description text-muted">No description added yet.</p>
    </div>
    <button class="btn-primary" @click="$emit('edit')">Edit Profile</button>
  </div>
</template>

<style scoped>
.profile-card {
  background-color: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  text-align: center;
}

.profile-avatar img {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid var(--primary);
}

.avatar-placeholder {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-color: var(--primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  font-weight: 700;
}

.profile-info h2 {
  font-size: 22px;
  margin-bottom: 4px;
}

.profile-email {
  color: var(--text-muted);
  font-size: 14px;
}

.profile-description {
  margin-top: 12px;
  font-size: 14px;
  line-height: 1.6;
}

.text-muted {
  color: var(--text-muted);
  font-style: italic;
}
</style>
