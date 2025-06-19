import { getPopularBooks } from "@/server/statistics";
import { NextRequest } from "next/server";

export async function GET() {
  try {
    const popularBooks = await getPopularBooks();
    return Response.json(popularBooks);
  } catch (error) {
    return new Response("Failed to get popular books", { status: 500 });
  }
}
