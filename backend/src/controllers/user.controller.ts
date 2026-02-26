import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import * as userService from '../services/user.service';

export async function getMe(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = await userService.getUserById(req.user!.userId);
    res.json(user);
  } catch (err) {
    next(err);
  }
}

export async function updateMe(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { name, email, description } = req.body;
    const user = await userService.updateUser(req.user!.userId, { name, email, description });
    res.json(user);
  } catch (err) {
    next(err);
  }
}

export async function uploadAvatar(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.file) {
      res.status(400).json({ message: 'No file uploaded.' });
      return;
    }

    const avatarUrl = `/api/uploads/${req.file.filename}`;
    const user = await userService.updateAvatar(req.user!.userId, avatarUrl);
    res.json({ avatarUrl: user.avatarUrl });
  } catch (err) {
    next(err);
  }
}
