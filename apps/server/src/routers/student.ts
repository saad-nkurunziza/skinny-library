import z from "zod";
import { router, publicProcedure } from "../lib/trpc";
import { lentTable, studentsTable } from "../db/schema";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { studentSchema } from "../type-interfaces/zod-schemas";

export const studentRouter = router({
  get_all: publicProcedure.query(async () => {
    return await db
      .select()
      .from(studentsTable)
      .orderBy(studentsTable.createdAt);
  }),

  get_by_id: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return await db.query.studentsTable.findFirst({
        where: eq(studentsTable.id, input.id),
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

  create: publicProcedure.input(studentSchema).mutation(async ({ input }) => {
    return await db.insert(studentsTable).values({
      ...input,
    });
  }),

  update: publicProcedure
    .input(studentSchema.extend({ id: z.string() }))
    .mutation(async ({ input }) => {
      return await db
        .update(studentsTable)
        .set({ ...input })
        .where(eq(studentsTable.id, input.id));
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const existingStudent = await db.query.studentsTable.findFirst({
        where: eq(studentsTable.id, input.id),
      });
      if (!existingStudent) {
        throw new Error("Student not found");
      }

      const lentCount = await db
        .select({ id: lentTable.id })
        .from(lentTable)
        .where(eq(lentTable.studentId, input.id));
      if (lentCount.length > 0) {
        throw new Error("Cannot delete student that has lent books");
      }
      return await db
        .delete(studentsTable)
        .where(eq(studentsTable.id, input.id));
    }),
});
