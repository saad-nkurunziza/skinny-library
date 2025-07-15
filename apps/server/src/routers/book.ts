import z from "zod";
import { router, publicProcedure } from "../lib/trpc";
import { booksTable, lentTable } from "../db/schema";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { bookSchema } from "../type-interfaces/zod-schemas";

export const bookRouter = router({
  get_all: publicProcedure.query(async () => {
    return await db.select().from(booksTable).orderBy(booksTable.createdAt);
  }),

  get_by_id: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return await db.query.booksTable.findFirst({
        where: eq(booksTable.id, input.id),
        with: {
          lents: {
            with: {
              book: true,
              student: true,
            },
          },
        },
      });
    }),

  create: publicProcedure.input(bookSchema).mutation(async ({ input }) => {
    return await db.insert(booksTable).values({
      ...input,
    });
  }),

  update: publicProcedure
    .input(bookSchema.extend({ id: z.string() }))
    .mutation(async ({ input }) => {
      return await db
        .update(booksTable)
        .set({ ...input })
        .where(eq(booksTable.id, input.id));
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const existingBook = await db.query.booksTable.findFirst({
        where: eq(booksTable.id, input.id),
      });
      if (!existingBook) {
        throw new Error("Book not found");
      }

      const lentCount = await db
        .select({ id: lentTable.id })
        .from(lentTable)
        .where(eq(lentTable.bookId, input.id));
      if (lentCount.length > 0) {
        throw new Error("Cannot delete book that is currently lent out");
      }

      return await db.delete(booksTable).where(eq(booksTable.id, input.id));
    }),
});
