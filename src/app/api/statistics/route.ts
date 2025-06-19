import { getDashboardStats } from "@/server/statistics";

export async function GET() {
  try {
    const stats = await getDashboardStats();
    return Response.json(stats);
  } catch (error) {
    return new Response("Failed to get dashboard statistics", { status: 500 });
  }
}
