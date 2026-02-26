<script setup lang="ts">
import type { CoinDetail } from '../types';
import AppModal from './AppModal.vue';

defineProps<{
  coin: CoinDetail | null;
  open: boolean;
  loading: boolean;
}>();

defineEmits<{
  close: [];
}>();

function formatPrice(value: number): string {
  if (value >= 1) return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  return `$${value.toPrecision(4)}`;
}

function formatNumber(value: number): string {
  if (value >= 1e12) return `${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
  return value.toLocaleString();
}
</script>

<template>
  <AppModal :open="open" @close="$emit('close')">
    <div v-if="loading" class="loading">Loading...</div>
    <div v-else-if="coin" class="detail">
      <div class="detail-header">
        <img :src="coin.logo" :alt="coin.name" class="detail-logo" />
        <div>
          <h2>{{ coin.name }} <span class="symbol">{{ coin.symbol }}</span></h2>
          <span class="rank">Rank #{{ coin.rank }}</span>
        </div>
      </div>

      <p v-if="coin.description" class="description">{{ coin.description }}</p>

      <div class="stats-grid">
        <div class="stat">
          <span class="stat-label">Price</span>
          <span class="stat-value">{{ formatPrice(coin.price) }}</span>
        </div>
        <div class="stat">
          <span class="stat-label">Market Cap</span>
          <span class="stat-value">${{ formatNumber(coin.marketCap) }}</span>
        </div>
        <div class="stat">
          <span class="stat-label">Volume (24h)</span>
          <span class="stat-value">${{ formatNumber(coin.volume24h) }}</span>
        </div>
        <div class="stat">
          <span class="stat-label">Change (24h)</span>
          <span :class="['stat-value', coin.percentChange24h >= 0 ? 'positive' : 'negative']">
            {{ coin.percentChange24h >= 0 ? '+' : '' }}{{ coin.percentChange24h.toFixed(2) }}%
          </span>
        </div>
        <div class="stat">
          <span class="stat-label">Change (7d)</span>
          <span :class="['stat-value', coin.percentChange7d >= 0 ? 'positive' : 'negative']">
            {{ coin.percentChange7d >= 0 ? '+' : '' }}{{ coin.percentChange7d.toFixed(2) }}%
          </span>
        </div>
        <div class="stat">
          <span class="stat-label">ATH Price</span>
          <span class="stat-value">{{ formatPrice(coin.athPrice) }}</span>
        </div>
        <div class="stat">
          <span class="stat-label">Total Supply</span>
          <span class="stat-value">{{ formatNumber(coin.totalSupply) }}</span>
        </div>
        <div class="stat">
          <span class="stat-label">Max Supply</span>
          <span class="stat-value">{{ coin.maxSupply ? formatNumber(coin.maxSupply) : 'N/A' }}</span>
        </div>
      </div>

      <div v-if="coin.tags?.length" class="tags">
        <span v-for="tag in coin.tags" :key="tag" class="tag">{{ tag }}</span>
      </div>

      <div class="meta">
        <span v-if="coin.proofType">Proof: {{ coin.proofType }}</span>
        <span v-if="coin.hashAlgorithm">Algorithm: {{ coin.hashAlgorithm }}</span>
        <span v-if="coin.startedAt">Started: {{ new Date(coin.startedAt).toLocaleDateString() }}</span>
      </div>
    </div>
  </AppModal>
</template>

<style scoped>
.loading {
  text-align: center;
  padding: 40px;
  color: var(--text-muted);
}

.detail-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.detail-logo {
  width: 56px;
  height: 56px;
  border-radius: 50%;
}

.detail-header h2 {
  font-size: 22px;
}

.symbol {
  color: var(--text-muted);
  font-weight: 400;
  font-size: 16px;
}

.rank {
  color: var(--text-muted);
  font-size: 13px;
}

.description {
  font-size: 14px;
  line-height: 1.6;
  color: var(--text-muted);
  margin-bottom: 20px;
  max-height: 120px;
  overflow-y: auto;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}

.stat {
  background-color: var(--bg-input);
  border-radius: var(--radius);
  padding: 12px;
}

.stat-label {
  display: block;
  font-size: 12px;
  color: var(--text-muted);
  margin-bottom: 4px;
}

.stat-value {
  font-size: 15px;
  font-weight: 600;
}

.positive { color: var(--success); }
.negative { color: var(--danger); }

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.tag {
  background-color: var(--primary);
  color: white;
  font-size: 11px;
  padding: 3px 10px;
  border-radius: 12px;
}

.meta {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  font-size: 12px;
  color: var(--text-muted);
}
</style>
