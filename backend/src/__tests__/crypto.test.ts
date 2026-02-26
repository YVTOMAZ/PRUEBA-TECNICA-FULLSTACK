import request from 'supertest';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import app from '../app';
import { env } from '../config/env';
import * as cryptoService from '../services/crypto.service';

jest.mock('../models/user.model');
jest.mock('../services/crypto.service');

const userId = new mongoose.Types.ObjectId().toString();

function makeToken() {
  return jwt.sign({ userId }, env.JWT_SECRET, { expiresIn: '1h' } as jwt.SignOptions);
}

const mockCoinsResponse = {
  data: [
    { id: 'btc-bitcoin', name: 'Bitcoin', symbol: 'BTC', rank: 1, type: 'coin', isActive: true, logo: 'https://static.coinpaprika.com/coin/btc-bitcoin/logo.png', price: 50000, marketCap: 1000000000, volume24h: 50000000, percentChange24h: 2.5 },
    { id: 'eth-ethereum', name: 'Ethereum', symbol: 'ETH', rank: 2, type: 'coin', isActive: true, logo: 'https://static.coinpaprika.com/coin/eth-ethereum/logo.png', price: 3000, marketCap: 500000000, volume24h: 25000000, percentChange24h: 1.5 },
    { id: 'usdt-tether', name: 'Tether', symbol: 'USDT', rank: 3, type: 'token', isActive: true, logo: 'https://static.coinpaprika.com/coin/usdt-tether/logo.png', price: 1, marketCap: 80000000, volume24h: 60000000, percentChange24h: 0.01 },
    { id: 'bnb-binance-coin', name: 'Binance Coin', symbol: 'BNB', rank: 4, type: 'coin', isActive: true, logo: 'https://static.coinpaprika.com/coin/bnb-binance-coin/logo.png', price: 400, marketCap: 60000000, volume24h: 10000000, percentChange24h: 3.0 },
    { id: 'sol-solana', name: 'Solana', symbol: 'SOL', rank: 5, type: 'coin', isActive: true, logo: 'https://static.coinpaprika.com/coin/sol-solana/logo.png', price: 150, marketCap: 50000000, volume24h: 8000000, percentChange24h: 4.0 },
  ],
  total: 5,
  page: 1,
  limit: 10,
};

const mockCoinDetail = {
  id: 'btc-bitcoin',
  name: 'Bitcoin',
  symbol: 'BTC',
  rank: 1,
  type: 'coin',
  isActive: true,
  description: 'Bitcoin is a cryptocurrency.',
  logo: 'https://static.coinpaprika.com/coin/btc-bitcoin/logo.png',
  startedAt: '2009-01-03T00:00:00Z',
  proofType: 'Proof of Work',
  hashAlgorithm: 'SHA-256',
  tags: ['Cryptocurrency'],
  price: 50000,
  marketCap: 1000000000,
  volume24h: 50000000,
  percentChange24h: 2.5,
  percentChange7d: 5.0,
  totalSupply: 21000000,
  maxSupply: 21000000,
  athPrice: 69000,
  athDate: '2021-11-10T00:00:00Z',
};

afterEach(() => {
  jest.clearAllMocks();
});

describe('GET /api/crypto', () => {
  it('should return 401 without token', async () => {
    const res = await request(app).get('/api/crypto');
    expect(res.status).toBe(401);
  });

  it('should return list of cryptocurrencies', async () => {
    (cryptoService.getCoins as jest.Mock).mockResolvedValue(mockCoinsResponse);

    const res = await request(app)
      .get('/api/crypto')
      .set('Authorization', `Bearer ${makeToken()}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(5);
    expect(res.body.total).toBe(5);
    expect(res.body.page).toBe(1);
  });

  it('should pass search parameter to service', async () => {
    (cryptoService.getCoins as jest.Mock).mockResolvedValue({
      data: [mockCoinsResponse.data[0]],
      total: 1,
      page: 1,
      limit: 10,
    });

    const res = await request(app)
      .get('/api/crypto?search=bitcoin')
      .set('Authorization', `Bearer ${makeToken()}`);

    expect(res.status).toBe(200);
    expect(cryptoService.getCoins).toHaveBeenCalledWith('bitcoin', 1, 10);
  });

  it('should support pagination parameters', async () => {
    (cryptoService.getCoins as jest.Mock).mockResolvedValue({
      data: mockCoinsResponse.data.slice(0, 2),
      total: 5,
      page: 1,
      limit: 2,
    });

    const res = await request(app)
      .get('/api/crypto?page=1&limit=2')
      .set('Authorization', `Bearer ${makeToken()}`);

    expect(res.status).toBe(200);
    expect(cryptoService.getCoins).toHaveBeenCalledWith(undefined, 1, 2);
  });
});

describe('GET /api/crypto/:id', () => {
  it('should return 401 without token', async () => {
    const res = await request(app).get('/api/crypto/btc-bitcoin');
    expect(res.status).toBe(401);
  });

  it('should return coin details', async () => {
    (cryptoService.getCoinById as jest.Mock).mockResolvedValue(mockCoinDetail);

    const res = await request(app)
      .get('/api/crypto/btc-bitcoin')
      .set('Authorization', `Bearer ${makeToken()}`);

    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Bitcoin');
    expect(res.body.description).toBe('Bitcoin is a cryptocurrency.');
    expect(res.body.tags).toContain('Cryptocurrency');
  });

  it('should return 404 for unknown coin', async () => {
    const { AppError } = require('../middleware/error.middleware');
    (cryptoService.getCoinById as jest.Mock).mockRejectedValue(
      new AppError(404, 'Cryptocurrency not found.'),
    );

    const res = await request(app)
      .get('/api/crypto/unknown-coin')
      .set('Authorization', `Bearer ${makeToken()}`);

    expect(res.status).toBe(404);
  });
});
