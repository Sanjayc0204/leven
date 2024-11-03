import { NextRequest, NextResponse } from 'next/server';
import { updateModuleScore } from '@/services/communityService';
import { Types } from 'mongoose';

/**
 * API endpoint to update module score for a user within a community.
 */
export async function POST(req: NextRequest, { params }: { params: { communityId: string; moduleId: string } }): Promise<NextResponse> {
  const { communityId, moduleId } = params;
  const { userIdentifier, score } = await req.json();

  console.log('Received request with:', { communityId, moduleId, userIdentifier, score });

  // Validate ObjectIds for communityId and moduleId
  if (!Types.ObjectId.isValid(communityId) || !Types.ObjectId.isValid(moduleId)) {
    console.error('Invalid community or module ID');
    return new NextResponse(JSON.stringify({ success: false, error: 'Invalid community or module ID' }), { status: 400 });
  }

  try {
    const community = await updateModuleScore(
      new Types.ObjectId(communityId),
      userIdentifier,
      new Types.ObjectId(moduleId),
      score
    );

    console.log('Update module score successful. Updated community:', community);

    return new NextResponse(JSON.stringify({ success: true, data: community }), { status: 200 });
  } catch (error) {
    console.error('Error in updateModuleScore:', error);
    return new NextResponse(JSON.stringify({ success: false }), { status: 500 });
  }
}


// POST http://localhost:3000/api/communities/671d5e81d3e3cce1da36fc6b/module/64ffdbcd9e73a0f2e05e48b9/update-score

// {
//   "userIdentifier": "sanjaychunduru@gmail.com",
//   "score": 50
//   }


// it will update the score in the 'module progress; section