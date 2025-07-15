import { relations } from "drizzle-orm";
import { booksTable } from "./book";
import { studentsTable } from "./student";
import { lentTable } from "./lent";

export * from "./book";
export * from "./student";
export * from "./lent";
export * from "./todo";

export const booksRelations = relations(booksTable, ({ many }) => ({
  lents: many(lentTable),
}));

export const studentsRelations = relations(studentsTable, ({ many }) => ({
  lents: many(lentTable),
}));

export const lentRelations = relations(lentTable, ({ one }) => ({
  book: one(booksTable, {
    fields: [lentTable.bookId],
    references: [booksTable.id],
  }),
  student: one(studentsTable, {
    fields: [lentTable.studentId],
    references: [studentsTable.id],
  }),
}));

export type SelectBook = typeof booksTable.$inferSelect;
export type InsertBook = typeof booksTable.$inferInsert;
export type SelectStudent = typeof studentsTable.$inferSelect;
export type InsertStudent = typeof studentsTable.$inferInsert;
export type Selectlent = typeof lentTable.$inferSelect;
export type Insertlent = typeof lentTable.$inferInsert;
