import { customizeModule } from '@/services/communityService';

export async function PUT(req, { params }) {
  try {
    const { communityId, moduleId } = params;
    const updateData = await req.json();  // Module settings passed in the body

    const updatedCommunity = await customizeModule(communityId, moduleId, updateData);

    return new Response(JSON.stringify(updatedCommunity), { status: 200 });
  } catch (error) {
    return new Response('Error customizing module', { status: 500 });
  }
}
