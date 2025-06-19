import { getOverdueBooks } from "@/server/statistics";
export async function GET() {
  try {
    const popularBooks = await getOverdueBooks();
    return Response.json(popularBooks);
  } catch (error) {
    return new Response("Failed to get overdue books", { status: 500 });
  }
}
