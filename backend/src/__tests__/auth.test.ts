import request from 'supertest';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import app from '../app';
import { User } from '../models/user.model';

jest.mock('../models/user.model');

const userId = new mongoose.Types.ObjectId().toString();

function makeMockUser(overrides = {}) {
  return {
    _id: userId,
    name: 'John Doe',
    email: 'john@example.com',
    password: '',
    description: '',
    avatarUrl: null,
    toJSON() {
      const { password, ...rest } = this as Record<string, unknown>;
      return rest;
    },
    ...overrides,
  };
}

afterEach(() => {
  jest.clearAllMocks();
});

describe('POST /api/auth/register', () => {
  it('should register a new user and return token', async () => {
    (User.findOne as jest.Mock).mockResolvedValue(null);
    (User.create as jest.Mock).mockImplementation(async (data: Record<string, unknown>) => {
      return makeMockUser({ name: data.name, email: data.email, password: data.password });
    });

    const res = await request(app).post('/api/auth/register').send({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
    });

    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.name).toBe('John Doe');
    expect(res.body.user.email).toBe('john@example.com');
    expect(res.body.user.password).toBeUndefined();
  });

  it('should return 409 if email already exists', async () => {
    (User.findOne as jest.Mock).mockResolvedValue(makeMockUser());

    const res = await request(app).post('/api/auth/register').send({
      name: 'Jane',
      email: 'john@example.com',
      password: '654321',
    });

    expect(res.status).toBe(409);
    expect(res.body.message).toContain('already registered');
  });

  it('should return 422 for invalid data', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: '',
      email: 'invalid',
      password: '12',
    });

    expect(res.status).toBe(422);
  });
});

describe('POST /api/auth/login', () => {
  it('should login with valid credentials', async () => {
    const hashedPassword = await bcrypt.hash('123456', 10);
    const mockUser = makeMockUser({ password: hashedPassword });

    (User.findOne as jest.Mock).mockReturnValue({
      select: jest.fn().mockResolvedValue(mockUser),
    });

    const res = await request(app).post('/api/auth/login').send({
      email: 'john@example.com',
      password: '123456',
    });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    const decoded = jwt.decode(res.body.token) as Record<string, unknown>;
    expect(decoded.userId).toBeDefined();
  });

  it('should return 401 for wrong password', async () => {
    const hashedPassword = await bcrypt.hash('123456', 10);
    const mockUser = makeMockUser({ password: hashedPassword });

    (User.findOne as jest.Mock).mockReturnValue({
      select: jest.fn().mockResolvedValue(mockUser),
    });

    const res = await request(app).post('/api/auth/login').send({
      email: 'john@example.com',
      password: 'wrongpassword',
    });

    expect(res.status).toBe(401);
    expect(res.body.message).toContain('Invalid');
  });

  it('should return 401 for non-existing email', async () => {
    (User.findOne as jest.Mock).mockReturnValue({
      select: jest.fn().mockResolvedValue(null),
    });

    const res = await request(app).post('/api/auth/login').send({
      email: 'nobody@example.com',
      password: '123456',
    });

    expect(res.status).toBe(401);
  });
});
