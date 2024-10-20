import User, { IUser } from '@/models/User.model';  // Assuming the IUser interface exists
import Community, { ICommunity } from '@/models/Community.model';  // Assuming the ICommunity interface exists
import { Types } from 'mongoose';
import { connectToDB } from '@/util/connectToDB';

/**
 * Returns all communities a user belongs to (populates name and ID).
 *
 * @param {Types.ObjectId} userId - The ID of the user.
 * @returns {Promise<Array<{ _id: Types.ObjectId, name: string }>>} - An array of communities (name and ID).
 */
export async function getUserCommunities(userId: Types.ObjectId): Promise<Array<{ _id: Types.ObjectId, name: string }>> {
  await connectToDB();  // Ensure DB connection before any queries

  const user = await User.findById(userId).populate({
    path: 'communities',
    select: 'name _id',  // Select only the name and _id fields of each community
  }).exec();

  if (!user) {
    throw new Error('User not found');
  }

  // Return the populated communities with _id and name
  return user.communities as Array<{ _id: Types.ObjectId, name: string }>;
}



/**
 * Updates Profile info of a particular user.
 *
 * @param {Types.ObjectId} userId - The ID of the user.
 * @param {Partial<IUser>} updateData - The data to update in the user's profile.
 * @returns {Promise<IUser>} - The updated user profile.
 */
export async function updateUserProfile(userId: Types.ObjectId, updateData: Partial<IUser>): Promise<IUser> {
  const user = await User.findByIdAndUpdate(userId, updateData, { new: true }).exec();

  if (!user) {
    throw new Error('User not found');
  }

  return user;
}

/**
 * Retrieves Profile info of a particular user.
 *
 * @param {Types.ObjectId} userId - The ID of the user.
 * @returns {Promise<IUser>} - The user's profile.
 */
export async function getUserProfile(userId: Types.ObjectId): Promise<IUser> {
  const user = await User.findById(userId).select('-password').exec();  // Exclude password if needed

  if (!user) {
    throw new Error('User not found');
  }

  return user;
}
