import dbConnect from '../../../../lib/dbConnect';
import Module from '../../../../models/Module.model';

export async function GET(req) {
  await dbConnect();

  try {
    const modules = await Module.find(); // Fetch all available modules
    return new Response(JSON.stringify({ success: true, data: modules }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
