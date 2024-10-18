import { joinCommunity } from '@/services/communityService';

export async function POST(req, { params }) {
  try {
    const { communityId } = params;
    const body = await req.json();
    const { userId } = body;

    const result = await joinCommunity(communityId, userId);
    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    return new Response('Error joining community', { status: 500 });
  }
}
