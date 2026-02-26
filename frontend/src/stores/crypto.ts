import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { CoinListItem, CoinDetail } from '../types';
import { getCoinsApi, getCoinByIdApi } from '../api/crypto';

export const useCryptoStore = defineStore('crypto', () => {
  const coins = ref<CoinListItem[]>([]);
  const selectedCoin = ref<CoinDetail | null>(null);
  const total = ref(0);
  const page = ref(1);
  const limit = ref(10);
  const search = ref('');
  const loading = ref(false);

  async function fetchCoins() {
    loading.value = true;
    try {
      const { data } = await getCoinsApi({
        search: search.value || undefined,
        page: page.value,
        limit: limit.value,
      });
      coins.value = data.data;
      total.value = data.total;
    } finally {
      loading.value = false;
    }
  }

  async function fetchCoinDetail(id: string) {
    loading.value = true;
    try {
      const { data } = await getCoinByIdApi(id);
      selectedCoin.value = data;
    } finally {
      loading.value = false;
    }
  }

  function setSearch(value: string) {
    search.value = value;
    page.value = 1;
  }

  function setPage(value: number) {
    page.value = value;
  }

  function clearSelectedCoin() {
    selectedCoin.value = null;
  }

  return {
    coins, selectedCoin, total, page, limit, search, loading,
    fetchCoins, fetchCoinDetail, setSearch, setPage, clearSelectedCoin,
  };
});
