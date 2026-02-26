import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/user.model';
import { env } from '../config/env';
import { AppError } from '../middleware/error.middleware';

function generateToken(userId: string): string {
  return jwt.sign({ userId }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as string,
  } as jwt.SignOptions);
}

function toUserDto(user: IUser) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    description: user.description,
    avatarUrl: user.avatarUrl,
  };
}

export async function register(name: string, email: string, password: string) {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError(409, 'Email already registered.');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashedPassword });

  const token = generateToken(user._id.toString());
  return { token, user: toUserDto(user) };
}

export async function login(email: string, password: string) {
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new AppError(401, 'Invalid email or password.');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new AppError(401, 'Invalid email or password.');
  }

  const token = generateToken(user._id.toString());
  return { token, user: toUserDto(user) };
}
