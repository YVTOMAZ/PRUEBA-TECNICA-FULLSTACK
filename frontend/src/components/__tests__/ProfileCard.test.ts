import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import ProfileCard from '../ProfileCard.vue';
import type { User } from '../../types';

const mockUser: User = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  description: 'A crypto enthusiast.',
  avatarUrl: null,
};

describe('ProfileCard', () => {
  it('renders user name', () => {
    const wrapper = mount(ProfileCard, { props: { user: mockUser } });

    expect(wrapper.text()).toContain('John Doe');
  });

  it('renders user email', () => {
    const wrapper = mount(ProfileCard, { props: { user: mockUser } });

    expect(wrapper.text()).toContain('john@example.com');
  });

  it('renders user description', () => {
    const wrapper = mount(ProfileCard, { props: { user: mockUser } });

    expect(wrapper.text()).toContain('A crypto enthusiast.');
  });

  it('shows placeholder when no avatar', () => {
    const wrapper = mount(ProfileCard, { props: { user: mockUser } });

    const placeholder = wrapper.find('.avatar-placeholder');
    expect(placeholder.exists()).toBe(true);
    expect(placeholder.text()).toBe('J');
  });

  it('shows avatar image when avatarUrl is provided', () => {
    const userWithAvatar = { ...mockUser, avatarUrl: '/api/uploads/avatar.png' };
    const wrapper = mount(ProfileCard, { props: { user: userWithAvatar } });

    const img = wrapper.find('.profile-avatar img');
    expect(img.exists()).toBe(true);
    expect(img.attributes('src')).toBe('/api/uploads/avatar.png');
  });

  it('emits edit event when button clicked', async () => {
    const wrapper = mount(ProfileCard, { props: { user: mockUser } });

    await wrapper.find('button').trigger('click');

    expect(wrapper.emitted('edit')).toBeTruthy();
  });

  it('shows placeholder text when no description', () => {
    const userNoDesc = { ...mockUser, description: '' };
    const wrapper = mount(ProfileCard, { props: { user: userNoDesc } });

    expect(wrapper.text()).toContain('No description added yet.');
  });
});
