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
 * Updates a community's data. Only the creator or members with the 'admin' role can make changes.
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
export async function kickMemberFromCommunity(
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
 * Return leaderboard information for members of a community, sorted by points.
 *
 * @param {string} communityName - The name of the community.
 * @returns {Promise<IMember[]>} - The members of the community, sorted by points.
 */
export async function getLeaderboardByCommunityName(
  communityName: string
): Promise<IMember[]> {
  await connectToDB();

  // Find the community by name and return only the members sorted by points
  const community = await Community.findOne({ name: communityName })
    .select('members') // Select only the members field
    .sort({ 'members.points': -1 }) // Sort by points in descending order
    .populate('members._id', 'username'); // Populate the user information

  if (!community) {
    throw new Error('Community not found');
  }

  return community.members; // Return the sorted members
}