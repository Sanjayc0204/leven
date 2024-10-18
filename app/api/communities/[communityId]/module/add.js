import { addModuleToCommunity } from '@/services/communityService';

export async function POST(req, { params }) {
  try {
    const { communityId } = params;
    const { moduleId } = await req.json();  // Assuming the moduleId is passed in the body

    const updatedCommunity = await addModuleToCommunity(communityId, moduleId);

    return new Response(JSON.stringify(updatedCommunity), { status: 200 });
  } catch (error) {
    return new Response('Error adding module to community', { status: 500 });
  }
}
