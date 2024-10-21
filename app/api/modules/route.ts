import { NextResponse } from "next/server";
import dbConnect from "@/util/connectToDB"; // Adjust the path based on your folder structure
import Module from "@/models/Module.model";

/**
 * Fetches all available modules from the database.
 *
 * @param {NextRequest} req - The request object.
 * @returns {Promise<NextResponse>} - The response object containing the list of modules.
 */
export async function GET(): Promise<NextResponse> {
  // Ensure database connection
  await dbConnect();

  try {
    // Fetch all available modules
    const modules = await Module.find();

    // Return success response with the data
    return new NextResponse(JSON.stringify({ success: true, data: modules }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    // Handle errors and return a failure response
    const err = error as Error;
    return new NextResponse(
      JSON.stringify({ success: false, error: err.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

//test GET http://localhost:3000/api/modules
