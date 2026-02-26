import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { AuthPayload, AuthRequest } from '../types';
import { AppError } from './error.middleware';

export function authMiddleware(req: AuthRequest, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    throw new AppError(401, 'Access denied. No token provided.');
  }

  try {
    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, env.JWT_SECRET) as AuthPayload;
    req.user = decoded;
    next();
  } catch {
    throw new AppError(401, 'Invalid or expired token.');
  }
}
