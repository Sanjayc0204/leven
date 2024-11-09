import { NextRequest, NextResponse } from "next/server";   
import { Types } from 'mongoose';
import { calculatePoints, recordTask, batchUpdateModules} from '@/services/taskService';
import { updateStreak } from "@/services/streakService";
import { findUserByIdOrEmail } from '@/util/userUtils/getUserIdFromIdentifier';
import { connectToDB } from '@/util/connectToDB';

/**
 * Adds a new task with flexible tags (e.g., difficulty, type).
 * 
 * THIS MAINLY WORKS WITH TYPES WHERE YOU SEND IN [easy, medium, hard], will adjust for flexibility in the future
 * 
 * Also if you pass in 'all' into communityId, it will batch update all communities.
 *
 * @param {NextRequest} req - The request object.
 * @returns {Promise<NextResponse>} - The response object.
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
   try {
      await connectToDB();
      const body = await req.json();
      const { identifier, communityId, moduleId, metadata = [], description } = body;
      const typedMetadata: string[] = metadata;

      // Find user by ID or email
      const user = await findUserByIdOrEmail(identifier);
      if (!user) return new NextResponse('User not found', { status: 404 });

      // Validate ObjectId for moduleId
      if (!Types.ObjectId.isValid(moduleId)) {
         return new NextResponse('Invalid module ID', { status: 400 });
      }
      const moduleObjectId = new Types.ObjectId(moduleId);

      // Handle "all" keyword for communityId
      if (communityId === "all") {
         const result = await batchUpdateModules(user._id, moduleObjectId, typedMetadata, description);
         return new NextResponse(JSON.stringify(result), { status: 200 });
      }

      // Validate ObjectId for communityId if not "all"
      if (!Types.ObjectId.isValid(communityId)) {
         return new NextResponse('Invalid community ID', { status: 400 });
      }
      const communityObjectId = new Types.ObjectId(communityId);

      // Step 1: Calculate base points based on difficulty in metadata
      const difficulty = typedMetadata.find((tag: string) => ["easy", "medium", "hard"].includes(tag));
      const basePoints = difficulty ? await calculatePoints(communityObjectId, moduleObjectId, difficulty) : 0;

      // Step 2: Apply streak multiplier if applicable and get final points
      const finalPoints = await updateStreak(communityObjectId, user._id, basePoints);

      // Step 3: Prepare task data with final points and record the task
      const taskData = {
         userId: user._id,
         communityId: communityObjectId,
         moduleId: moduleObjectId,
         description,
         points: finalPoints, // Use streak-adjusted points
         metadata: typedMetadata,
      };

      const taskResult = await recordTask(taskData);

      return new NextResponse(JSON.stringify(taskResult), { status: 201 });
   } catch (error) {
      const err = error as Error;
      console.error('Error adding task:', err.message);
      return new NextResponse(err.message, { status: 500 });
   }
}


/**
POST http://localhost:3000/api/tasks/add
{
   "identifier": "67297c206f4082ed030f7728",
   "communityId": "672a8e5cfe46364da4a342d0", 
   "moduleId": "64ffdbcd9e73a0f2e05e48b9",    
   "description": "Leetcode Submission",
   "metadata": ["easy", "hashmap"]      //code will read for easy, medium, hard to adjust points, include question type here as well or any other attributes.
}
 */