import { kickMember, changeMemberRole, getUserStatsInCommunity } from '@/services/communityService';
import { NextRequest, NextResponse } from 'next/server';
import { Types } from 'mongoose';

// GET user stats in community
// DELETE kick users
// PATCH change user roles

/**
 * Fetches a user's stats within a community.
 *
 * @param {NextRequest} req - The incoming request object.
 * @param {Object} params - The request parameters.
 * @param {string} params.communityId - The ID of the community.
 * @param {string} params.userId - The ID of the user whose stats are being fetched.
 * @returns {Promise<NextResponse>} - The response object containing the user's stats.
 */
export async function GET(req: NextRequest, { params }: { params: { communityId: string; userId: string } }): Promise<NextResponse> {
  try {
    const { communityId, userId } = params;

    // Validate ObjectId types
    if (!Types.ObjectId.isValid(communityId) || !Types.ObjectId.isValid(userId)) {
      return new NextResponse('Invalid community ID or user ID', { status: 400 });
    }

    // Convert to ObjectId
    const communityObjectId = new Types.ObjectId(communityId);
    const userObjectId = new Types.ObjectId(userId);

    // Fetch user stats in the community
    const userStats = await getUserStatsInCommunity(communityObjectId, userObjectId);

    return new NextResponse(JSON.stringify(userStats), { status: 200 });
  } catch (error) {
    const err = error as Error;
    console.error('Error fetching user stats:', err.message);
    return new NextResponse(err.message, { status: 500 });
  }
}



/**
 *  kicking members
 *
 * @param {NextRequest} req - The incoming request object.
 * @param {Object} params - The request parameters.
 * @param {string} params.communityId - The ID of the community.
 * @param {string} params.userId - The ID of the member to manipulate.
 * @returns {Promise<NextResponse>} - The response object.
 */
export async function DELETE(req: NextRequest, { params }: { params: { communityId: string, userId: string } }): Promise<NextResponse> {
  try {
    const { communityId, userId } = params;
    const body = await req.json();
    const { adminId } = body;

    // Validate ObjectId types
    if (!Types.ObjectId.isValid(communityId) || !Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(adminId)) {
      return new NextResponse('Invalid community ID, user ID, or admin ID', { status: 400 });
    }

    const communityObjectId = new Types.ObjectId(communityId);
    const userObjectId = new Types.ObjectId(userId);
    const adminObjectId = new Types.ObjectId(adminId);

    // Kick the member
    await kickMember(communityObjectId, userObjectId, adminObjectId);

    return new NextResponse('Member kicked successfully', { status: 200 });
  } catch (error) {
    const err = error as Error; // Cast error to Error type
    console.error('Error kicking member:', err.message);
    return new NextResponse(err.message, { status: 500 });
  }
}



/**
 * Handles changing a member's role (admin/member).
 *
 * @param {NextRequest} req - The incoming request object.
 * @param {Object} params - The request parameters.
 * @param {string} params.communityId - The ID of the community.
 * @param {string} params.userId - The ID of the member whose role is being changed.
 * @returns {Promise<NextResponse>} - The response object.
 */
export async function PATCH(req: NextRequest, { params }: { params: { communityId: string, userId: string } }): Promise<NextResponse> {
  try {
    const { communityId, userId } = params;
    const body = await req.json();
    const { newRole, adminId } = body;

    // Validate ObjectId types
    if (!Types.ObjectId.isValid(communityId) || !Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(adminId)) {
      return new NextResponse('Invalid community ID, user ID, or admin ID', { status: 400 });
    }

    // Ensure the new role is valid
    if (!['admin', 'member'].includes(newRole)) {
      return new NextResponse('Invalid role', { status: 400 });
    }

    const communityObjectId = new Types.ObjectId(communityId);
    const userObjectId = new Types.ObjectId(userId);
    const adminObjectId = new Types.ObjectId(adminId);

    // Change the member's role
    await changeMemberRole(communityObjectId, userObjectId, newRole, adminObjectId);

    return new NextResponse('Role updated successfully', { status: 200 });
  } catch (error) {
    const err = error as Error; // Cast error to Error type
    console.error('Error changing member role:', err.message);
    return new NextResponse(err.message, { status: 500 });
  }
}




