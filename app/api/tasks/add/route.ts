import { NextRequest, NextResponse } from "next/server";   
import { Types } from 'mongoose';
import { calculatePoints, recordTask } from '@/services/taskService';
import { findUserByIdOrEmail } from '@/util/userUtils/getUserIdFromIdentifier';
import { connectToDB } from '@/util/connectToDB';

/**
 * Adds a new task and points associated for a user based on ID or Email.
 *
 * @param {NextRequest} req - The request object.
 * @returns {Promise<NextResponse>} - The response object.
 * 
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
   try {
      await connectToDB(); // Ensure database connection is established

      // Step 1: Parse the request body and log inputs
      const body = await req.json();
      const { identifier, communityId, moduleId, difficulty, description } = body;
      console.log("Request Body:", body);

      // Step 2: Find user by ID or email using utility function
      console.log("Searching user by identifier:", identifier);
      const user = await findUserByIdOrEmail(identifier);
      if (!user) {
         console.log("User not found:", identifier);
         return new NextResponse('User not found', { status: 404 });
      }
      console.log("User found:", user);

      // Step 3: Validate and convert communityId and moduleId
      if (!Types.ObjectId.isValid(communityId) || !Types.ObjectId.isValid(moduleId)) {
         console.log("Invalid community ID or module ID:", communityId, moduleId);
         return new NextResponse('Invalid community ID or module ID', { status: 400 });
      }

      const communityObjectId = new Types.ObjectId(communityId);
      const moduleObjectId = new Types.ObjectId(moduleId);
      console.log("Validated ObjectIds - Community:", communityObjectId, "Module:", moduleObjectId);

      // Step 4: Calculate points for the task
      const points = await calculatePoints(communityObjectId, moduleObjectId, difficulty);
      console.log("Calculated Points:", points);

      // Step 5: Record the task with the calculated points
      const taskData = {
         userId: user._id, // Use user._id obtained from findUserByIdOrEmail
         communityId: communityObjectId,
         moduleId: moduleObjectId,
         difficulty,
         description,
         points,
      };
      console.log("Task Data:", taskData);

      const taskResult = await recordTask(taskData);
      console.log("Task Recorded:", taskResult);

      // Step 6: Respond with the recorded task details
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
   "difficulty": "medium",                    
   "description": "Leetcode Submission"
}
 */