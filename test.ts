import { booksTable, lendingTable } from "@/database/schema";
import { db } from "@/lib/db";
import { eq, and, lt, sql, desc, count } from "drizzle-orm";

async function main() {
  const today = new Date().toISOString().split("T")[0];
  const data = await db.select().from(lendingTable);
  // .leftJoin(booksTable, eq(lendingTable.bookId, booksTable.id))
  // .groupBy(booksTable.category)
  // .orderBy(desc(sql<number>`count(*)`));
  console.log(data);
}

main();
