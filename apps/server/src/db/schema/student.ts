import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import crypto from "crypto";

export const studentsTable = sqliteTable("students", {
  id: text("id")
    .primaryKey()
    .$default(() => crypto.randomUUID()),
  name: text("name").notNull(),
  grade: text("grade").notNull(),
  phoneNumber: text("phone_number"),
  studentId: text("student_id").notNull().unique(),
  status: text("status", { enum: ["active", "inactive"] }).default("active"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});
