import Community, { ICommunity } from '@/models/Community.model';
import Task from '@/models/Task.model';
import { Types } from 'mongoose';
import { connectToDB } from '@/util/connectToDB';

/**
 * Utility function to get the start of today’s date for comparison.
 * @returns {Date} Start of today
 */
function getStartOfToday(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

/**
 * Updates or calculates the user's streak and applies a multiplier based on the streak threshold.
 *
 * @param communityId - The community ID.
 * @param userId - The user ID.
 * @param basePoints - The base points for the task before applying the streak multiplier.
 * @returns The total points after streak multiplier is applied.
 */
export async function updateStreak(
  communityId: Types.ObjectId,
  userId: Types.ObjectId,
  basePoints: number
): Promise<number> {
  await connectToDB();

  const startOfToday = getStartOfToday();
  const startOfYesterday = new Date(startOfToday);
  startOfYesterday.setDate(startOfToday.getDate() - 1);

  // Step 1: Retrieve community
  console.log("Fetching community with ID:", communityId);
  const community = await Community.findById(communityId);
  if (!community) throw new Error("Community not found");

  // Step 2: Find the member within the community
  console.log("Looking for user in community members with ID:", userId);
  const member = community.members.find((m) => m._id.equals(userId));
  if (!member) {
    console.log("User not found in community members.");
    throw new Error("User not found in community");
  }

  // Step 3: Check if a task was completed today
  console.log("Checking if user has a task completed today.");
  const todayTask = await Task.findOne({
    userId,
    communityId,
    completedAt: { $gte: startOfToday },
  });

  if (todayTask) {
    console.log("Task already completed today, returning existing points:", todayTask.points);
    return todayTask.points; // No need to modify streak if a task is done today
  }

  // Step 4: Check last task completion to determine streak continuity
  console.log("Looking for the last task completed before today.");
  const lastTask = await Task.findOne({
    userId,
    communityId,
    completedAt: { $lt: startOfToday },
  }).sort({ completedAt: -1 });

  if (lastTask) {
    console.log("Last task found, completed at:", lastTask.completedAt);
  } else {
    console.log("No previous task found before today.");
  }

  if (lastTask && lastTask.completedAt >= startOfYesterday) {
    console.log("Continuing streak from yesterday.");
    member.currentStreak += 1;
  } else {
    console.log("No task found from yesterday, resetting streak.");
    member.currentStreak = 1;
  }

  // Step 5: Update longest streak if the current streak exceeds it
  if (member.currentStreak > member.longestStreak) {
    console.log("Updating longest streak:", member.currentStreak);
    member.longestStreak = member.currentStreak;
  }

  // Step 6: Calculate total points with multiplier if streak threshold is reached
  const { streakThreshold, multiplier } = community.settings.streaks;
  const totalPoints = member.currentStreak >= streakThreshold ? basePoints * multiplier : basePoints;

  console.log(`Base points: ${basePoints}, Multiplier: ${multiplier}, Total points after multiplier: ${totalPoints}`);

  // Step 7: Save updated streak data in the community document
  console.log("Saving updated community streak data.");
  await community.save();

  console.log("Streak updated successfully. Returning total points:", totalPoints);
  return totalPoints;
}
