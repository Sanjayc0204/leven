import { NextRequest, NextResponse } from "next/server";

const corsOptions = {
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Origin": "*",
};

export function middleware(request: NextRequest) {
  const isPreflight = request.method === "OPTIONS";

  if (isPreflight) {
    // Handle preflight requests
    return NextResponse.json(
      {},
      {
        headers: corsOptions,
      }
    );
  }

  const response = NextResponse.next();

  // Set CORS headers for other requests
  Object.entries(corsOptions).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}

export const config = {
  matcher: "/api/:path*", // Adjusted to catch all paths under /api
};
