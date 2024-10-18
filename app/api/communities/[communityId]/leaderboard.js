// pages/api/community/leaderboard
import { getLeaderboard } from '@/services/communityService';

//retrieve leaderboard info for particular communityId
export async function GET(req, { params }) {
  try {
    const { communityId } = params;
    const leaderboard = await getLeaderboard(communityId);
    return new Response(JSON.stringify(leaderboard), { status: 200 });
  } catch (error) {
    return new Response('Error fetching leaderboard', { status: 500 });
  }
}