import { fetchCommunityTasks } from '@/services/taskService';
import { NextRequest, NextResponse } from 'next/server';
import { Types } from 'mongoose';

/**
 * Fetches tasks for a specific community, including usernames for each task.
 *
 * @param {NextRequest} req - The request object.
 * @param {Object} params - The route parameters.
 * @param {string} params.communityId - The ID of the community.
 * @returns {Promise<NextResponse>} - The response object containing tasks with usernames.
 */
export async function GET(req: NextRequest, { params }: { params: { communityId: string } }): Promise<NextResponse> {
    try {
        const { communityId } = params;

        // Validate communityId as ObjectId
        if (!Types.ObjectId.isValid(communityId)) {
            return new NextResponse('Invalid community ID', { status: 400 });
        }

        // Fetch tasks with usernames for the community
        const tasks = await fetchCommunityTasks(new Types.ObjectId(communityId));

        return new NextResponse(JSON.stringify({ success: true, data: tasks }), { status: 200 });
    } catch (error) {
        console.error('Error fetching community tasks with usernames:', error);
        return new NextResponse('Error fetching community tasks', { status: 500 });
    }
}

// http://localhost:3000/api/communities/672eecb9545eb7b535b26e0f/tasks
