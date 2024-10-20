// integrate into service layers

import { fetchAllCommunities } from '@/services/communityService';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET endpoint to fetch all communities or search for specific communities.
 *
 * @param {NextRequest} req - The incoming request object.
 * @returns {Promise<NextResponse>} - The response object containing the fetched communities.
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    // Parse the search query from the request URL
    const { searchParams } = new URL(req.url);
    const searchQuery = searchParams.get('searchQuery') || '';

    // Fetch communities using the service layer function
    const communities = await fetchAllCommunities(searchQuery);
    
    return new NextResponse(JSON.stringify(communities), { status: 200 });
  } catch (error) {
    const err = error as Error;
    console.error('Error fetching communities:', err.message);
    return new NextResponse('Error fetching communities', { status: 500 });
  }
}



//Test GET http://localhost:3000/api/communities/all