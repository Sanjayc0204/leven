// app/api/communities/create/route.js

import { createCommunity } from '@/services/communityService';

export async function POST(req) {
  try {
    const { name, creatorId, description, image } = await req.json(); // Ensure the body includes description and image
    const community = await createCommunity(name, creatorId, description, image);
    
    return new Response(JSON.stringify({ success: true, data: community }), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}


// Test this: http://localhost:3000/api/communities/create

// {
//   "name": "LeetCode Study Group",
//   "creatorId": "670b3b2f330b94cfb7710f55",
//   "description": "This is a study group for LeetCode",
//   "image": "https://codeskulptor-demos.commondatastorage.googleapis.com/GalaxyInvaders/back02.jpg"
// }
