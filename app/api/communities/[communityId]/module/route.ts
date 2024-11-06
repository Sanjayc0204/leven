import { NextRequest, NextResponse } from 'next/server';
import { addModuleToCommunity, getCommunityModules } from '@/services/communityService';
import { connectToDB } from '@/util/connectToDB';  // Ensure this path is correct for your connection utility
import { Types } from 'mongoose';



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


// POST http://localhost:3000/api/communities/672a8e5cfe46364da4a342d0/module
// Leetcode module

/** 
{
    "moduleId": "64ffdbcd9e73a0f2e05e48b9",
    "userId": "670b3b2f330b94cfb7710f55"    //check if creator or admin
}
 */


// GET http://localhost:3000/api/communities/670ecf6e68be8ab7782a7bcd/module
// {
//   "success": true,
//   "data": [
//     {
//       "moduleId": {
//         "customizations": {
//           "pointsScheme": {
//             "easy": 50,
//             "medium": 100,
//             "hard": 150
//           }
//         },
//         "_id": "64ffdbcd9e73a0f2e05e48b9",
//         "name": "Leetcode",
//         "moduleType": "coding_platform",
//         "createdAt": "2024-10-18T00:00:00.000Z"
//       },
//       "_id": "671d1e890c161dcd65d4f773"
//     }
//   ]
// }

