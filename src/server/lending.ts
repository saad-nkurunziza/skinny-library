"use server";
import { eq, and, lt, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  lendingTable,
  booksTable,
  studentsTable,
  type InsertLending,
} from "@/database/schema";
import { revalidatePath, unstable_cache } from "next/cache";

export async function getLendingRecords() {
  try {
    return await db
      .select({
        id: lendingTable.id,
        bookId: lendingTable.bookId,
        studentId: lendingTable.studentId,
        borrowDate: lendingTable.borrowDate,
        dueDate: lendingTable.dueDate,
        returnDate: lendingTable.returnDate,
        status: lendingTable.status,
        createdAt: lendingTable.createdAt,
        book: {
          title: booksTable.title,
          author: booksTable.author,
        },
        student: {
          name: studentsTable.name,
          studentId: studentsTable.studentId,
        },
      })
      .from(lendingTable)
      .leftJoin(booksTable, eq(lendingTable.bookId, booksTable.id))
      .orderBy(lendingTable.createdAt)
      .leftJoin(studentsTable, eq(lendingTable.studentId, studentsTable.id));
  } catch (error) {
    console.error("Error getting lending records:", error);
    throw new Error("Failed to get lending records");
  }
}

export type getLendingRecordsInterface = {
  id: string;
  bookId: string | null;
  studentId: string | null;
  borrowDate: string;
  dueDate: string;
  returnDate: string | null;
  createdAt: string | null;
  status: "borrowed" | "returned" | "overdue" | null;
  book: {
    title: string;
    author: string;
  } | null;
  student: {
    name: string;
    studentId: string;
  } | null;
};

export const getCachedLendingRecords = unstable_cache(
  async () => getLendingRecords(),
  ["lendings"],
  {
    revalidate: 300,
    tags: ["lendings"],
  }
);

export async function createLendingRecord(record: InsertLending) {
  try {
    const [existingStudent] = await db
      .select()
      .from(studentsTable)
      .where(eq(studentsTable.id, record.studentId!));
    const [existingBook] = await db
      .select()
      .from(booksTable)
      .where(eq(booksTable.id, record.bookId!));

    const lentRecord = await db
      .select()
      .from(lendingTable)
      .where(
        and(
          eq(lendingTable.studentId, record.studentId!),
          eq(lendingTable.status, "borrowed")
        )
      );
    if (lentRecord.length > 0) {
      throw new Error("The student already has a book borrowed.");
    }
    if (!existingBook || existingBook.quantity === null) {
      throw new Error("Invalid book");
    }
    if (!existingStudent) {
      throw new Error("Invalid student");
    }
    if (existingBook.quantity <= 0) {
      throw new Error("The selected book is currently out of stock.");
    }

    const newRecord = await db.transaction(async (tx) => {
      const [insertedRecord] = await tx
        .insert(lendingTable)
        .values(record)
        .returning();
      const [v] = await tx
        .update(booksTable)
        .set({ quantity: sql`${booksTable.quantity} - 1` })
        .where(eq(booksTable.id, insertedRecord.bookId!))
        .returning();

      if (v.quantity === 0) {
        await tx
          .update(booksTable)
          .set({ status: "unavailable" })
          .where(eq(booksTable.id, insertedRecord.bookId!));
      }
      return insertedRecord;
    });

    revalidatePath("/", "layout");
    return newRecord;
  } catch (error) {
    console.error("Error creating lending record:", error);
    throw new Error("Failed to create lending record");
  }
}

export async function returnBook(studentId: string) {
  try {
    const returnRecord = await db.transaction(async (tx) => {
      const [insertedRecord] = await tx
        .update(lendingTable)
        .set({
          status: "returned",
          returnDate: new Date().toISOString(),
        })
        .where(eq(lendingTable.studentId, studentId))
        .returning();
      await tx
        .update(booksTable)
        .set({ quantity: sql`${booksTable.quantity} + 1` })
        .where(eq(booksTable.id, insertedRecord.bookId!));

      const [book] = await tx
        .select()
        .from(booksTable)
        .where(eq(booksTable.id, insertedRecord.bookId!));
      if (book && book.status === "unavailable") {
        await tx
          .update(booksTable)
          .set({ status: "available" })
          .where(eq(booksTable.id, insertedRecord.bookId!));
      }
      return insertedRecord;
    });

    revalidatePath("/", "layout");
    return returnRecord;
  } catch (error) {
    console.error("Error returning book:", error);
    throw new Error("Failed to return book");
  }
}

export async function markOverdueAll() {
  const today = new Date().toISOString().split("T")[0];

  try {
    const overdueRecords = await db
      .select()
      .from(lendingTable)
      .where(
        and(
          eq(lendingTable.status, "borrowed"),
          lt(lendingTable.dueDate, today)
        )
      );

    if (overdueRecords.length > 0) {
      await db.transaction(async (tx) => {
        for (const record of overdueRecords) {
          await tx
            .update(lendingTable)
            .set({ status: "overdue" })
            .where(eq(lendingTable.id, record.id));
        }
      });
    }

    revalidatePath("/", "layout");
  } catch (error) {
    console.error("Error marking overdue records:", error);
    throw new Error("Failed to mark overdue records");
  }
}

export async function getOverdueBooks() {
  const today = new Date().toISOString().split("T")[0];

  try {
    return await db
      .select({
        id: lendingTable.id,
        bookId: lendingTable.bookId,
        studentId: lendingTable.studentId,
        borrowDate: lendingTable.borrowDate,
        dueDate: lendingTable.dueDate,
        book: {
          title: booksTable.title,
          author: booksTable.author,
        },
        student: {
          name: studentsTable.name,
          studentId: studentsTable.studentId,
        },
      })
      .from(lendingTable)
      .leftJoin(booksTable, eq(lendingTable.bookId, booksTable.id))
      .leftJoin(studentsTable, eq(lendingTable.studentId, studentsTable.id))
      .where(
        and(
          eq(lendingTable.status, "borrowed"),
          lt(lendingTable.dueDate, today)
        )
      );
  } catch (error) {
    console.error("Error getting overdue books:", error);
    throw new Error("Failed to get overdue books");
  }
}
