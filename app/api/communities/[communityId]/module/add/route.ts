import { NextRequest, NextResponse } from 'next/server';
import { addModuleToCommunity } from '@/services/communityService';
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
    const { communityId } = params;
    const { moduleId }: { moduleId: string } = await req.json();  // Module ID from request body

    // Validate communityId and moduleId as ObjectId
    if (!Types.ObjectId.isValid(communityId) || !Types.ObjectId.isValid(moduleId)) {
      return new NextResponse('Invalid community or module ID', { status: 400 });
    }

    const updatedCommunity = await addModuleToCommunity(new Types.ObjectId(communityId), new Types.ObjectId(moduleId));

    return new NextResponse(JSON.stringify(updatedCommunity), { status: 200 });
  } catch (error) {
    const err = error as Error;
    console.error('Error adding module to community:', err.message);
    return new NextResponse('Error adding module to community', { status: 500 });
  }
}
