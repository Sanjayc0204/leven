import dbConnect from '../../../../../lib/dbConnect';
import { updateUserProfile } from '../../../../../services/userService';


export async function GET(req, { params }) {
    await dbConnect();
  
    const { userId } = params;
  
    if (!userId) {
      return new Response(JSON.stringify({ success: false, error: 'User ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  
    try {
      const user = await getUserProfile(userId);  // Use service layer to get user profile
  
      if (!user) {
        return new Response(JSON.stringify({ success: false, error: 'User not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        });
      }
  
      return new Response(JSON.stringify({ success: true, data: user }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      return new Response(JSON.stringify({ success: false, error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }


export async function PATCH(req, { params }) {
  await dbConnect();  

  const { userId } = params;  // Extract userId from dynamic route
  const updateData = await req.json();  // Parse incoming update data

  if (!userId) {
    return new Response(JSON.stringify({ success: false, error: 'User ID is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const updatedUser = await updateUserProfile(userId, updateData);  // Update user profile via service

    return new Response(JSON.stringify({ success: true, data: updatedUser }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
