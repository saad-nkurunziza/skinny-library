import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { relations, sql } from "drizzle-orm";
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

export const studentsTable = sqliteTable("students", {
  id: text("id")
    .primaryKey()
    .$default(() => crypto.randomUUID()),
  name: text("name").notNull(),
  grade: text("grade").notNull(),
  studentId: text("student_id").notNull().unique(),
  status: text("status", { enum: ["active", "inactive"] }).default("active"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const lendingTable = sqliteTable("lending", {
  id: text("id")
    .primaryKey()
    .$default(() => crypto.randomUUID()),
  bookId: text("book_id").references(() => booksTable.id),
  studentId: text("student_id").references(() => studentsTable.id),
  borrowDate: text("borrow_date").notNull(),
  dueDate: text("due_date").notNull(),
  returnDate: text("return_date"),
  status: text("status", { enum: ["borrowed", "returned", "overdue"] }).default(
    "borrowed"
  ),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const booksRelations = relations(booksTable, ({ many }) => ({
  lendings: many(lendingTable),
}));

export const studentsRelations = relations(studentsTable, ({ many }) => ({
  lendings: many(lendingTable),
}));

export const lendingRelations = relations(lendingTable, ({ one }) => ({
  book: one(booksTable, {
    fields: [lendingTable.bookId],
    references: [booksTable.id],
  }),
  student: one(studentsTable, {
    fields: [lendingTable.studentId],
    references: [studentsTable.id],
  }),
}));

export type SelectBook = typeof booksTable.$inferSelect;
export type InsertBook = typeof booksTable.$inferInsert;
export type SelectStudent = typeof studentsTable.$inferSelect;
export type InsertStudent = typeof studentsTable.$inferInsert;
export type SelectLending = typeof lendingTable.$inferSelect;
export type InsertLending = typeof lendingTable.$inferInsert;
