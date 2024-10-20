import { joinCommunity } from '@/services/communityService';
import { NextRequest, NextResponse } from 'next/server';
import { Types } from 'mongoose';

/**
 * Allows a user to join a community.
 *
 * @param {NextRequest} req - The request object.
 * @param {Object} params - The request params.
 * @param {string} params.communityId - The ID of the community to join.
 * @returns {Promise<NextResponse>} - The response object.
 */
export async function POST(req: NextRequest, { params }: { params: { communityId: string } }): Promise<NextResponse> {
  try {
    const { communityId } = params;
    const body = await req.json();
    const { userId } = body;

    if (!Types.ObjectId.isValid(communityId) || !Types.ObjectId.isValid(userId)) {
      return new NextResponse('Invalid community ID or user ID', { status: 400 });
    }

    const communityObjectId = new Types.ObjectId(communityId);
    const userObjectId = new Types.ObjectId(userId);

    const result = await joinCommunity(communityObjectId, userObjectId);

    return new NextResponse(JSON.stringify(result), { status: 200 });
  } catch (error) {
    const err = error as Error; // Explicitly cast error to Error type
    console.error('Error joining community:', err.message);
    return new NextResponse(err.message, { status: 500 });
  }
}



// test
// POST: http://localhost:3000/api/communities/670ecf6e68be8ab7782a7bcd/join

// {
//   "userId": "670ed82511c2c5ec6763856b"
// }
