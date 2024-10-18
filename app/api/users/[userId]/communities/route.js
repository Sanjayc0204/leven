import connectToDB from '@/util/connectToDB';
import { getUserCommunities } from '@/services/userService';

// to test on thunder client, put user id in between http://localhost:3000/api/users/[userId]/communities
// fetches all communitiy Ids + names associated with user

export async function GET(req, { params }) {
  await connectToDB();  // Ensure DB connection

  const { userId } = params;  // Extract userId from dynamic route

  if (!userId) {
    return new Response(JSON.stringify({ success: false, error: 'User ID is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const communities = await getUserCommunities(userId);  // Use the service layer to get communities

    return new Response(JSON.stringify({ success: true, data: communities }), {
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







  // Static Routing: Parse the URL and extract the userId from the query parameters
  // const { searchParams } = new URL(req.url);
  // const userId = searchParams.get('userId');  // Assuming you pass userId in the query string
