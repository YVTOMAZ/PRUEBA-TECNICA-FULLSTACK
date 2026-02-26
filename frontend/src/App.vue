<script setup lang="ts">
import AppNavbar from './components/AppNavbar.vue';
</script>

<template>
  <AppNavbar />
  <main class="container" style="padding-top: 80px; padding-bottom: 40px;">
    <router-view />
  </main>
</template>
