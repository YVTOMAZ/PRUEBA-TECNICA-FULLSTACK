<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import { updateMeApi } from '../api/user';
import ProfileCard from '../components/ProfileCard.vue';
import ProfileEditForm from '../components/ProfileEditForm.vue';
import AvatarUpload from '../components/AvatarUpload.vue';

const authStore = useAuthStore();
const editing = ref(false);
const loading = ref(false);
const error = ref('');

onMounted(() => {
  authStore.fetchUser();
});

async function handleSave(data: { name: string; email: string; description: string }) {
  loading.value = true;
  error.value = '';
  try {
    const { data: updated } = await updateMeApi(data);
    authStore.user = updated;
    editing.value = false;
  } catch (err: unknown) {
    const axiosErr = err as { response?: { data?: { message?: string } } };
    error.value = axiosErr.response?.data?.message || 'Update failed.';
  } finally {
    loading.value = false;
  }
}

function handleAvatarUploaded(url: string) {
  if (authStore.user) {
    authStore.user = { ...authStore.user, avatarUrl: url };
  }
}
</script>

<template>
  <div class="profile-page">
    <h1 class="page-title">Profile</h1>

    <div v-if="!authStore.user" class="loading">Loading profile...</div>

    <template v-else>
      <div v-if="!editing">
        <ProfileCard :user="authStore.user" @edit="editing = true" />
      </div>

      <div v-else class="edit-section">
        <div class="edit-card">
          <h2>Edit Profile</h2>
          <AvatarUpload
            :current-url="authStore.user.avatarUrl"
            @uploaded="handleAvatarUploaded"
          />
          <ProfileEditForm
            :user="authStore.user"
            :loading="loading"
            :error="error"
            @save="handleSave"
            @cancel="editing = false"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.profile-page {
  max-width: 600px;
  margin: 0 auto;
}

.loading {
  text-align: center;
  padding: 40px;
  color: var(--text-muted);
}

.edit-card {
  background-color: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 32px;
}

.edit-card h2 {
  margin-bottom: 20px;
  font-size: 20px;
}
</style>
