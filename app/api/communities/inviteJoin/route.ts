import { NextRequest, NextResponse } from "next/server";
import { joinCommunityViaInvite } from "@/services/inviteService";

interface errorInterface {
  error: {
    message: string;
  };
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { token } = await req.json();

    if (!token) {
      return new NextResponse("Invite token is required", { status: 400 });
    }

    const userId = req.headers.get("user-id"); // Replace with your auth middleware
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const community = await joinCommunityViaInvite(token, userId);

    return new NextResponse(JSON.stringify(community), { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error joining community via invite:", error.message);
      console.log("Error object:", error);
      return new NextResponse(JSON.stringify({ error: error.message }), {
        status: 500,
      });
    } else {
      console.error("Unexpected error type:", error);
      return new NextResponse(
        JSON.stringify({ error: "Internal Server Error" }),
        { status: 500 }
      );
    }
  }
}

/**
 POST http://localhost:3000/api/communities/inviteJoin

 Headers: 
  "user-id": "64ffdbcd9e73a0f2e05e48b9" // Authenticated user ID

 Body:
 {
  "token": "unique-invite-token"
 }

 
 */
