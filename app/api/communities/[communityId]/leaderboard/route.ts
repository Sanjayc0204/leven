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

    return new NextResponse(JSON.stringify({ success: true, data: leaderboard }), { status: 200 });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return new NextResponse('Error fetching leaderboard', { status: 500 });
  }
}


// test
// GET http://localhost:3000/api/communities/671d5e81d3e3cce1da36fc6b/leaderboard
// output:
/* 


{
  "success": true,
  "data": [
    {
      "userId": "6716cc0a3b35d6130f160c77",
      "username": "sanjaychunduru",
      "image": "https://lh3.googleusercontent.com/a/ACg8ocLFGS6C0C2u5rutcW4YUOP3Ifdwgazr58-GUPSX4uZEm3D2MK8K=s96-c",
      "totalPoints": 250
    },
    {
      "userId": "670ed82511c2c5ec6763856b",
      "username": "andrewlee",
      "image": "https://lh3.googleusercontent.com/a/ACg8ocJPBlAe6Y2-SSUTlO8JQvbZciJNIDrvxp5DulQ_V-y7hIurQMo=s96-c",
      "totalPoints": 150
    }
  ]
}

*/