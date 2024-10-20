import { getLeaderboardByCommunityId } from '@/services/communityService';
import { NextRequest, NextResponse } from 'next/server';
import { Types } from 'mongoose';

/**
 * Fetches leaderboard information for members of a community.
 *
 * @param {NextRequest} req - The request object.
 * @param {Object} params - The request params.
 * @param {string} params.communityId - The ID of the community.
 * @returns {Promise<NextResponse>} - The response containing leaderboard data.
 */
export async function GET(req: NextRequest, { params }: { params: { communityId: string } }): Promise<NextResponse> {
  try {
    const { communityId } = params;

    // Validate communityId as ObjectId
    if (!Types.ObjectId.isValid(communityId)) {
      return new NextResponse('Invalid community ID', { status: 400 });
    }

    // Convert the string to ObjectId
    const objectId = new Types.ObjectId(communityId);

    // Fetch leaderboard by community ID
    const leaderboard = await getLeaderboardByCommunityId(objectId);

    return new NextResponse(JSON.stringify(leaderboard), { status: 200 });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return new NextResponse('Error fetching leaderboard', { status: 500 });
  }
}


// test
// GET http://localhost:3000/api/communities/670ecf6e68be8ab7782a7bcd/leaderboard
// output:
/* 
Return
Note, if user does not exist in user db, it will appear as null

[
  {
    "_id": null,
    "role": "admin",
    "points": 100,
    "moduleProgress": []
  },
  {
    "_id": {
      "_id": "670ed82511c2c5ec6763856b",
      "username": "andrewlee"
    },
    "role": "member",
    "points": 2000,
    "moduleProgress": []
  },
  {
    "_id": null,
    "role": "member",
    "points": 0,
    "moduleProgress": []
  }
]

*/

