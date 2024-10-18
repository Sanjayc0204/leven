// integrate into service layers
import { fetchAllCommunities } from '@/services/communityService';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const searchQuery = searchParams.get('searchQuery');

    // Fetch communities via service function
    const communities = await fetchAllCommunities(searchQuery);
    
    return new Response(JSON.stringify(communities), { status: 200 });
  } catch (error) {
    console.error('Error fetching communities:', error);
    return new Response('Error fetching communities', { status: 500 });
  }
}


//Test GET http://localhost:3000/api/communities/all