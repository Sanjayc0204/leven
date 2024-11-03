import User from '@/models/User.model';
import { Types } from 'mongoose';
import { IUser } from '@/models/User.model';

/**
 * Fetches a user by either `userId` or `email`.
 *
 * @param {string | Types.ObjectId} identifier - The user's ID (ObjectId) or email.
 * @returns {Promise<IUser | null>} - The user document, or null if not found.
 */
export async function findUserByIdOrEmail(identifier: string | Types.ObjectId): Promise<IUser | null> {
  console.log('Finding user with identifier:', identifier);

  let user;
  if (Types.ObjectId.isValid(identifier)) {
    user = await User.findById(identifier).exec();
  } else {
    user = await User.findOne({ email: identifier }).exec();
  }

  if (!user) {
    console.error('User not found with identifier:', identifier);
  } else {
    console.log('User found:', user);
  }

  return user;
}