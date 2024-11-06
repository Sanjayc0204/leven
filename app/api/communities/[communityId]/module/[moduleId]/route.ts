import { NextRequest, NextResponse } from 'next/server';
import { customizeModule, deleteModuleFromCommunity } from '@/services/communityService';
import { Types } from 'mongoose';

/**
 * Updates module settings within a community.
 *
 * @param {NextRequest} req - The request object.
 * @param {Object} params - The request parameters.
 * @param {string} params.communityId - The ID of the community.
 * @param {string} params.moduleId - The ID of the module.
 * @returns {Promise<NextResponse>} - The response object containing the updated community.
 */
export async function PUT(req: NextRequest, { params }: { params: { communityId: string; moduleId: string } }): Promise<NextResponse> {
  try {
    const { communityId, moduleId } = params;

    // Validate ObjectId
    if (!Types.ObjectId.isValid(communityId) || !Types.ObjectId.isValid(moduleId)) {
      return new NextResponse('Invalid community or module ID', { status: 400 });
    }

    const updateData = await req.json();  // Module settings passed in the body

    const updatedCommunity = await customizeModule(new Types.ObjectId(communityId), new Types.ObjectId(moduleId), updateData);

    return new NextResponse(JSON.stringify(updatedCommunity), { status: 200 });
  } catch (error) {
    const err = error as Error;
    console.error('Error customizing module:', err.message);
    return new NextResponse('Error customizing module', { status: 500 });
  }
}


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
 * PUT 
 * http://localhost:3000/api/communities/672a8e5cfe46364da4a342d0/module/64ffdbcd9e73a0f2e05e48b9
{
  "customizations": {
    "pointsScheme": {
      "easy": 50,
      "medium": 99,  // Customized points for medium difficulty
      "hard": 150
    }
  }
}
   
*/

/**
 * DELETE
 * http://localhost:3000/api/communities/672a8e5cfe46364da4a342d0/module/64ffdbcd9e73a0f2e05e48b9
 */
