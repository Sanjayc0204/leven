import { NextRequest, NextResponse } from 'next/server';
import { getUserModules } from '@/services/userService';
import { findUserByIdOrEmail } from '@/util/userUtils/getUserIdFromIdentifier';
import { connectToDB } from '@/util/connectToDB'; 
/**
 * Fetches all unique modules a user is part of.
 * Accepts both email and ID of user
 *
 * @param {NextRequest} req - The request object.
 * @param {Object} params - The request parameters.
 * @param {string} params.identifier - The user's ID (ObjectId) or email.
 * @returns {Promise<NextResponse>} - The response containing unique modules.
 */
export async function GET(req: NextRequest, { params }: { params: { identifier: string } }): Promise<NextResponse> {
    await connectToDB();
  
    const { identifier } = params;
  
    try {
      // Find the user by ID or email
      const user = await findUserByIdOrEmail(identifier);
  
      if (!user) {
        return new NextResponse(JSON.stringify({ success: false, error: 'User not found' }), { status: 404 });
      }
  
      // Fetch the user's unique modules
      const modules = await getUserModules(user._id);
  
      return new NextResponse(JSON.stringify({ success: true, data: modules }), { status: 200 });
    } catch (error) {
      console.error('Error fetching user modules:', error);
      return new NextResponse(JSON.stringify({ success: false, error: (error as Error).message }), { status: 500 });
    }
  }