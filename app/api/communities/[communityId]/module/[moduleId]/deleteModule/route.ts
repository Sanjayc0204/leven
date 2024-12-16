import { NextRequest, NextResponse } from 'next/server';
import { deleteModuleFromCommunity } from '@/services/communityService';
import { Types } from 'mongoose';

/**
 * Deletes a module from a community.
 *
 * @param {NextRequest} req - The request object.
 * @param {Object} params - The request parameters.
 * @param {string} params.communityId - The ID of the community.
 * @param {string} params.moduleId - The ID of the module.
 * @returns {Promise<NextResponse>} - The response object containing a success message.
 */
export async function DELETE(req: NextRequest, { params }: { params: { communityId: string; moduleId: string } }): Promise<NextResponse> {
  try {
    const { communityId, moduleId } = params;

    // Validate ObjectId
    if (!Types.ObjectId.isValid(communityId) || !Types.ObjectId.isValid(moduleId)) {
      return new NextResponse('Invalid community or module ID', { status: 400 });
    }

    const result = await deleteModuleFromCommunity(new Types.ObjectId(communityId), new Types.ObjectId(moduleId));

    return new NextResponse(JSON.stringify(result), { status: 200 });
  } catch (error) {
    const err = error as Error;
    console.error('Error deleting module from community:', err.message);
    return new NextResponse('Error deleting module from community', { status: 500 });
  }
}

/**
 * DELETE
 * http://localhost:3000/api/communities/672a8e5cfe46364da4a342d0/module/64ffdbcd9e73a0f2e05e48b9/deleteModule
 */
