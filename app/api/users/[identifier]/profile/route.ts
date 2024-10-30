import { NextRequest, NextResponse } from 'next/server';
import { getUserProfile, updateUserProfile, getUserProfileByEmail } from '@/services/userService';
import { connectToDB } from '@/util/connectToDB';
import User, {IUser} from '@/models/User.model';
import { Types } from 'mongoose';  // Import Types for ObjectId handling

/**
 * Fetches the profile of a specific user by ID or email.
 *
 * @param {NextRequest} req - The request object.
 * @param {Object} params - The request parameters.
 * @param {string} params.userIdOrEmail - The ID or email of the user.
 * @returns {Promise<NextResponse>} - The response object containing user profile data.
 */
export async function GET(req: NextRequest, { params }: { params: {identifier: string } }): Promise<NextResponse> {
  await connectToDB();
  const { identifier } = params;
  let user;

  try {
    // Determine if `userIdOrEmail` is an ObjectId or email
    user = Types.ObjectId.isValid(identifier)
      ? await getUserProfile(new Types.ObjectId(identifier))
      : await getUserProfileByEmail(identifier);

    if (!user) {
      return new NextResponse(JSON.stringify({ success: false, error: 'User not found' }), { status: 404 });
    }

    return new NextResponse(JSON.stringify({ success: true, data: user }), { status: 200 });
  } catch (error) {
    return new NextResponse(JSON.stringify({ success: false, error: (error as Error).message }), { status: 500 });
  }
}

/**
 * Updates a user's profile settings (PUT).
 *
 * @param {NextRequest} req - The request object.
 * @param {Object} params - The request parameters.
 * @param {string} params.userId - The ID of the user.
 * @returns {Promise<NextResponse>} - The response object containing the updated user profile.
 */
export async function PUT(req: NextRequest, { params }: { params: { userId: string } }): Promise<NextResponse> {
  await connectToDB();

  const { userId } = params;
  const updateData = await req.json();  // Parse incoming complete user profile data

  // Validate userId as a valid ObjectId
  if (!Types.ObjectId.isValid(userId)) {
    return new NextResponse('Invalid user ID', { status: 400 });
  }

  try {
    // Update the entire user profile (or fields allowed to update)
    const updatedUser = await updateUserProfile(new Types.ObjectId(userId), updateData);

    return new NextResponse(JSON.stringify({ success: true, data: updatedUser }), { status: 200 });
  } catch (error) {
    const err = error as Error;
    return new NextResponse(JSON.stringify({ success: false, error: err.message }), { status: 500 });
  }
}
