import { Types } from 'mongoose';
import User from '@/models/User.model';
import Community, { ICommunity } from '@/models/Community.model';
import Module, { IModule } from '@/models/Module.model';
import { connectToDB } from '@/util/connectToDB';

// Interface for what a community member should look like
interface IMember {
  _id: Types.ObjectId;
  role: 'admin' | 'member';
  points: number;
  moduleProgress: Array<{ moduleId: Types.ObjectId, totalPoints: number, totalTime: number }>;
}

/**
 * Fetch communities based on the search query or return top 10 if no query.
 *
 * @param {string} [searchQuery] - Optional search query for communities.
 * @returns {Promise<ICommunity[]>} - List of communities that match the search or top 10.
 */
export async function fetchAllCommunities(searchQuery?: string): Promise<ICommunity[]> {
  await connectToDB();
  
  let communities: ICommunity[] = [];

  if (searchQuery) {
    // Search for communities matching the query (case-insensitive)
    communities = await Community.find({
      name: { $regex: searchQuery, $options: 'i' },
    });
  } else {
    // Return top 10 communities
    communities = await Community.find({}).limit(10);
  }

  return communities;
}

/**
 * Creates a new community in the database. Add first user as creator and member (no one else).
 *
 * @param {string} name - Community name.
 * @param {Types.ObjectId} creatorId - ID of the community creator.
 * @param {string} description - Community description.
 * @param {string} image - URL of the community image.
 * @returns {Promise<ICommunity>} - The created community.
 */
export async function createCommunity(
  name: string, 
  creatorId: Types.ObjectId, 
  description: string, 
  image: string
): Promise<ICommunity> {
  await connectToDB();

  const community = new Community({
    name,
    description,
    image,
    creator_ID: creatorId,
    members: [
      { 
        _id: creatorId, 
        role: 'admin', 
        points: 0, 
        moduleProgress: [],
      },
    ],
    customization: [],
    settings: {},
    createdAt: new Date(),
  });

  await community.save();
  return community;
}

/**
 * Fetch community details by ID.
 *
 * @param {Types.ObjectId} communityId - Community ID.
 * @returns {Promise<ICommunity | null>} - The found community or null if not found.
 */
export async function getCommunityById(communityId: Types.ObjectId): Promise<ICommunity | null> {
  await connectToDB();
  return Community.findById(communityId);
}



/**
 * Updates general community's data (image, name, description) + (future visibility settings, notifications, etc). 
 * Only the creator or members with the 'admin' role can make changes.
 *
 * @param {Types.ObjectId} communityId - ID of the community to update.
 * @param {Partial<ICommunity>} updateData - Data to update the community with.
 * @param {Types.ObjectId} userId - ID of the user attempting to update the community.
 * @returns {Promise<ICommunity>} - The updated community.
 */
export async function updateCommunity(
  communityId: Types.ObjectId, 
  updateData: Partial<ICommunity>, 
  userId: Types.ObjectId
): Promise<ICommunity> {
  await connectToDB();

  const community = await Community.findById(communityId);
  if (!community) {
    throw new Error('Community not found');
  }

  const isCreator = community.creator_ID.toString() === userId.toString();
  const member = community.members.find(m => m._id.toString() === userId.toString() && m.role === 'admin');

  if (!isCreator && !member) {
    throw new Error('You are not authorized to update this community');
  }

  Object.keys(updateData).forEach(key => {
    (community as any)[key] = updateData[key as keyof ICommunity];
  });

  await community.save();
  return community;
}


/**
 * Deletes a community and removes it from all users' community lists.
 *
 * @param {Types.ObjectId} communityId - The ID of the community to delete.
 * @param {Types.ObjectId} adminId - The ID of the admin attempting to delete the community.
 * @returns {Promise<{ message: string }>} - Success message.
 */
export async function deleteCommunity(communityId: Types.ObjectId, adminId: Types.ObjectId): Promise<{ message: string }> {
  await connectToDB();

  const community = await Community.findById(communityId);
  if (!community) {
    throw new Error('Community not found');
  }

  const isCreator = community.creator_ID.toString() === adminId.toString();
  if (!isCreator) {
    throw new Error('You are not authorized to delete this community');
  }

  await User.updateMany(
    { communities: communityId },
    { $pull: { communities: communityId } }
  );

  await community.deleteOne();   // 
  return { message: 'Community and associated references deleted successfully' };
}



