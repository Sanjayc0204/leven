import { NextRequest, NextResponse } from 'next/server';
import { revokeInviteLink } from '@/services/inviteService';
import { Types } from 'mongoose';

export async function DELETE(req: NextRequest, { params }: { params: { communityId: string } }): Promise<NextResponse> {
  try {
    const { communityId } = params;

    // Validate community ID
    if (!Types.ObjectId.isValid(communityId)) {
      return new NextResponse('Invalid community ID', { status: 400 });
    }

    const userId = req.headers.get('user-id'); // Replace with your auth middleware
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Revoke the invite link
    await revokeInviteLink(new Types.ObjectId(communityId), userId);

    return new NextResponse('Invite link successfully revoked', { status: 200 });
  } catch (error) {
    console.error('Error revoking invite link:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
