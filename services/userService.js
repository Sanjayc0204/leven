import User from '@/models/User.model'; 
import Community from '@/models/Community.model';

/**
 * Returns all communities a user belongs to (only name and ID)
 *
 * @param {String} userId - The ID of the user.
 * @returns {Array} - An array of communities (name and ID).
 */
export async function getUserCommunities(userId) {
  const user = await User.findById(userId).populate({
    path: 'communities',            // Populate the communities field
    select: 'name _id'              // Select only the name and _id fields
  });
  
  if (!user) {
    throw new Error('User not found');  // Handle user not found
  }

  return user.communities;     // Return all the communities the user belongs to with only name and _id
}


/**
 * Updates Profile info of particular user
 *
 * @param {type} paramName - Description of the parameter.
 * @returns {type} - Description of what the function returns.
 */
export async function updateUserProfile(userId, updateData) {
  const user = await User.findByIdAndUpdate(userId, updateData, { new: true });

  if (!user) {
    throw new Error('User not found');
  }

  return user;
}

/**
 * Retrieves Profile info of particular user
 *
 * @param {type} paramName - Description of the parameter.
 * @returns {type} - Description of what the function returns.
 */
export async function getUserProfile(userId) {
  const user = await User.findById(userId).select('-password');  // Exclude password if needed

  if (!user) {
    throw new Error('User not found');
  }

  return user;
}
