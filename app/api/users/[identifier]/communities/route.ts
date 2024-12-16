import { NextRequest, NextResponse } from "next/server";
import {
  getUserCommunities,
  getUserCommunitiesByEmail,
} from "@/services/userService";
import { connectToDB } from "@/util/connectToDB";
import { Types } from "mongoose";

/**
 * Fetches all communities associated with a user by ID or email.
 *
 * @param {NextRequest} req - The request object.
 * @param {Object} params - The request parameters.
 * @param {string} params.identifier - The user's ID or email.
 * @returns {Promise<NextResponse>} - The response object containing community data.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { identifier: string } }
): Promise<NextResponse> {
  await connectToDB();

  const { identifier } = params;
  console.log("Received identifier:", identifier); // Debugging log to confirm identifier

  if (!identifier) {
    return new NextResponse(
      JSON.stringify({ success: false, error: "Identifier is required" }),
      { status: 400 }
    );
  }

  try {
    const communities = Types.ObjectId.isValid(identifier)
      ? await getUserCommunities(new Types.ObjectId(identifier)) // Use ObjectId if valid
      : await getUserCommunitiesByEmail(identifier); // Otherwise, use email function

    return new NextResponse(
      JSON.stringify({ success: true, data: communities }),
      { status: 200 }
    );
  } catch (error) {
    const err = error as Error;
    return new NextResponse(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500 }
    );
  }
}

// export async function GET(req: NextRequest, { params }: { params: { userId: string } }): Promise<NextResponse> {
//   await connectToDB();  // Ensure DB connection

//   const { userId } = params;

//   if (!Types.ObjectId.isValid(userId)) {
//     return new NextResponse(JSON.stringify({ success: false, error: 'Invalid user ID' }), { status: 400 });
//   }

//   try {
//     const communities = await getUserCommunities(new Types.ObjectId(userId));  // Get populated communities

//     return new NextResponse(JSON.stringify({ success: true, data: communities }), { status: 200 });
//   } catch (error) {
//     const err = error as Error;
//     return new NextResponse(JSON.stringify({ success: false, error: err.message }), { status: 500 });
//   }
// }

//test
// GET http://localhost:3000/api/users/670ed82511c2c5ec6763856b/communities
