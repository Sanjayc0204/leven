import Task, { ITask, TaskData } from '@/models/Task.model';
import User from '@/models/User.model';
import Community from '@/models/Community.model';
import { Types } from 'mongoose';
import { updateModuleScore } from '@/services/communityService';
import { connectToDB } from "@/util/connectToDB";

interface LeanCommunity {
    _id: Types.ObjectId;
    modules: { moduleId: Types.ObjectId }[];
    customization: any;
  }


/**
 * Record a new task in the database and update the user's points within the community.
 *
 * @param {TaskData} taskData - The task details.
 * @returns {Promise<ITask>} - The recorded task details.
 */
export async function recordTask(taskData: TaskData): Promise<ITask> {
    await connectToDB();

    const task = new Task({
        userId: taskData.userId,
        communityId: taskData.communityId,
        moduleId: taskData.moduleId,
        description: taskData.description || 'Task Submission',
        completedAt: Date.now(),
        points: taskData.points,
        metadata: taskData.metadata,  // Make sure metadata is stored
    });

    await task.save();

    // Update the user's score within the community
    await updateModuleScore(taskData.communityId, taskData.userId, taskData.moduleId, taskData.points);

    return task;
}


/**
 * Batch updates communities for a specific module.
 *
 * @param {Types.ObjectId} userId - The user's ID.
 * @param {Types.ObjectId} moduleId - The module ID to be updated across communities.
 * @param {string[]} metadata - Metadata tags for the task.
 * @param {string} description - Description of the task.
 * @returns {Promise<any>} - The results of batch updates.
 */
export async function batchUpdateModules(
    userId: Types.ObjectId,
    moduleId: Types.ObjectId,
    metadata: string[],
    description: string
  ): Promise<any> {
      await connectToDB();
  
      // Step 1: Find communities where the user is a member and the module exists
      const communities = await Community.find({
          members: { $elemMatch: { _id: userId } },   // Only communities where user is a member
          modules: { $elemMatch: { moduleId: moduleId } },  // Only communities containing the specified module
      })
      .select('_id modules customization')  // Select only the fields we need
      .lean<LeanCommunity[]>();  // Use `lean` with a custom subset type
  
      const results = [];
  
      for (const community of communities) {
          const communityId = community._id;
  
          // Calculate points based on community's customization
          const difficulty = metadata.find(tag => ["easy", "medium", "hard"].includes(tag));
          const points = difficulty ? await calculatePoints(communityId, moduleId, difficulty) : 0;
  
          // Record task for each applicable community
          const taskData: TaskData = {
              userId,
              communityId,
              moduleId,
              description,
              points,
              metadata,
          };
  
          const taskResult = await recordTask(taskData);
          results.push(taskResult);
      }
  
      return results;
  }



  export async function calculatePoints(
    communityId: Types.ObjectId,
    moduleId: Types.ObjectId,
    difficulty: string
  ): Promise<number> {
    await connectToDB();
  
    const community = await Community.findById(communityId)
      .select('modules')
      .lean()
      .exec();
  
    if (!community) throw new Error('Community not found');
  
    const module = community.modules.find(mod => mod.moduleId.toString() === moduleId.toString());
    if (!module) throw new Error("Module not found in community");
  
    // Use the points scheme directly from customizations in the module
    const points = module.customizations?.pointsScheme?.[difficulty];
    if (points == null) throw new Error(`Points not configured for difficulty "${difficulty}"`);
  
    return points;
  }
  

 /**
 * Fetches tasks associated with a community, including usernames for each task.
 *
 * @param {Types.ObjectId} communityId - The ID of the community.
 * @returns {Promise<Array>} - Array of tasks with usernames populated.
 */
export async function fetchCommunityTasks(communityId: Types.ObjectId) {
    // Ensure valid community ID
    if (!Types.ObjectId.isValid(communityId)) {
        throw new Error("Invalid community ID");
    }

    // Query tasks by communityId and populate the userId to get the username
    const tasks = await Task.find({ communityId })
        .populate({
            path: 'userId',
            select: 'username', // Only include the username field from User
            model: User, // Explicitly specify the User model
        })
        .sort({ completedAt: -1 }); // Sort by most recent first

    return tasks;
}

/**
 * Fetch tasks for a user based on filters.
 *
 * @param {Object} filters - Filter criteria for querying tasks (e.g., userId, communityId).
 * @returns {Promise<Array>} - List of tasks.
 */
export async function getTasksForUser(filters: { userId: Types.ObjectId; communityId: Types.ObjectId }) {
   return await Task.find(filters).sort({ completedAt: -1 });
}
