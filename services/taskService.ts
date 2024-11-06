import Task, { ITask, TaskData } from '@/models/Task.model';
import Community from '@/models/Community.model';
import { Types } from 'mongoose';
import { updateModuleScore } from '@/services/communityService';
import { connectToDB } from "@/util/connectToDB";


/**
 * Record a new task in the database and update the user's points within the community.
 *
 * @param {TaskData} taskData - The task details.
 * @returns {Promise<ITask>} - The recorded task details.
 */
export async function recordTask(taskData: TaskData): Promise<ITask> {
    await connectToDB();

    // Step 1: Calculate the task points
    const points = await calculatePoints(
        taskData.communityId,
        taskData.moduleId,
        taskData.difficulty
    );

    const descriptionWithDifficulty = `${taskData.description || 'Task Submission'} - Difficulty: ${taskData.difficulty}`;

    // Step 2: Save the new task in the Task collection
    const task = new Task({
        userId: taskData.userId,
        communityId: taskData.communityId,
        moduleId: taskData.moduleId,
        description: descriptionWithDifficulty,
        completedAt: Date.now(),
        duration: taskData.duration,
        points, // Use the calculated points
    });

    await task.save();

    // Step 3: Update the user's score within the community
    await updateModuleScore(taskData.communityId, taskData.userId, taskData.moduleId, points);

    return task;
}


export async function calculatePoints(
    communityId: Types.ObjectId,
    moduleId: Types.ObjectId,
    difficulty: string
): Promise<number> {
    await connectToDB(); // Ensure connection

    console.log("Calculating points for Community:", communityId, "Module:", moduleId, "Difficulty:", difficulty);

    const community = await Community.findById(communityId);
    if (!community) throw new Error('Community not found');

    // Step 1: Check for customization in the `customization` array
    const moduleCustomization = community.customization.find(
        (custom) => custom.moduleId.toString() === moduleId.toString()
    );
    console.log("Module Customization:", moduleCustomization);

    if (moduleCustomization) {
        const pointsScheme = moduleCustomization.pointsScheme as Record<string, number>;
        if (pointsScheme && pointsScheme[difficulty] != null) {
            console.log("Custom Points Scheme Found:", pointsScheme[difficulty]);
            return pointsScheme[difficulty];
        }
    }

    // Step 2: Fallback to default settings in the `modules` array if no customization found
    const moduleDefault = community.modules.find(
        (mod) => mod.moduleId.toString() === moduleId.toString()
    );
    console.log("Module Default:", moduleDefault);

    if (moduleDefault?.customizations?.pointsScheme) {
        const defaultPointsScheme = moduleDefault.customizations.pointsScheme as Record<string, number>;
        if (defaultPointsScheme[difficulty] != null) {
            console.log("Default Points Scheme Found:", defaultPointsScheme[difficulty]);
            return defaultPointsScheme[difficulty];
        }
    }

    throw new Error(`Points configuration not found for module ${moduleId} with difficulty "${difficulty}". Ensure that points for difficulty "${difficulty}" are defined in either community customizations or module defaults.`);
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