/**
 * Add a module to a community (Admin Only).
 *
 * @param {Types.ObjectId} communityId - The ID of the community.
 * @param {Types.ObjectId} moduleId - The ID of the module to add.
 * @returns {Promise<ICommunity>} - The updated community.
 */
export async function addModuleToCommunity(
  communityId: Types.ObjectId,
  moduleId: Types.ObjectId
): Promise<ICommunity> {
  await connectToDB();

  const community = await Community.findById(communityId);
  if (!community) {
    throw new Error('Community not found');
  }

  const module = await Module.findById(moduleId);
  if (!module) {
    throw new Error('Module not found');
  }

  // Add the module to the community
    community.modules.push({
      moduleId: module._id as Types.ObjectId, // Explicit type assertion for module._id
    settings: {}, // Default settings for the module
  });

  await community.save();
  return community;
}



/**
 * Customize a module within a community (Admin Only).
 *
 * @param {Types.ObjectId} communityId - The ID of the community.
 * @param {Types.ObjectId} moduleId - The ID of the module to customize.
 * @param {object} updateData - The new customization settings.
 * @returns {Promise<ICommunity>} - The updated community.
 */
export async function customizeModule(
  communityId: Types.ObjectId,
  moduleId: Types.ObjectId,
  updateData: object
): Promise<ICommunity> {
  await connectToDB();

  const community = await Community.findById(communityId);
  if (!community) {
    throw new Error('Community not found');
  }

  // Find the specific module in the community
  const module = community.modules.find(mod => mod.moduleId.toString() === moduleId.toString());
  if (!module) {
    throw new Error('Module not found in community');
  }

  // Update the module settings
  module.settings = { ...module.settings, ...updateData };

  await community.save();
  return community;
}



/**
 * Delete a module from a community (Admin Only).
 *
 * @param {Types.ObjectId} communityId - The ID of the community.
 * @param {Types.ObjectId} moduleId - The ID of the module to delete.
 * @returns {Promise<{ message: string }>} - Success message.
 */
export async function deleteModuleFromCommunity(
  communityId: Types.ObjectId,
  moduleId: Types.ObjectId
): Promise<{ message: string }> {
  await connectToDB();

  const community = await Community.findById(communityId);
  if (!community) {
    throw new Error('Community not found');
  }

  // Remove the module from the community's module list
  community.modules = community.modules.filter(mod => mod.moduleId.toString() !== moduleId.toString());

  await community.save();
  return { message: 'Module removed successfully' };
}



/**
 * Adds a user to a community.
 *
 * @param {Types.ObjectId} communityId - The ID of the community to join.
 * @param {Types.ObjectId} userId - The ID of the user joining the community.
 * @returns {Promise<ICommunity>} - The updated community.
 */
export async function joinCommunity(communityId: Types.ObjectId, userId: Types.ObjectId): Promise<ICommunity> {
  // Find the community by ID
  const community = await Community.findById(communityId);
  if (!community) {
    throw new Error('Community not found');
  }

  // Check if the user is already a member
  const isAlreadyMember = community.members.some(member => member._id.equals(userId));
  if (isAlreadyMember) {
    throw new Error('User is already a member of this community');
  }

  // Add the user to the community's members list
  community.members.push({
    _id: userId,
    role: 'member',  // New members typically have a 'member' role by default
    points: 0,
    moduleProgress: [],  // Initialize module progress as an empty array
  });

  await community.save();  // Save the updated community

  // Update the user's list of communities
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  if (!user.communities.includes(communityId)) {
    user.communities.push(communityId);  // Add the community to the user's list
  }

  await user.save();  // Save the updated user

  return community;  // Return the updated community document
}



import { IUser } from '@/models/User.model'; // Assuming you have a User model and interface
/**
 * Fetches a user's stats (points, module progress) within a community.
 *
 * @param {Types.ObjectId} communityId - The ID of the community.
 * @param {Types.ObjectId} userId - The ID of the user whose stats are being fetched.
 * @returns {Promise<Object>} - An object containing the user's stats within the community.
 */
