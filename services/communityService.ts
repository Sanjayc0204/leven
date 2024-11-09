import { Types } from "mongoose";
import User from "@/models/User.model";
import Community, {ICommunity,ICommunityModule, PointsScheme} from "@/models/Community.model";
import Module from "@/models/Module.model";
import { connectToDB } from "@/util/connectToDB";
import { generateSlug } from "@/util/communityUtils/generateSlug";
import { findCommunityIdOrSlug } from "@/util/communityUtils/findCommunityIdOrSlug";

// Interface for what a community member should look like
interface IMember {
  _id: Types.ObjectId;
  role: "admin" | "member";
  points: number;
  moduleProgress: Array<{
    moduleId: Types.ObjectId;
    totalPoints: number;
    totalTime: number;
  }>;
}

/**
 * Fetch communities based on the search query or return top 10 if no query.
 *
 * @param {string} [searchQuery] - Optional search query for communities.
 * @returns {Promise<ICommunity[]>} - List of communities that match the search or top 10.
 */
export async function fetchAllCommunities(
  searchQuery?: string
): Promise<ICommunity[]> {
  await connectToDB();

  let communities: ICommunity[] = [];

  if (searchQuery) {
    // Search for communities matching the query (case-insensitive)
    communities = await Community.find({
      name: { $regex: searchQuery, $options: "i" },
    });
  } else {
    // Return all communities
    communities = await Community.find({});
    //communities = await Community.find({}).limit(10)
  }
  console.log(communities);
  return communities;
}

/**
 * Creates a new community in the database and adds the initial modules with their customizations.
 *
 * @param {string} name - Community name.
 * @param {Types.ObjectId} creatorId - ID of the community creator.
 * @param {string} description - Community description.
 * @param {string} image - URL of the community image.
 * @param {Types.ObjectId[]} modules - Array of module IDs to be added to the community.
 * @returns {Promise<ICommunity>} - The created community.
 */
export async function createCommunity(
  name: string,
  creatorId: Types.ObjectId,
  description: string,
  image: string,
  modules: Types.ObjectId[]
): Promise<ICommunity> {
  await connectToDB();
  const slug = generateSlug(name);

  // Step 1: Create the community document with basic fields
  // Note Schema will always take precedence so even if you don't fill these, schema automatically automatically fills t.
  const community = new Community({
    name,
    slug,
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
    settings: {
      streaks: {
        streakThreshold: 1,
        multiplier: 1,
      },
      privacy: {
        isPrivate: false,
      },
      leaderboard: {
        showStreaks: true,
      },
    },
    createdAt: new Date(),
  });

  // Save the community to get the _id
  await community.save();

  // Step 2: Add each module to the community using addModuleToCommunity
  for (const moduleId of modules) {
    await addModuleToCommunity(
      community._id as Types.ObjectId,
      moduleId as Types.ObjectId,
      creatorId
    );
  }

  // Step 3: Append the community ID to the creator's communities array
  await User.findByIdAndUpdate(
    creatorId,
    { $push: { communities: community._id } }, // Append the new community's ID to the user's communities array
    { new: true }
  );

  // Step 4: Retrieve the updated community with modules and customizations populated
  const updatedCommunity = await Community.findById(community._id);

  return updatedCommunity!;
}


/**
 * Fetch community details by ID.
 *
 * @param {Types.String} identifier 
 * @returns {Promise<ICommunity | null>} - The found community or null if not found.
 */
