import { kickMemberFromCommunity } from '@/services/communityService';

export async function POST(req, { params }) {
  try {
    const { communityId } = params;
    const body = await req.json();
    const { userIdToKick, adminId } = body;

    const result = await kickMemberFromCommunity(communityId, userIdToKick, adminId);
    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    return new Response('Error kicking member', { status: 500 });
  }
}
