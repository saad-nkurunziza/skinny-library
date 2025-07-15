import z from "zod";
import { router, publicProcedure } from "../lib/trpc";
import { booksTable, lentTable, studentsTable } from "../db/schema";
import { and, desc, eq, or, sql } from "drizzle-orm";
import { db } from "../db";
import { lentSchema } from "../type-interfaces/zod-schemas";

export const lentRouter = router({
  get_all: publicProcedure.query(async () => {
    return await db
      .select({
        id: lentTable.id,
        bookId: lentTable.bookId,
        studentId: lentTable.studentId,
        lentAt: lentTable.lentAt,
        dueDate: lentTable.dueDate,
        returnedAt: lentTable.returnedAt,
        status: lentTable.status,
        book: {
          title: booksTable.title,
          author: booksTable.author,
        },
        student: {
          name: studentsTable.name,
          studentId: studentsTable.studentId,
        },
      })
      .from(lentTable)
      .leftJoin(booksTable, eq(lentTable.bookId, booksTable.id))
      .orderBy(desc(lentTable.lentAt))
      .leftJoin(studentsTable, eq(lentTable.studentId, studentsTable.id));
  }),

  get_by_id: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const [record] = await db
        .select({
          id: lentTable.id,
          bookId: lentTable.bookId,
          studentId: lentTable.studentId,
          lentAt: lentTable.lentAt,
          dueDate: lentTable.dueDate,
          returnedAt: lentTable.returnedAt,
          status: lentTable.status,
          book: {
            title: booksTable.title,
            author: booksTable.author,
          },
          student: {
            name: studentsTable.name,
            studentId: studentsTable.studentId,
          },
        })
        .from(lentTable)
        .leftJoin(booksTable, eq(lentTable.bookId, booksTable.id))
        .leftJoin(studentsTable, eq(lentTable.studentId, studentsTable.id))
        .where(eq(lentTable.id, input.id));
      if (!record) {
        throw new Error("Record not found");
      }
      return record;
    }),

  get_by_student_id: publicProcedure
    .input(z.object({ studentId: z.string() }))
    .query(async ({ input }) => {
      return await db
        .select({
          id: lentTable.id,
          bookId: lentTable.bookId,
          studentId: lentTable.studentId,
          lentAt: lentTable.lentAt,
          dueDate: lentTable.dueDate,
          returnedAt: lentTable.returnedAt,
          status: lentTable.status,
          book: {
            title: booksTable.title,
            author: booksTable.author,
          },
          student: {
            name: studentsTable.name,
            studentId: studentsTable.studentId,
          },
        })
        .from(lentTable)
        .leftJoin(booksTable, eq(lentTable.bookId, booksTable.id))
        .leftJoin(studentsTable, eq(lentTable.studentId, studentsTable.id))
        .where(eq(lentTable.studentId, input.studentId));
    }),

  get_overdue: publicProcedure.query(async () => {
    return await db
      .select({
        id: lentTable.id,
        bookId: lentTable.bookId,
        studentId: lentTable.studentId,
        lentAt: lentTable.lentAt,
        dueDate: lentTable.dueDate,
        returnedAt: lentTable.returnedAt,
        status: lentTable.status,
        book: {
          title: booksTable.title,
          author: booksTable.author,
        },
        student: {
          name: studentsTable.name,
          studentId: studentsTable.studentId,
        },
      })
      .from(lentTable)
      .leftJoin(booksTable, eq(lentTable.bookId, booksTable.id))
      .leftJoin(studentsTable, eq(lentTable.studentId, studentsTable.id))
      .where(eq(lentTable.dueDate, new Date().toISOString().split("T")[0]));
  }),

  create: publicProcedure.input(lentSchema).mutation(async ({ input }) => {
    console.log(input);
    try {
      const [existingStudent] = await db
        .select()
        .from(studentsTable)
        .where(eq(studentsTable.id, input.studentId!));
      const [existingBook] = await db
        .select()
        .from(booksTable)
        .where(eq(booksTable.id, input.bookId!));

      const lentRecord = await db
        .select()
        .from(lentTable)
        .where(
          and(
            eq(lentTable.studentId, input.studentId!),
            eq(lentTable.status, "lent")
          )
        );
      if (lentRecord.length > 0) {
        throw new Error("The student already has a book lent to them.");
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
        const dueDate =
          typeof input.dueDate === "string"
            ? new Date(input.dueDate)
            : input.dueDate;
        const [insertedRecord] = await tx
          .insert(lentTable)
          .values({ ...input, dueDate: dueDate.toISOString() })
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
      return newRecord;
    } catch (error) {
      console.error("Error creating lent record:", error);
      throw new Error("Failed to create lent record");
    }
  }),

  update: publicProcedure
    .input(lentSchema.extend({ id: z.string() }))
    .mutation(async ({ input }) => {
      return await db
        .update(lentTable)
        .set({ ...input })
        .where(eq(lentTable.id, input.id));
    }),

  return: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      try {
        const [record] = await db
          .select()
          .from(lentTable)
          .where(
            or(eq(lentTable.id, input.id), eq(lentTable.studentId, input.id))
          )
          .orderBy(desc(lentTable.lentAt));
        console.log("Record found:", record);
        if (!record) {
          console.log("Record not found:", input.id);
          throw new Error("Record not found");
        }
        if (record.status !== "lent") {
          console.log("Record is not currently lent out:", record);
          throw new Error("Record is not currently lent out");
        }
        const updatedRecord = await db.transaction(async (tx) => {
          const [updated] = await tx
            .update(lentTable)
            .set({
              status: "returned",
              returnedAt: new Date().toISOString(),
            })
            .where(eq(lentTable.id, record.id))
            .returning();
          console.log("Updated record:", updated);
          const [book] = await tx
            .update(booksTable)
            .set({ quantity: sql`${booksTable.quantity} + 1` })
            .where(eq(booksTable.id, updated.bookId))
            .returning();
          console.log("Updated book record:", book);
          if (Number(book.quantity) > 0) {
            await tx
              .update(booksTable)
              .set({ status: "available" })
              .where(eq(booksTable.id, updated.bookId));
          }
          return updated;
        });
        return updatedRecord;
      } catch (error) {
        console.error("Error returning book:", error);
        throw new Error("Failed to return book");
      }
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      return await db.delete(lentTable).where(eq(lentTable.id, input.id));
    }),
});
