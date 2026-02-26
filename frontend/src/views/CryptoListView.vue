<script setup lang="ts">
import { onMounted, watch } from 'vue';
import { useCryptoStore } from '../stores/crypto';
import CryptoCard from '../components/CryptoCard.vue';
import CryptoDetailModal from '../components/CryptoDetailModal.vue';
import CryptoSearchBar from '../components/CryptoSearchBar.vue';

const cryptoStore = useCryptoStore();

onMounted(() => {
  cryptoStore.fetchCoins();
});

function handleCardClick(id: string) {
  cryptoStore.fetchCoinDetail(id);
}

function handleSearch() {
  cryptoStore.fetchCoins();
}

function handlePageChange(newPage: number) {
  cryptoStore.setPage(newPage);
  cryptoStore.fetchCoins();
}

const totalPages = () => Math.ceil(cryptoStore.total / cryptoStore.limit);
</script>

<template>
  <div class="crypto-page">
    <h1 class="page-title">Cryptocurrencies</h1>

    <CryptoSearchBar
      :model-value="cryptoStore.search"
      @update:model-value="cryptoStore.setSearch($event)"
      @search="handleSearch"
    />

    <div v-if="cryptoStore.loading && !cryptoStore.coins.length" class="loading">
      Loading cryptocurrencies...
    </div>

    <div v-else-if="!cryptoStore.coins.length" class="empty">
      No cryptocurrencies found.
    </div>

    <div v-else class="crypto-grid">
      <CryptoCard
        v-for="coin in cryptoStore.coins"
        :key="coin.id"
        :coin="coin"
        @click="handleCardClick"
      />
    </div>

    <div v-if="totalPages() > 1" class="pagination">
      <button
        class="btn-secondary"
        :disabled="cryptoStore.page <= 1"
        @click="handlePageChange(cryptoStore.page - 1)"
      >
        Previous
      </button>
      <span class="page-info">Page {{ cryptoStore.page }} of {{ totalPages() }}</span>
      <button
        class="btn-secondary"
        :disabled="cryptoStore.page >= totalPages()"
        @click="handlePageChange(cryptoStore.page + 1)"
      >
        Next
      </button>
    </div>

    <CryptoDetailModal
      :coin="cryptoStore.selectedCoin"
      :open="!!cryptoStore.selectedCoin"
      :loading="cryptoStore.loading && !!cryptoStore.selectedCoin"
      @close="cryptoStore.clearSelectedCoin()"
    />
  </div>
</template>

<style scoped>
.crypto-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.loading, .empty {
  text-align: center;
  padding: 60px 0;
  color: var(--text-muted);
  font-size: 16px;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-top: 32px;
}

.page-info {
  font-size: 14px;
  color: var(--text-muted);
}
</style>
