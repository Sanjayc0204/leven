import { NextRequest, NextResponse } from 'next/server';
import { generateInviteLink } from '@/services/inviteService';
import { Types } from 'mongoose';

export async function POST(req: NextRequest, { params }: { params: { communityId: string } }): Promise<NextResponse> {
    console.log('[POST] Start');
    console.log(`[POST] Received communityId: ${params.communityId}`);
  
    try {
      const { communityId } = params;
  
      // Validate community ID
      console.log('[POST] Validating community ID...');
      if (!Types.ObjectId.isValid(communityId)) {
        console.error('[POST] Invalid community ID');
        return new NextResponse('Invalid community ID', { status: 400 });
      }
  
      const userId = req.headers.get('user-id');
      console.log(`[POST] Received userId: ${userId}`);
  
      if (!userId) {
        console.error('[POST] User ID not provided in headers');
        return new NextResponse('Unauthorized', { status: 401 });
      }
  
      console.log('[POST] Generating invite link...');
      const inviteData = await generateInviteLink(new Types.ObjectId(communityId), userId);
  
      console.log('[POST] Invite link generated successfully');
      return new NextResponse(JSON.stringify(inviteData), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
        const err = error as Error; // Explicitly cast to Error
      console.error('[POST] Error generating invite link:', err.message);
  
      if (err.name === 'MongooseError' || err.message.includes('buffering timed out')) {
        return new NextResponse('Database timeout. Please try again later.', { status: 500 });
      }
  
      return new NextResponse('Internal Server Error', { status: 500 });
    }
  }
  


/**
 http://localhost:3000/api/communities/672fe38a5957fa9d997fd2b3/generateInviteLink
 HEADERS: "user-id": "64ffdbcd9e73a0f2e05e48b9"

should reply with a day expiration link

{
  "token": "unique-invite-token",
  "expiresAt": "2023-11-15T12:00:00.000Z"
}
 
 */