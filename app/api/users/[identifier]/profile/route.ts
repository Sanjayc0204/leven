import { NextRequest, NextResponse } from 'next/server';
import { getUserProfile, updateUserProfile, getUserProfileByEmail } from '@/services/userService';
import { connectToDB } from '@/util/connectToDB';
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
 * !!!!!!! ONLY ACCPETS USER ID, NOT EMAIL
 * Also validates username, exclude permissions to change email
 *
 * @param {NextRequest} req - The request object.
 * @param {Object} params - The request parameters.
 * @param {string} params.id - The ID of the user.
 * @returns {Promise<NextResponse>} - The response object containing the updated user profile.
 */
export async function PUT(req: NextRequest, { params }: { params: { identifier: string } }): Promise<NextResponse> {
  await connectToDB();

  const { identifier } = params;
  const updateData = await req.json();

  if (!identifier) {
    return new NextResponse(JSON.stringify({ success: false, error: 'User ID is required' }), { status: 400 });
  }

  if (!Types.ObjectId.isValid(identifier)) {
    return new NextResponse(JSON.stringify({ success: false, error: 'Invalid user ID format' }), { status: 400 });
  }

  // Validate data 
  if (typeof updateData.username === 'string') {
    // Ensure the username is between 8 and 20 characters and only contains alphanumeric characters
    if (
      updateData.username.length < 8 || 
      updateData.username.length > 20 || 
      !/^[a-zA-Z0-9]+$/.test(updateData.username)
    ) {
      return new NextResponse(JSON.stringify({ 
        success: false, 
        error: 'Username must be 8-20 alphanumeric characters' 
      }), { status: 400 });
    }
  }

  // Remove `email` if it exists in `updateData` to prevent updates to email field
  if ('email' in updateData) {
    delete updateData.email;
  }

  try {
    const updatedUser = await updateUserProfile(new Types.ObjectId(identifier), updateData);

    if (!updatedUser) {
      return new NextResponse(JSON.stringify({ success: false, error: 'User not found' }), { status: 404 });
    }

    return new NextResponse(JSON.stringify({ success: true, data: updatedUser }), { status: 200 });
  } catch (error) {
    console.error('Error in PUT request:', error);
    return new NextResponse(JSON.stringify({ success: false, error: (error as Error).message }), { status: 500 });
  }
}



// GET http://localhost:3000/api/users/6714178e6da7ab267f83bebe/profile
// PUT

/* 
 
 {
  "username": "newUsername",
  "email": "newEmail@example.com",
  "image": "https://example.com/new-image.jpg",
  "settings": {
    "theme": "dark",
    "notifications": false
  }
}
 
 */