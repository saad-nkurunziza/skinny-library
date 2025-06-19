import { markOverdueAll } from "@/server/lending";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await markOverdueAll();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Background task failed:", error);
    return NextResponse.json({ error: "Task failed" }, { status: 500 });
  }
}
