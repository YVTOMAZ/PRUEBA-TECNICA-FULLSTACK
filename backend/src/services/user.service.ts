import { User } from '../models/user.model';
import { AppError } from '../middleware/error.middleware';

export async function getUserById(userId: string) {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(404, 'User not found.');
  }
  return user;
}

export async function updateUser(
  userId: string,
  data: { name?: string; email?: string; description?: string },
) {
  if (data.email) {
    const existing = await User.findOne({ email: data.email, _id: { $ne: userId } });
    if (existing) {
      throw new AppError(409, 'Email already in use.');
    }
  }

  const user = await User.findByIdAndUpdate(userId, data, { new: true, runValidators: true });
  if (!user) {
    throw new AppError(404, 'User not found.');
  }
  return user;
}

export async function updateAvatar(userId: string, avatarUrl: string) {
  const user = await User.findByIdAndUpdate(userId, { avatarUrl }, { new: true });
  if (!user) {
    throw new AppError(404, 'User not found.');
  }
  return user;
}
