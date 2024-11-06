import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";
import { getTasksForUser } from "@/services/taskService";  // Ensure correct import path

/**
 * Fetch all tasks for a user in a specific community.
 *
 * @param {NextRequest} req - The request object.
 * @param {Object} params - The request parameters.
 * @param {string} params.userId - The ID of the user.
 * @returns {Promise<NextResponse>} - The response object with the list of tasks.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
): Promise<NextResponse> {
  try {
    const { userId } = params;
    const communityId = req.nextUrl.searchParams.get("communityId");

    // Validate userId and communityId as ObjectIds
    if (!Types.ObjectId.isValid(userId) || !communityId || !Types.ObjectId.isValid(communityId)) {
      return new NextResponse("Invalid user ID or community ID", { status: 400 });
    }

    const userObjectId = new Types.ObjectId(userId);
    const communityObjectId = new Types.ObjectId(communityId);

    // Fetch tasks for the user in the specified community
    const tasks = await getTasksForUser({ userId: userObjectId, communityId: communityObjectId });

    return new NextResponse(JSON.stringify(tasks), { status: 200 });
  } catch (error) {
    console.error("Error fetching tasks for user:", error);
    return new NextResponse("Error fetching tasks", { status: 500 });
  }
}
/**
 * GET
 http://localhost:3000/api/tasks/67297c206f4082ed030f7728/all?communityId=672a8e5cfe46364da4a342d0
 */
