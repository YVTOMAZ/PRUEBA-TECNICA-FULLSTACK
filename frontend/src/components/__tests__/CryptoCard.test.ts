import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import CryptoCard from '../CryptoCard.vue';
import type { CoinListItem } from '../../types';

const mockCoin: CoinListItem = {
  id: 'btc-bitcoin',
  name: 'Bitcoin',
  symbol: 'BTC',
  rank: 1,
  type: 'coin',
  isActive: true,
  logo: 'https://static.coinpaprika.com/coin/btc-bitcoin/logo.png',
  price: 50000,
  marketCap: 1000000000000,
  volume24h: 50000000000,
  percentChange24h: 2.5,
};

describe('CryptoCard', () => {
  it('renders coin name and symbol', () => {
    const wrapper = mount(CryptoCard, { props: { coin: mockCoin } });

    expect(wrapper.text()).toContain('Bitcoin');
    expect(wrapper.text()).toContain('BTC');
  });

  it('renders coin rank', () => {
    const wrapper = mount(CryptoCard, { props: { coin: mockCoin } });

    expect(wrapper.text()).toContain('#1');
  });

  it('renders formatted price', () => {
    const wrapper = mount(CryptoCard, { props: { coin: mockCoin } });

    expect(wrapper.text()).toContain('$50,000.00');
  });

  it('shows positive change in green', () => {
    const wrapper = mount(CryptoCard, { props: { coin: mockCoin } });

    const change = wrapper.find('.positive');
    expect(change.exists()).toBe(true);
    expect(change.text()).toContain('+2.50%');
  });

  it('shows negative change in red', () => {
    const negativeCoin = { ...mockCoin, percentChange24h: -3.5 };
    const wrapper = mount(CryptoCard, { props: { coin: negativeCoin } });

    const change = wrapper.find('.negative');
    expect(change.exists()).toBe(true);
    expect(change.text()).toContain('-3.50%');
  });

  it('emits click with coin id when clicked', async () => {
    const wrapper = mount(CryptoCard, { props: { coin: mockCoin } });

    await wrapper.trigger('click');

    expect(wrapper.emitted('click')).toBeTruthy();
    expect(wrapper.emitted('click')![0]).toEqual(['btc-bitcoin']);
  });

  it('renders coin logo', () => {
    const wrapper = mount(CryptoCard, { props: { coin: mockCoin } });

    const img = wrapper.find('img');
    expect(img.exists()).toBe(true);
    expect(img.attributes('src')).toBe(mockCoin.logo);
  });
});
