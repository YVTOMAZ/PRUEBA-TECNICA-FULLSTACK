import api from './index';
import type { CoinListItem, CoinDetail, PaginatedResponse } from '../types';

export function getCoinsApi(params: { search?: string; page?: number; limit?: number }) {
  return api.get<PaginatedResponse<CoinListItem>>('/crypto', { params });
}

export function getCoinByIdApi(id: string) {
  return api.get<CoinDetail>(`/crypto/${id}`);
}