export async function getUserStatsInCommunity(communityId: Types.ObjectId, userId: Types.ObjectId): Promise<any> {
  // Fetch the community and populate the user stats
  const community = await Community.findById(communityId)
    .select('members') // Select only members field
    .populate('members._id', 'username'); // Populate the user details (username)

  if (!community) {
    throw new Error('Community not found');
  }

  // Find the user within the community members array
  const userStats = community.members.find(member => member._id.equals(userId));

  if (!userStats) {
    throw new Error('User not found in this community');
  }

  // Cast the populated _id to 'unknown', then to 'IUser'
  const populatedUser = userStats._id as unknown as IUser;

  // Return user stats (points, module progress, etc.)
  return {
    username: populatedUser.username, // Now you can access 'username' after population
    points: userStats.points,
    moduleProgress: userStats.moduleProgress,
  };
}




/**
 * Allow a user to leave a community.
 *
 * @param {Types.ObjectId} communityId - The ID of the community to leave.
 * @param {Types.ObjectId} userId - The ID of the user leaving the community.
 * @returns {Promise<ICommunity>} - The updated community.
 */
export async function leaveCommunity(
  communityId: Types.ObjectId,
  userId: Types.ObjectId
): Promise<ICommunity> {
  await connectToDB();

  const community = await Community.findById(communityId);
  if (!community) {
    throw new Error('Community not found');
  }

  // Remove the user from the community's members list
  community.members = community.members.filter(member => !member._id.equals(userId));
  await community.save();

  // Remove the community from the user's communities list
  await User.findByIdAndUpdate(userId, { $pull: { communities: communityId } });

  return community;
}


/**
 * Kick a member out of a community (Admin Only).
 *
 * @param {Types.ObjectId} communityId - The ID of the community.
 * @param {Types.ObjectId} userId - The ID of the user to kick out.
 * @param {Types.ObjectId} adminId - The ID of the admin performing the action.
 * @returns {Promise<ICommunity>} - The updated community.
 */
export async function kickMember(
  communityId: Types.ObjectId,
  userId: Types.ObjectId,
  adminId: Types.ObjectId
): Promise<ICommunity> {
  await connectToDB();

  const community = await Community.findById(communityId);
  if (!community) {
    throw new Error('Community not found');
  }

  // Ensure the admin is authorized
  if (!community.members.find(member => member._id.equals(adminId) && member.role === 'admin')) {
    throw new Error('Unauthorized');
  }

  // Remove the member from the community
  community.members = community.members.filter(member => !member._id.equals(userId));
  await community.save();

  // Remove the community from the user's list of communities
  await User.findByIdAndUpdate(userId, { $pull: { communities: communityId } });

  return community;
}


/**
 * Changes the role of a member in a community.
 *
 * @param {Types.ObjectId} communityId - The ID of the community.
 * @param {Types.ObjectId} userId - The ID of the member whose role is being changed.
 * @param {string} newRole - The new role ('admin' or 'member').
 * @param {Types.ObjectId} adminId - The ID of the admin initiating the role change.
 * @returns {Promise<void>} - Success message.
 */
export async function changeMemberRole(communityId: Types.ObjectId, userId: Types.ObjectId, newRole: 'admin' | 'member', adminId: Types.ObjectId): Promise<void> {
  // Fetch the community
  const community = await Community.findById(communityId);
  if (!community) {
    throw new Error('Community not found');
  }

  // Ensure the admin has permission
  const admin = community.members.find(member => member._id.equals(adminId) && member.role === 'admin');
  if (!admin) {
    throw new Error('You are not authorized to change member roles');
  }

  // Find the member and change their role
  const member = community.members.find(member => member._id.equals(userId));
  if (!member) {
    throw new Error('Member not found in this community');
  }

  member.role = newRole; // Update the role
  await community.save();
}






/**
 * Return leaderboard information for members of a community, sorted by points.
 *
 * @param {Types.ObjectId} communityId - The ID of the community.
 * @returns {Promise<IMember[]>} - The members of the community, sorted by points.
 */
export async function getLeaderboardByCommunityId(
  communityId: Types.ObjectId
): Promise<IMember[]> {
  await connectToDB();

  // Ensure proper population of members
  const community = await Community.findById(communityId)
    .populate({
      path: 'members._id', // Populate the '_id' field in 'members'
      select: 'username _id', // Select only the 'username' and '_id'
      model: 'User' // Explicitly tell Mongoose to use the 'User' model for population
    })
    .select('members') // Select only the members field
    .sort({ 'members.points': -1 }); // Sort by points in descending order

  if (!community) {
    throw new Error('Community not found');
  }

  return community.members; // Return the sorted members
}



