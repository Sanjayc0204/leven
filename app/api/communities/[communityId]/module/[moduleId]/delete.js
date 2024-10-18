import { deleteModuleFromCommunity } from '@/services/communityService';

export async function DELETE(req, { params }) {
  try {
    const { communityId, moduleId } = params;

    const result = await deleteModuleFromCommunity(communityId, moduleId);

    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    return new Response('Error deleting module from community', { status: 500 });
  }
}