import User, { IUser } from '@/models/User.model';  
import { Types } from 'mongoose';
import { connectToDB } from '@/util/connectToDB';
import Community from '@/models/Community.model';

/**
 * Returns all communities a user belongs to (populates name and ID).
 *
 * @param {Types.ObjectId} userId - The ID of the user.
 * @returns {Promise<Array<{ _id: Types.ObjectId, name: string }>>} - An array of communities (name and ID).
 */
export async function getUserCommunities(userId: Types.ObjectId): Promise<Array<{ _id: Types.ObjectId, name: string }>> {
  await connectToDB();
  
  // Log the userId being queried
  console.log("Fetching communities for userId:", userId);

  const user = await User.findById(userId).populate({
    path: 'communities',
    select: 'name _id',
  }).exec();

  // Log if user is not found
  if (!user) {
    console.error("User not found with ID:", userId);
    throw new Error('User not found');
  }

  console.log("User found:", user);
  return user.communities as Array<{ _id: Types.ObjectId, name: string }>;
}


/**
 * Returns all communities a user belongs to by email.
 *
 * @param {string} email - The email of the user.
 * @returns {Promise<Array<{ _id: Types.ObjectId, name: string }>>} - An array of communities.
 */
export async function getUserCommunitiesByEmail(email: string): Promise<Array<{ _id: Types.ObjectId; name: string }>> {
  await connectToDB();

  console.log("Fetching communities for email:", email);

  const user = await User.findOne({ email }).populate({
    path: 'communities',
    select: 'name _id',
  }).exec();

  // Log if user is not found
  if (!user) {
    console.error("User not found with email:", email);
    throw new Error('User not found');
  }

  console.log("User found:", user);
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

/**
 * Retrieves a user's profile by email.
 *
 * @param {string} email - The email of the user.
 * @returns {Promise<IUser | null>} - The user's profile, or null if not found.
 */
export async function getUserProfileByEmail(email: string): Promise<IUser | null> {
  const user = await User.findOne({ email }).select('-password').exec();
  return user;
}






interface PopulatedModule {
  _id: Types.ObjectId;
  name: string;
  description: string;
  image: string;
  moduleType: string;
  tags: string[];
}

interface CommunityWithPopulatedModules {
  _id: Types.ObjectId;
  modules: {
    moduleId: PopulatedModule; 
    customizations: Record<string, any>;
  }[];
}

/**
 * Fetches all unique modules associated with the communities a user is part of.
 *
 * @param {Types.ObjectId} userId - The ID of the user.
 * @returns {Promise<Array<any>>} - An array of unique modules with optional community info.
 * 
 */
export async function getUserModules(userId: Types.ObjectId): Promise<any[]> {
  await connectToDB();

  // Fetch communities where the user is a member
  const communities = await Community.find({ 'members._id': userId })
    .select('modules name')
    .populate({
      path: 'modules.moduleId',
      select: 'name description image moduleType tags', // Fetch necessary attributes
    })
    .lean()
    .exec();

  if (!communities || communities.length === 0) {
    return [];
  }

  // Flatten and deduplicate the modules
  const modulesMap = new Map<string, any>();

  communities.forEach((community) => {
    community.modules.forEach((module) => {
      // Explicitly assert that moduleId is a PopulatedModule
      const moduleData = module.moduleId as unknown as PopulatedModule;
      const moduleId = moduleData._id.toString();

      if (!modulesMap.has(moduleId)) {
        modulesMap.set(moduleId, {
          moduleId: moduleData._id,
          moduleName: moduleData.name,
          moduleType: moduleData.moduleType,
          description: moduleData.description,
          image: moduleData.image,
          tags: moduleData.tags,
          communities: [],
        });
      }

      // Optionally track which communities the module belongs to
      modulesMap.get(moduleId).communities.push({
        communityId: community._id,
        communityName: community.name,
      });
    });
  });

  // Convert Map to Array
  return Array.from(modulesMap.values());
}
