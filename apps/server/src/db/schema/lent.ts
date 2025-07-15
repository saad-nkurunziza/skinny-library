import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import crypto from "crypto";

export const lentTable = sqliteTable("lent", {
  id: text("id")
    .primaryKey()
    .$default(() => crypto.randomUUID()),
  bookId: text("book_id").notNull(),
  studentId: text("student_id").notNull(),
  lentAt: text("lent_at").default(sql`CURRENT_TIMESTAMP`),
  returnedAt: text("returned_at"),
  status: text("status", { enum: ["lent", "returned"] }).default("lent"),
  dueDate: text("due_date").notNull(),
});
