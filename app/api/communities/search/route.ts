import { NextRequest, NextResponse } from 'next/server';
import Community from '@/models/Community.model';
import { connectToDB } from '@/util/connectToDB';

/**
 * Search for communities by name (case-insensitive, partial match).
 *
 * @param {NextRequest} req - The incoming request object.
 * @returns {Promise<NextResponse>} - The response with a list of matching communities.
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    await connectToDB();

    const name = req.nextUrl.searchParams.get("name");
    if (!name) {
      return new NextResponse(JSON.stringify({ success: false, error: 'Missing search parameter: name' }), { status: 400 });
    }

    // Perform a case-insensitive, partial match on the community name
    const communities = await Community.find({
      name: { $regex: name, $options: 'i' }  // Case-insensitive partial match
    });

    return new NextResponse(JSON.stringify({ success: true, data: communities }), { status: 200 });
  } catch (error) {
    console.error('Error searching communities:', error);
    return new NextResponse(JSON.stringify({ success: false, error: 'Error searching communities' }), { status: 500 });
  }
}

// Search for Leet in title
// GET http://localhost:3000/api/communities/search?name=Leet