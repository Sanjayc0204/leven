// app/api/communities/create/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { createCommunity } from '@/services/communityService';
import { Types } from 'mongoose';

/**
 * POST endpoint to create a new community.
 *
 * @param {NextRequest} req - The incoming request object.
 * @returns {Promise<NextResponse>} - The response object containing success status and created community data.
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { name, creatorId, description, image } = await req.json();

    // Validate the creatorId is a valid ObjectId
    if (!Types.ObjectId.isValid(creatorId)) {
      return new NextResponse(JSON.stringify({ success: false, error: 'Invalid creator ID' }), { status: 400 });
    }

    // Call the service to create a community
    const community = await createCommunity(name, new Types.ObjectId(creatorId), description, image);
    
    return new NextResponse(JSON.stringify({ success: true, data: community }), { status: 201 });
  } catch (error) {
    // Assert error as Error type to access `message`
    const err = error as Error;
    console.error('Error creating community:', err.message);
    return new NextResponse(JSON.stringify({ success: false, error: err.message }), { status: 500 });
  }
}

// POST http://localhost:3000/api/communities/create
// {
//   "name": "LeetCode Study Group",
//   "creatorId": "670b3b2f330b94cfb7710f55",
//   "description": "This is a study group for LeetCode",
//   "image": "https://codeskulptor-demos.commondatastorage.googleapis.com/GalaxyInvaders/back02.jpg"
// }
