import axios from 'axios';
import { env } from '../config/env';
import { CoinListItem, CoinDetail, PaginatedResponse } from '../types';
import { AppError } from '../middleware/error.middleware';

const api = axios.create({ baseURL: env.COINPAPRIKA_BASE_URL });

// Simple in-memory cache with TTL
interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry<unknown>>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (entry && entry.expiresAt > Date.now()) {
    return entry.data as T;
  }
  cache.delete(key);
  return null;
}

function setCache<T>(key: string, data: T): void {
  cache.set(key, { data, expiresAt: Date.now() + CACHE_TTL });
}

interface CoinPaprikaCoin {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  type: string;
  is_active: boolean;
}

interface CoinPaprikaTicker {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  total_supply: number;
  max_supply: number;
  quotes: {
    USD: {
      price: number;
      market_cap: number;
      volume_24h: number;
      percent_change_24h: number;
      percent_change_7d: number;
      ath_price: number;
      ath_date: string;
    };
  };
}

interface CoinPaprikaDetail {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  type: string;
  is_active: boolean;
  description: string;
  started_at: string | null;
  proof_type: string | null;
  hash_algorithm: string | null;
  logo: string;
  tags: Array<{ id: string; name: string }>;
}

async function fetchTopCoins(): Promise<CoinPaprikaCoin[]> {
  const cached = getCached<CoinPaprikaCoin[]>('coins');
  if (cached) return cached;

  const { data } = await api.get<CoinPaprikaCoin[]>('/coins');
  const activeCoins = data.filter((c) => c.is_active).slice(0, 100);
  setCache('coins', activeCoins);
  return activeCoins;
}

async function fetchTickers(): Promise<CoinPaprikaTicker[]> {
  const cached = getCached<CoinPaprikaTicker[]>('tickers');
  if (cached) return cached;

  const { data } = await api.get<CoinPaprikaTicker[]>('/tickers?limit=100');
  setCache('tickers', data);
  return data;
}

export async function getCoins(
  search?: string,
  page = 1,
  limit = 10,
): Promise<PaginatedResponse<CoinListItem>> {
  try {
    const [coins, tickers] = await Promise.all([fetchTopCoins(), fetchTickers()]);

    const tickerMap = new Map(tickers.map((t) => [t.id, t]));

    let result: CoinListItem[] = coins.map((coin) => {
      const ticker = tickerMap.get(coin.id);
      return {
        id: coin.id,
        name: coin.name,
        symbol: coin.symbol,
        rank: coin.rank,
        type: coin.type,
        isActive: coin.is_active,
        logo: `https://static.coinpaprika.com/coin/${coin.id}/logo.png`,
        price: ticker?.quotes?.USD?.price ?? 0,
        marketCap: ticker?.quotes?.USD?.market_cap ?? 0,
        volume24h: ticker?.quotes?.USD?.volume_24h ?? 0,
        percentChange24h: ticker?.quotes?.USD?.percent_change_24h ?? 0,
      };
    });

    if (search) {
      const term = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(term) ||
          c.symbol.toLowerCase().includes(term) ||
          c.type.toLowerCase().includes(term),
      );
    }

    const total = result.length;
    const start = (page - 1) * limit;
    const paginated = result.slice(start, start + limit);

    return { data: paginated, total, page, limit };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      throw new AppError(502, 'Failed to fetch data from CoinPaprika API.');
    }
    throw err;
  }
}

export async function getCoinById(coinId: string): Promise<CoinDetail> {
  const cacheKey = `coin:${coinId}`;
  const cached = getCached<CoinDetail>(cacheKey);
  if (cached) return cached;

  try {
    const [detailRes, tickerRes] = await Promise.all([
      api.get<CoinPaprikaDetail>(`/coins/${coinId}`),
      api.get<CoinPaprikaTicker>(`/tickers/${coinId}`),
    ]);

    const detail = detailRes.data;
    const ticker = tickerRes.data;
    const usd = ticker.quotes?.USD;

    const result: CoinDetail = {
      id: detail.id,
      name: detail.name,
      symbol: detail.symbol,
      rank: detail.rank,
      type: detail.type,
      isActive: detail.is_active,
      description: detail.description || '',
      logo: `https://static.coinpaprika.com/coin/${detail.id}/logo.png`,
      startedAt: detail.started_at,
      proofType: detail.proof_type,
      hashAlgorithm: detail.hash_algorithm,
      tags: detail.tags?.map((t) => t.name) ?? [],
      price: usd?.price ?? 0,
      marketCap: usd?.market_cap ?? 0,
      volume24h: usd?.volume_24h ?? 0,
      percentChange24h: usd?.percent_change_24h ?? 0,
      percentChange7d: usd?.percent_change_7d ?? 0,
      totalSupply: ticker.total_supply ?? 0,
      maxSupply: ticker.max_supply ?? 0,
      athPrice: usd?.ath_price ?? 0,
      athDate: usd?.ath_date ?? null,
    };

    setCache(cacheKey, result);
    return result;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 404) {
      throw new AppError(404, 'Cryptocurrency not found.');
    }
    if (axios.isAxiosError(err)) {
      throw new AppError(502, 'Failed to fetch data from CoinPaprika API.');
    }
    throw err;
  }
}
