import { NextRequest, NextResponse } from 'next/server';
import { updateModuleScore } from '@/services/communityService';
import { Types } from 'mongoose';

/**
 * API endpoint to update module score for a user within a community.
 */
export async function POST(req: NextRequest, { params }: { params: { communityId: string; moduleId: string } }): Promise<NextResponse> {
  const { communityId, moduleId } = params;
  const { userId, score } = await req.json();

  // Validate ObjectIds
  if (!Types.ObjectId.isValid(communityId) || !Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(moduleId)) {
    return new NextResponse(JSON.stringify({ success: false, error: 'Invalid IDs' }), { status: 400 });
  }

  try {
    const community = await updateModuleScore(
      new Types.ObjectId(communityId),
      new Types.ObjectId(userId),
      new Types.ObjectId(moduleId),
      score
    );

    return new NextResponse(JSON.stringify({ success: true, data: community }), { status: 200 });
  } catch (error) {
    const err = error as Error;
    return new NextResponse(JSON.stringify({ success: false, error: err.message }), { status: 500 });
  }
}


// POST http://localhost:3000/api/communities/670ecf6e68be8ab7782a7bcd/module/64ffdbcd9e73a0f2e05e48b9/update-score

// body:
// "userId": "670b3b2f330b94cfb7710f55",
// "score": 50
// }



// it will update the score in the 'module progress; section