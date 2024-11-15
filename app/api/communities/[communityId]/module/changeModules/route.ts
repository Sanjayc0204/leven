import { NextRequest, NextResponse } from 'next/server';
import { addModuleToCommunity, updateCommunityModules } from '@/services/communityService';
import { connectToDB } from '@/util/connectToDB';  
import { Types } from 'mongoose';


/**
 *  
 *  THIS ENDPOINT HAS BOTH POST AND PUT
 *  For adding vs multiselect
 * 
 */


/**
 * Adds a module to a community.
 *
 * @param {NextRequest} req - The request object.
 * @param {Object} params - The request parameters.
 * @param {string} params.communityId - The ID of the community.
 * @returns {Promise<NextResponse>} - The response object containing the updated community.
 */
export async function POST(req: NextRequest, { params }: { params: { communityId: string } }): Promise<NextResponse> {
  try {
      // Ensure the database is connected
      await connectToDB();

      const { communityId } = params;
      const { moduleId, userId } = await req.json();  // Extract moduleId and userId from request body

      // Validate communityId, moduleId, and userId as ObjectId
      if (!Types.ObjectId.isValid(communityId) || !Types.ObjectId.isValid(moduleId) || !Types.ObjectId.isValid(userId)) {
          return new NextResponse('Invalid community, module, or user ID', { status: 400 });
      }

      const communityObjectId = new Types.ObjectId(communityId);
      const moduleObjectId = new Types.ObjectId(moduleId);
      const userObjectId = new Types.ObjectId(userId);

      // Use the service function to add the module
      const updatedCommunity = await addModuleToCommunity(
          communityObjectId,
          moduleObjectId,
          userObjectId
      );

      return new NextResponse(JSON.stringify(updatedCommunity), { status: 200 });
  } catch (error) {
      const err = error as Error;
      console.error('Error adding module to community:', err.message);
      return new NextResponse(err.message, { status: 500 });
  }
}


/**
 * Updates the modules list in a community.
 *
 * @param {NextRequest} req - The request object.
 * @param {Object} params - The request parameters.
 * @param {string} params.communityId - The ID of the community.
 * @returns {Promise<NextResponse>} - The response object containing the updated community.
 */
export async function PUT(req: NextRequest, { params }: { params: { communityId: string } }): Promise<NextResponse> {
    try {
        await connectToDB();
  
        const { communityId } = params;
        const { moduleIds, userId } = await req.json();  // Expect moduleIds to be an array of module IDs
  
        // Validate communityId and userId as ObjectId and moduleIds as an array of ObjectId
        if (!Types.ObjectId.isValid(communityId) || !Types.ObjectId.isValid(userId) || !Array.isArray(moduleIds) || !moduleIds.every(Types.ObjectId.isValid)) {
            return new NextResponse('Invalid community, module, or user ID(s)', { status: 400 });
        }
  
        const communityObjectId = new Types.ObjectId(communityId);
        const userObjectId = new Types.ObjectId(userId);
        const moduleObjectIds = moduleIds.map(id => new Types.ObjectId(id));
  
        // Call the service to update the modules
        const updatedCommunity = await updateCommunityModules(
            communityObjectId,
            moduleObjectIds,
            userObjectId
        );
  
        return new NextResponse(JSON.stringify(updatedCommunity), { status: 200 });
    } catch (error) {
        const err = error as Error;
        console.error('Error updating community modules:', err.message);
        return new NextResponse(err.message, { status: 500 });
    }
  }



// PUT http://localhost:3000/api/communities/672a8e5cfe46364da4a342d0/module/changeModules
// Leetcode module, Pomodoro
/** 
{
    "moduleIds": ["64ffdbcd9e73a0f2e05e48b9", "67369ccc933d83ab9d34aafe"],
    "userId": "672ce741c1ef242211fe7d9b"
}
 */

