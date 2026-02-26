<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
  modelValue: string;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string];
  search: [];
}>();

const localValue = ref(props.modelValue);
let debounceTimer: ReturnType<typeof setTimeout>;

watch(() => props.modelValue, (val) => {
  localValue.value = val;
});

function handleInput() {
  emit('update:modelValue', localValue.value);
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    emit('search');
  }, 400);
}
</script>

<template>
  <div class="search-bar">
    <input
      v-model="localValue"
      type="text"
      placeholder="Search by name, symbol or type..."
      @input="handleInput"
    />
  </div>
</template>

<style scoped>
.search-bar {
  margin-bottom: 24px;
}

.search-bar input {
  max-width: 400px;
}
</style>
