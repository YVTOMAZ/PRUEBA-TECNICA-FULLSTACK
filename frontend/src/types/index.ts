export interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  description: string;
  avatarUrl: string | null;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface CoinListItem {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  type: string;
  isActive: boolean;
  logo: string;
  price: number;
  marketCap: number;
  volume24h: number;
  percentChange24h: number;
}

export interface CoinDetail extends CoinListItem {
  description: string;
  startedAt: string | null;
  proofType: string | null;
  hashAlgorithm: string | null;
  tags: string[];
  percentChange7d: number;
  totalSupply: number;
  maxSupply: number;
  athPrice: number;
  athDate: string | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