export async function getCommunityById(
  identifier: string | Types.ObjectId
): Promise<ICommunity | null> {
  await connectToDB();
  return findCommunityIdOrSlug(identifier);
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
    throw new Error("Community not found");
  }

  const isCreator = community.creator_ID.toString() === userId.toString();
  const member = community.members.find(
    (m) => m._id.toString() === userId.toString() && m.role === "admin"
  );

  if (!isCreator && !member) {
    throw new Error("You are not authorized to update this community");
  }

  Object.keys(updateData).forEach((key) => {
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
export async function deleteCommunity(
  communityId: Types.ObjectId,
  adminId: Types.ObjectId
): Promise<{ message: string }> {
  await connectToDB();

  const community = await Community.findById(communityId);
  if (!community) {
    throw new Error("Community not found");
  }

  const isCreator = community.creator_ID.toString() === adminId.toString();
  if (!isCreator) {
    throw new Error("You are not authorized to delete this community");
  }

  await User.updateMany(
    { communities: communityId },
    { $pull: { communities: communityId } }
  );

  await community.deleteOne(); //
  return {
    message: "Community and associated references deleted successfully",
  };
}



/**
 * Add a module to a community (Admin Only).
 *
 * @param {Types.ObjectId} communityId - The ID of the community.
 * @param {Types.ObjectId} moduleId - The ID of the module to add.
 * @param {Types.ObjectId} userId - The ID of the user performing the action (for admin check).
 * @returns {Promise<ICommunity>} - The updated community.
 */
export async function addModuleToCommunity(
  communityId: Types.ObjectId,
  moduleId: Types.ObjectId,
  userId: Types.ObjectId
): Promise<ICommunity> {
  const community = await Community.findById(communityId);
  if (!community) {
      throw new Error("Community not found");
  }

  // Check if the user is an admin
  const userIsAdmin = community.members.some(
      member => member._id.equals(userId) && member.role === "admin"
  );
  if (!userIsAdmin) {
      throw new Error("User does not have admin privileges");
  }

  // Check if the module is already added to the community
  const moduleExists = community.modules.some(
      module => module.moduleId.equals(moduleId)
  );
  if (moduleExists) {
      throw new Error("Module is already added to the community");
  }

  // Retrieve module details from Module collection
  const module = await Module.findById(moduleId);
  if (!module) {
      throw new Error("Module not found");
  }

  // Ensure pointsScheme is correctly typed or set a default if missing
  const customizations = {
      pointsScheme: (module.customizations?.pointsScheme as PointsScheme) || {}
  };

  // Add the module with name, settings, and customizations (including points scheme) to community's modules array
  community.modules.push({
      moduleId: module._id as Types.ObjectId,
      moduleName: module.name,
      settings: module.settings || {},                // Default settings from the module document
      customizations                                  // Customizations with pointsScheme
  });

  await community.save();
  return community;
}




/**
 * Fetches all modules for a specific community
 *
 * @param {Types.ObjectId} communityId - The ID of the community.
 * @returns {Promise<Array<ICommunityModule>>} - An array of modules associated with the community.
 */
export async function getCommunityModules(communityId: Types.ObjectId): Promise<ICommunityModule[]> {
  await connectToDB();

  // Query the community and populate module details
  const community = await Community.findById(communityId)
    .select('modules')
    .populate({
      path: 'modules.moduleId',
      select: 'name moduleType', // Fetch base module details
    })
    .lean()
    .exec();

  if (!community) {
    throw new Error("Community not found");
  }

  // Return modules with direct customizations if present
  return community.modules.map((module) => ({
    ...module,
    settings: module.settings || {}, // Include default settings if none are set
    customizations: module.customizations || {},  // Use the customizations directly from modules array
  }));
}



/**
 * Customize a module's pointsScheme directly without nesting in a community.
 *
 * @param {Types.ObjectId} communityId - The ID of the community.
 * @param {Types.ObjectId} moduleId - The ID of the module to customize.
 * @param {Record<string, number>} pointsSchemeUpdates - New points scheme settings.
 * @returns {Promise<ICommunity>} - The updated community document.
 */
export async function customizeModule(
  communityId: Types.ObjectId,
  moduleId: Types.ObjectId,
  pointsSchemeUpdates: Record<string, number>
): Promise<ICommunity> {
  await connectToDB();

  const community = await Community.findById(communityId);
  if (!community) throw new Error("Community not found");

  // Locate the module within the community's modules array
  const module = community.modules.find((mod) => mod.moduleId.equals(moduleId));
  if (!module) throw new Error("Module not found in community");

  // Directly replace the pointsScheme with the new updates
  module.customizations.pointsScheme = pointsSchemeUpdates;

  // Save the updated community
  await community.save();
  return community;
}






import Task from '@/models/Task.model'; //remove all tasks related to model

/**
 * Deletes a module from a community and removes associated tasks.
 *
 * @param {Types.ObjectId} communityId - The ID of the community.
 * @param {Types.ObjectId} moduleId - The ID of the module to delete.
 * @returns {Promise<void>}
 */
export async function deleteModuleFromCommunity(
  communityId: Types.ObjectId,
  moduleId: Types.ObjectId
): Promise<void> {
  await connectToDB();

  // Step 1: Find the community and remove the module
  const community = await Community.findById(communityId);
  if (!community) {
    throw new Error("Community not found");
  }

  // Remove the module and its customizations directly within the `modules` array
  community.modules = community.modules.filter(
    (mod) => mod.moduleId.toString() !== moduleId.toString()
  );

  // Save the updated community document
  await community.save();

  // Step 2: Delete all tasks associated with this module in the specified community
  await Task.deleteMany({
    communityId: communityId,
    moduleId: moduleId,
  });
}



/**
 * Adds a user to a community.
 *
 * @param {Types.ObjectId} communityId - The ID of the community to join.
 * @param {Types.ObjectId} userId - The ID of the user joining the community.
 * @returns {Promise<ICommunity>} - The updated community.
 */
export async function joinCommunity(
  communityId: Types.ObjectId,
  userId: Types.ObjectId
): Promise<ICommunity> {
  // Find the community by ID
  const community = await Community.findById(communityId);
  if (!community) {
    throw new Error("Community not found");
  }

  // Check if the user is already a member
  const isAlreadyMember = community.members.some((member) =>
    member._id.equals(userId)
  );
  if (isAlreadyMember) {
    throw new Error("User is already a member of this community");
  }

  // Add the user to the community's members list
  community.members.push({
    _id: userId,
    role: "member",            // Default role
    points: 0,                  // Initial points
    moduleProgress: [],         // Empty module progress array
    currentStreak: 0,           // Initial streak count
    longestStreak: 0,           // Initial longest streak
    previousRank:0
  });

  await community.save(); // Save the updated community

  // Update the user's list of communities
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  if (!user.communities.includes(communityId)) {
    user.communities.push(communityId); // Add the community to the user's list
  }

  await user.save(); // Save the updated user

  return community; // Return the updated community document
}



import { IUser } from "@/models/User.model"; // Assuming you have a User model and interface
/**
 * Fetches a user's stats (points, module progress) within a community.
 *
 * @param {Types.ObjectId} communityId - The ID of the community.
 * @param {Types.ObjectId} userId - The ID of the user whose stats are being fetched.
 * @returns {Promise<Object>} - An object containing the user's stats within the community.
 */
export async function getUserStatsInCommunity(
  communityId: Types.ObjectId,
  userId: Types.ObjectId
): Promise<any> {
  // Fetch the community and populate the user stats
  const community = await Community.findById(communityId)
    .select("members") // Select only members field
    .populate("members._id", "username"); // Populate the user details (username)

  if (!community) {
    throw new Error("Community not found");
  }

  // Find the user within the community members array
  const userStats = community.members.find((member) =>
    member._id.equals(userId)
  );

  if (!userStats) {
    throw new Error("User not found in this community");
  }

  // Cast the populated _id to 'unknown', then to 'IUser'
  const populatedUser = userStats._id as unknown as IUser;

  // Return user stats (points, module progress, etc.)
  return {
    username: populatedUser.username, // Now you can access 'username' after population
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
    throw new Error("Community not found");
  }

  // Remove the user from the community's members list
  community.members = community.members.filter(
    (member) => !member._id.equals(userId)
  );
  await community.save();

  // Remove the community from the user's communities list
  await User.findByIdAndUpdate(userId, { $pull: { communities: communityId } });

   // Remove tasks associated with this user in the specific community
   await Task.deleteMany({
    communityId: communityId,
    userId: userId,
  });

  console.log(`Deleted all tasks for user ${userId} in community ${communityId}`);

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
    throw new Error("Community not found");
  }

  // Ensure the admin is authorized
  if (
    !community.members.find(
      (member) => member._id.equals(adminId) && member.role === "admin"
    )
  ) {
    throw new Error("Unauthorized");
  }

  // Remove the member from the community
  community.members = community.members.filter(
    (member) => !member._id.equals(userId)
  );
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
export async function changeMemberRole(
  communityId: Types.ObjectId,
  userId: Types.ObjectId,
  newRole: "admin" | "member",
  adminId: Types.ObjectId
): Promise<void> {
  // Fetch the community
  const community = await Community.findById(communityId);
  if (!community) {
    throw new Error("Community not found");
  }

  // Ensure the admin has permission
  const admin = community.members.find(
    (member) => member._id.equals(adminId) && member.role === "admin"
  );
  if (!admin) {
    throw new Error("You are not authorized to change member roles");
  }

  // Find the member and change their role
  const member = community.members.find((member) => member._id.equals(userId));
  if (!member) {
    throw new Error("Member not found in this community");
  }

  member.role = newRole; // Update the role
  await community.save();
}


/**
 * Fetch leaderboard data based on general points for each member.
 *
 * @param {Types.ObjectId} communityId - The ID of the community.
 * @returns {Promise<Array<{ userId: string; username: string; image: string; totalPoints: number }>>} - Leaderboard sorted by general points.
 * 
 */
export async function getLeaderboardByCommunityId(
  communityId: Types.ObjectId
): Promise<Array<{ userId: string; username: string; image: string; totalPoints: number; previousRank: number; currentStreak?: number }>> {
  await connectToDB();

  // Fetch the community and populate members with user details
  const community = await Community.findById(communityId)
    .populate({
      path: 'members._id',
      select: 'username image', // Populate username and image
      model: 'User',
    })
    .select('members');

  console.log("Community found:", community);

  if (!community) {
    throw new Error("Community not found");
  }

  // Filter and map members for leaderboard
  let leaderboard = community.members
    .filter((member) => {
      const validMember = member._id !== null && typeof member.points === 'number';
      if (!validMember) console.log(`Skipping member with ID: ${member._id} - Points not defined`);
      return validMember;
    })
    .map((member) => {
      const populatedMember = member._id as unknown as IUser;
      return {
        userId: populatedMember._id.toString(),
        username: populatedMember.username,
        image: populatedMember.image || '',
        totalPoints: member.points,
        previousRank: member.previousRank || 0, // Retain previous rank for leaderboard comparison
        currentStreak: member.currentStreak || 0, // Optional; front end can control display
      };
    });

  // Sort by total points in descending order
  leaderboard.sort((a, b) => b.totalPoints - a.totalPoints);

  console.log("Sorted leaderboard data:", leaderboard);
  
  return leaderboard;
}






import { findUserByIdOrEmail } from '@/util/userUtils/getUserIdFromIdentifier';

/**
 * Updates the score for a user's progress within a specific module in a community.
 *
 * @param communityId - The ID of the community.
 * @param userIdentifier - The ID or email of the user.
 * @param moduleId - The ID of the module within the community.
 * @param score - The pre-calculated score to add.
 * @returns Updated community document or null if not found.
 */
export async function updateModuleScore(
  communityId: Types.ObjectId,
  userIdentifier: string | Types.ObjectId,
  moduleId: Types.ObjectId,
  score: number
) {
  // Fetch the community with the necessary fields populated
  const community = await Community.findById(communityId).select('members customization').exec();
  if (!community) throw new Error('Community not found');

  // Get user details
  const user = await findUserByIdOrEmail(userIdentifier);
  if (!user) throw new Error('User not found');
  
  const member = community.members.find((m) => m._id.equals(user._id));
  if (!member) throw new Error('User not a member of this community');

  // Update general points
  member.points = (member.points || 0) + score;

  // Update or add points for module progress
  const moduleProgress = member.moduleProgress.find((prog) => prog.moduleId.equals(moduleId));
  if (moduleProgress) {
    moduleProgress.totalPoints += score;
  } else {
    member.moduleProgress.push({ moduleId, totalPoints: score, totalTime: 0 });
  }

  await community.save();
  return community;
}
