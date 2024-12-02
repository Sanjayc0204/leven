import { NextRequest, NextResponse } from 'next/server';
import { customizeModule } from '@/services/communityService';
import { Types } from 'mongoose';

/**
 * Updates an existing module's customizations settings within a community.
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

    const customizations = await req.json();  // Flexible customizations object

    const updatedCommunity = await customizeModule(
      new Types.ObjectId(communityId),
      new Types.ObjectId(moduleId),
      customizations
    );  

    return new NextResponse(JSON.stringify(updatedCommunity), { status: 200 });
  } catch (error) {
    const err = error as Error;
    console.error('Error customizing module:', err.message);
    return new NextResponse('Error customizing module', { status: 500 });
  }
}


/**
 * 
 * The JSON bodies are crucial here
 * The way you can go about this is fetch the module details first to see what customizations they have
 * After that, you can input based on those customizations and go from there
 * 
 * PUT 
 * http://localhost:3000/api/communities/672a8e5cfe46364da4a342d0/module/64ffdbcd9e73a0f2e05e48b9/customizeModule
 * 
 * Pomodoro
 * 
{
    "pointsScheme": {
        "perMinute": 5
    },
    "siteRestrictions": {
        "allowedSites": ["*google.com/docs*", "*github.com*"],
        "prohibitedSites": ["*youtube.com*", "*facebook.com*", "*reddit.com*"]
    }
}


Leetcode
   
{
    "pointsScheme": {
        "easy": 5
        "medium": 10
        "hard": 15
    }
}

*/



