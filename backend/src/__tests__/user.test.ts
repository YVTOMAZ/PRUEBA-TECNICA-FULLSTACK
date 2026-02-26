import request from 'supertest';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import app from '../app';
import { User } from '../models/user.model';
import { env } from '../config/env';

jest.mock('../models/user.model');

const userId = new mongoose.Types.ObjectId().toString();

function makeToken() {
  return jwt.sign({ userId }, env.JWT_SECRET, { expiresIn: '1h' } as jwt.SignOptions);
}

function makeMockUser(overrides = {}) {
  return {
    _id: userId,
    name: 'Test User',
    email: 'test@example.com',
    description: '',
    avatarUrl: null,
    toJSON() {
      return {
        _id: this._id,
        name: this.name,
        email: this.email,
        description: this.description,
        avatarUrl: this.avatarUrl,
      };
    },
    ...overrides,
  };
}

afterEach(() => {
  jest.clearAllMocks();
});

describe('GET /api/users/me', () => {
  it('should return user profile when authenticated', async () => {
    (User.findById as jest.Mock).mockResolvedValue(makeMockUser());

    const res = await request(app)
      .get('/api/users/me')
      .set('Authorization', `Bearer ${makeToken()}`);

    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Test User');
    expect(res.body.email).toBe('test@example.com');
  });

  it('should return 401 without token', async () => {
    const res = await request(app).get('/api/users/me');
    expect(res.status).toBe(401);
  });

  it('should return 401 with invalid token', async () => {
    const res = await request(app)
      .get('/api/users/me')
      .set('Authorization', 'Bearer invalid-token');
    expect(res.status).toBe(401);
  });

  it('should return 404 if user not found', async () => {
    (User.findById as jest.Mock).mockResolvedValue(null);

    const res = await request(app)
      .get('/api/users/me')
      .set('Authorization', `Bearer ${makeToken()}`);

    expect(res.status).toBe(404);
  });
});

describe('PUT /api/users/me', () => {
  it('should update user name and description', async () => {
    const updated = makeMockUser({ name: 'Updated Name', description: 'My description' });

    (User.findOne as jest.Mock).mockResolvedValue(null);
    (User.findByIdAndUpdate as jest.Mock).mockResolvedValue(updated);

    const res = await request(app)
      .put('/api/users/me')
      .set('Authorization', `Bearer ${makeToken()}`)
      .send({ name: 'Updated Name', description: 'My description' });

    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Updated Name');
    expect(res.body.description).toBe('My description');
  });

  it('should return 409 if email already in use', async () => {
    (User.findOne as jest.Mock).mockResolvedValue(makeMockUser({ email: 'other@example.com' }));

    const res = await request(app)
      .put('/api/users/me')
      .set('Authorization', `Bearer ${makeToken()}`)
      .send({ email: 'other@example.com' });

    expect(res.status).toBe(409);
  });
});

describe('POST /api/users/me/avatar', () => {
  it('should upload an avatar image', async () => {
    const updated = makeMockUser({ avatarUrl: '/api/uploads/test.png' });
    (User.findByIdAndUpdate as jest.Mock).mockResolvedValue(updated);

    const pngBuffer = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      'base64',
    );

    const res = await request(app)
      .post('/api/users/me/avatar')
      .set('Authorization', `Bearer ${makeToken()}`)
      .attach('avatar', pngBuffer, 'test.png');

    expect(res.status).toBe(200);
    expect(res.body.avatarUrl).toContain('/api/uploads/');
  });

  it('should return 400 without file', async () => {
    const res = await request(app)
      .post('/api/users/me/avatar')
      .set('Authorization', `Bearer ${makeToken()}`);

    expect(res.status).toBe(400);
  });
});
