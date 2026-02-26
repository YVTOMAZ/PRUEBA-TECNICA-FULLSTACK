<script setup lang="ts">
import type { CoinListItem } from '../types';

defineProps<{
  coin: CoinListItem;
}>();

defineEmits<{
  click: [id: string];
}>();

function formatPrice(value: number): string {
  if (value >= 1) return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  return `$${value.toPrecision(4)}`;
}

function formatMarketCap(value: number): string {
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
  return `$${value.toLocaleString()}`;
}
</script>

<template>
  <div class="crypto-card" @click="$emit('click', coin.id)" role="button" tabindex="0">
    <div class="card-header">
      <img :src="coin.logo" :alt="coin.name" class="coin-logo" />
      <div class="coin-identity">
        <span class="coin-name">{{ coin.name }}</span>
        <span class="coin-symbol">{{ coin.symbol }}</span>
      </div>
      <span class="coin-rank">#{{ coin.rank }}</span>
    </div>
    <div class="card-body">
      <div class="price">{{ formatPrice(coin.price) }}</div>
      <div class="stats">
        <span :class="['change', coin.percentChange24h >= 0 ? 'positive' : 'negative']">
          {{ coin.percentChange24h >= 0 ? '+' : '' }}{{ coin.percentChange24h.toFixed(2) }}%
        </span>
        <span class="market-cap">MCap {{ formatMarketCap(coin.marketCap) }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.crypto-card {
  background-color: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: border-color 0.2s, transform 0.2s;
}

.crypto-card:hover {
  border-color: var(--primary);
  transform: translateY(-2px);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.coin-logo {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.coin-identity {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.coin-name {
  font-weight: 600;
  font-size: 15px;
}

.coin-symbol {
  font-size: 12px;
  color: var(--text-muted);
}

.coin-rank {
  font-size: 12px;
  color: var(--text-muted);
  background-color: var(--bg-input);
  padding: 2px 8px;
  border-radius: 4px;
}

.card-body .price {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 8px;
}

.stats {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
}

.change {
  font-weight: 600;
}

.positive {
  color: var(--success);
}

.negative {
  color: var(--danger);
}

.market-cap {
  color: var(--text-muted);
}
</style>
