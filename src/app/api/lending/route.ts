import { NextRequest } from "next/server";
import * as lendingService from "@/server/lending";

export async function GET() {
  try {
    const records = await lendingService.getLendingRecords();
    return Response.json(records);
  } catch (error) {
    return new Response("Failed to get lending records", { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const record = await request.json();
    const newRecord = await lendingService.createLendingRecord(record);
    return Response.json(newRecord);
  } catch (error) {
    return new Response("Failed to create lending record", { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id } = await request.json();
    const record = await lendingService.returnBook(id);
    return Response.json(record);
  } catch (error) {
    return new Response("Failed to return book", { status: 500 });
  }
}
