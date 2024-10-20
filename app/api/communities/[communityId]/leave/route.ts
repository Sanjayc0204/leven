import { leaveCommunity } from '@/services/communityService';
import { NextRequest, NextResponse } from 'next/server';
import { Types } from 'mongoose';

/**
 * Allows the authenticated user to leave the community.
 *
 * @param {NextRequest} req - The request object.
 * @param {Object} params - The request params.
 * @param {string} params.communityId - The ID of the community.
 * @returns {Promise<NextResponse>} - The response object.
 */
export async function POST(req: NextRequest, { params }: { params: { communityId: string } }): Promise<NextResponse> {
  try {
    const { communityId } = params;
    const body = await req.json();
    const { userId } = body;

    // Validate communityId and userId as ObjectId
    if (!Types.ObjectId.isValid(communityId) || !Types.ObjectId.isValid(userId)) {
      return new NextResponse('Invalid community ID or user ID', { status: 400 });
    }

    // Convert communityId and userId to ObjectId
    const communityObjectId = new Types.ObjectId(communityId);
    const userObjectId = new Types.ObjectId(userId);

    const result = await leaveCommunity(communityObjectId, userObjectId);

    return new NextResponse(JSON.stringify(result), { status: 200 });
  } catch (error) {
    console.error('Error leaving community:', error);
    return new NextResponse('Error leaving community', { status: 500 });
  }
}

//POST  http://localhost:3000/api/communities/670ecf6e68be8ab7782a7bcd/leaderboard

/*

{
  "userId": "ObjectId_of_jane_doe"
}
  
*/
