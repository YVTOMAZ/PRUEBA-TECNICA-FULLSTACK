import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import LoginForm from '../LoginForm.vue';

describe('LoginForm', () => {
  it('renders email and password inputs', () => {
    const wrapper = mount(LoginForm);

    expect(wrapper.find('input[type="email"]').exists()).toBe(true);
    expect(wrapper.find('input[type="password"]').exists()).toBe(true);
  });

  it('renders submit button with correct text', () => {
    const wrapper = mount(LoginForm, { props: { loading: false } });

    const button = wrapper.find('button[type="submit"]');
    expect(button.text()).toBe('Login');
  });

  it('shows loading text when loading', () => {
    const wrapper = mount(LoginForm, { props: { loading: true } });

    const button = wrapper.find('button[type="submit"]');
    expect(button.text()).toBe('Loading...');
    expect(button.attributes('disabled')).toBeDefined();
  });

  it('shows error message when provided', () => {
    const wrapper = mount(LoginForm, { props: { error: 'Invalid credentials' } });

    expect(wrapper.text()).toContain('Invalid credentials');
  });

  it('emits submit event with email and password', async () => {
    const wrapper = mount(LoginForm);

    await wrapper.find('input[type="email"]').setValue('test@example.com');
    await wrapper.find('input[type="password"]').setValue('password123');
    await wrapper.find('form').trigger('submit');

    expect(wrapper.emitted('submit')).toBeTruthy();
    expect(wrapper.emitted('submit')![0]).toEqual(['test@example.com', 'password123']);
  });

  it('does not emit submit with empty fields', async () => {
    const wrapper = mount(LoginForm);

    await wrapper.find('form').trigger('submit');

    expect(wrapper.emitted('submit')).toBeFalsy();
  });
});
