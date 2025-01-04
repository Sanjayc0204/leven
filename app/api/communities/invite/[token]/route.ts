import { NextRequest, NextResponse } from "next/server";
import { fetchCommunityByInvite } from "@/services/inviteService";

export async function GET(
  req: NextRequest,
  { params }: { params: { token: string } }
): Promise<NextResponse> {
  console.log("[GET /api/communities/invite/:token] Start");

  try {
    const { token } = params;
    console.log("[GET] Received token:", token);

    if (!token) {
      console.error("[GET] Missing token in request parameters");
      return new NextResponse("Invite token is required", { status: 400 });
    }

    const community = await fetchCommunityByInvite(token);
    console.log("[GET] Successfully fetched community details:", community);

    return new NextResponse(JSON.stringify(community), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    // Log the error to make use of the variable
    console.error("[GET] Error fetching community by invite link:", error, error);

    return new NextResponse("Invalid or expired invite link", { status: 404 });
  }
}
