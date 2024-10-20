// app/api/communities/[communityId]
// GET (community info), POST (update info), DELETE (delete community)

import { getCommunityById, updateCommunity, deleteCommunity } from '@/services/communityService';
import { NextRequest, NextResponse } from 'next/server';
import { Types } from 'mongoose';

/**
 * Get details about a community by its ID.
 *
 * @param {NextRequest} req - The incoming request object.
 * @param {Object} params - The request parameters.
 * @param {string} params.communityId - The ID of the community.
 * @returns {Promise<NextResponse>} - The response object containing the community details.
 */
export async function GET(req: NextRequest, { params }: { params: { communityId: string } }): Promise<NextResponse> {
  try {
    const { communityId } = params;

    // Validate communityId as ObjectId
    if (!Types.ObjectId.isValid(communityId)) {
      return new NextResponse('Invalid community ID', { status: 400 });
    }

    // Fetch the community by ID
    const community = await getCommunityById(new Types.ObjectId(communityId));

    if (!community) {
      return new NextResponse('Community not found', { status: 404 });
    }

    return new NextResponse(JSON.stringify(community), { status: 200 });
  } catch (error) {
    console.error('Error fetching community:', error);
    return new NextResponse('Error fetching community', { status: 500 });
  }
}

/**
 * Update community information, including title, description, image and (future) settings.
 *
 * @param {NextRequest} req - The incoming request object.
 * @param {Object} params - The request parameters.
 * @param {string} params.communityId - The ID of the community to update.
 * @returns {Promise<NextResponse>} - The response object containing the updated community details.
 */
export async function PUT(req: NextRequest, { params }: { params: { communityId: string } }): Promise<NextResponse> {
  try {
    const { communityId } = params;

    // Validate communityId as ObjectId
    if (!Types.ObjectId.isValid(communityId)) {
      return new NextResponse('Invalid community ID', { status: 400 });
    }

    // Parse request body
    const body = await req.json();
    const { updateData, adminId } = body;

    if (!updateData || !adminId) {
      return new NextResponse('Missing update data or admin ID', { status: 400 });
    }

    const updatedCommunity = await updateCommunity(new Types.ObjectId(communityId), updateData, new Types.ObjectId(adminId));

    return new NextResponse(JSON.stringify(updatedCommunity), { status: 200 });
  } catch (error) {
    console.error('Error updating community:', error);
    return new NextResponse('Error updating community', { status: 500 });
  }
}

/**
 * Delete a community by its ID.
 *
 * @param {NextRequest} req - The incoming request object.
 * @param {Object} params - The request parameters.
 * @param {string} params.communityId - The ID of the community to delete.
 * @returns {Promise<NextResponse>} - The response object with the deletion result.
 */
export async function DELETE(req: NextRequest, { params }: { params: { communityId: string } }): Promise<NextResponse> {
  try {
    const { communityId } = params;

    // Validate communityId as ObjectId
    if (!Types.ObjectId.isValid(communityId)) {
      return new NextResponse('Invalid community ID', { status: 400 });
    }

    const body = await req.json();
    const { adminId } = body;

    if (!adminId) {
      return new NextResponse('Admin ID is required to delete the community', { status: 400 });
    }

    const result = await deleteCommunity(new Types.ObjectId(communityId), new Types.ObjectId(adminId));

    return new NextResponse(JSON.stringify(result), { status: 200 });
  } catch (error) {
    console.error('Error deleting community:', error);
    return new NextResponse('Error deleting community', { status: 500 });
  }
}



// Testing purposes:

// GET http://localhost:3000/api/communities/670ecf6e68be8ab7782a7bcd

// PUT http://localhost:3000/api/communities/670ecf6e68be8ab7782a7bcd
// JSON:
// {
//   "updateData": {
//     "name": "Leetcode Study Group NYU",
//     "description": "This is community description.",
//     "image":"https://codeskulptor-demos.commondatastorage.googleapis.com/GalaxyInvaders/back02.jpg"
//   },
//   "adminId": "670b3b2f330b94cfb7710f55"
// }

// Note: First make a random community
// DELETE http://localhost:3000/api/communities/670ecf6e68be8ab7782a7aaa
// JSON:
// {
//   "adminId": "670b3b2f330b94cfb7710f55"
// }



