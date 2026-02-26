<script setup lang="ts">
import { ref } from 'vue';
import { uploadAvatarApi } from '../api/user';
import { resolveAvatarUrl } from '../api';

const props = defineProps<{
  currentUrl: string | null;
}>();

const emit = defineEmits<{
  uploaded: [url: string];
}>();

const uploading = ref(false);
const fileInput = ref<HTMLInputElement>();

async function handleFileChange(event: Event) {
  const input = event.target as HTMLInputElement;
  if (!input.files?.length) return;

  uploading.value = true;
  try {
    const { data } = await uploadAvatarApi(input.files[0]);
    emit('uploaded', data.avatarUrl);
  } catch {
    // Error handled by interceptor
  } finally {
    uploading.value = false;
  }
}
</script>

<template>
  <div class="avatar-upload">
    <div class="avatar-preview" @click="fileInput?.click()">
      <img v-if="currentUrl" :src="resolveAvatarUrl(currentUrl)!" alt="Avatar" />
      <span v-else class="upload-icon">+</span>
      <div class="avatar-overlay">{{ uploading ? 'Uploading...' : 'Change' }}</div>
    </div>
    <input
      ref="fileInput"
      type="file"
      accept="image/jpeg,image/png,image/gif,image/webp"
      style="display: none;"
      @change="handleFileChange"
    />
  </div>
</template>

<style scoped>
.avatar-upload {
  display: flex;
  justify-content: center;
}

.avatar-preview {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  position: relative;
  border: 2px solid var(--border);
  background-color: var(--bg-input);
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.upload-icon {
  font-size: 32px;
  color: var(--text-muted);
}

.avatar-overlay {
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  opacity: 0;
  transition: opacity 0.2s;
}

.avatar-preview:hover .avatar-overlay {
  opacity: 1;
}
</style>
