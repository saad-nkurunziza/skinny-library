import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import crypto from "crypto";

export const booksTable = sqliteTable("books", {
  id: text("id")
    .primaryKey()
    .$default(() => crypto.randomUUID()),
  title: text("title").notNull(),
  author: text("author").notNull(),
  quantity: int("quantity").default(0),
  isbn: text("isbn").notNull().unique(),
  category: text("category").notNull(),
  status: text("status", { enum: ["available", "unavailable"] }).default(
    "available"
  ),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});
