import { getRecentActivity } from "@/server/statistics";
export async function GET() {
  try {
    const popularBooks = await getRecentActivity();
    return Response.json(popularBooks);
  } catch (error) {
    return new Response("Failed to get recent activities", { status: 500 });
  }
}
