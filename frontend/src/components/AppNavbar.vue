<script setup lang="ts">
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

function handleLogout() {
  authStore.logout();
  router.push('/login');
}
</script>

<template>
  <nav class="navbar">
    <div class="navbar-content container">
      <router-link to="/" class="navbar-brand">CryptoApp</router-link>
      <div class="navbar-links" v-if="authStore.isAuthenticated">
        <router-link to="/crypto">Cryptocurrencies</router-link>
        <router-link to="/profile">Profile</router-link>
        <button class="btn-secondary" @click="handleLogout">Logout</button>
      </div>
      <div class="navbar-links" v-else>
        <router-link to="/login">Login</router-link>
        <router-link to="/register">Register</router-link>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background-color: var(--bg-card);
  border-bottom: 1px solid var(--border);
  z-index: 100;
}

.navbar-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
}

.navbar-brand {
  font-size: 18px;
  font-weight: 700;
  color: var(--primary);
}

.navbar-brand:hover {
  text-decoration: none;
}

.navbar-links {
  display: flex;
  align-items: center;
  gap: 20px;
}

.navbar-links a {
  font-size: 14px;
  color: var(--text-muted);
  transition: color 0.2s;
}

.navbar-links a:hover,
.navbar-links a.router-link-active {
  color: var(--text);
  text-decoration: none;
}
</style>
