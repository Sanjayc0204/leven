import { NextRequest, NextResponse } from 'next/server';
import { getCommunityModules } from '@/services/communityService';
import { connectToDB } from '@/util/connectToDB';
import { Types } from 'mongoose';

/**
 * Fetches all modules for a specific community by ID.
 *
 * @param {NextRequest} req - The request object.
 * @param {Object} params - The request parameters.
 * @param {string} params.communityId - The ID of the community.
 * @returns {Promise<NextResponse>} - The response object containing modules data or error message.
 */
export async function GET(req: NextRequest, { params }: { params: { communityId: string } }): Promise<NextResponse> {
  await connectToDB();

  const { communityId } = params;

  // Validate the communityId
  if (!Types.ObjectId.isValid(communityId)) {
    return new NextResponse(JSON.stringify({ success: false, error: 'Invalid community ID format' }), { status: 400 });
  }

  try {
    // Fetch all modules associated with the community
    const modules = await getCommunityModules(new Types.ObjectId(communityId));

    return new NextResponse(JSON.stringify({ success: true, data: modules }), { status: 200 });
  } catch (error) {
    console.error('Error fetching community modules:', error);
    return new NextResponse(JSON.stringify({ success: false, error: (error as Error).message }), { status: 500 });
  }
}

// GET http://localhost:3000/api/communities/670ecf6e68be8ab7782a7bcd/module/getModule
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

