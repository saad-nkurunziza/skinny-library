"use server";

import { revalidatePath } from "next/cache";

export async function refreshPage() {
  try {
    revalidatePath("/", "layout");
  } catch (error) {
    console.error("Error refreshing page:", error);
    throw new Error("Failed to refresh page");
  }
}
