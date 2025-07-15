import { router, publicProcedure } from "../lib/trpc";
import { db } from "../db";
import { booksTable, studentsTable, lentTable } from "../db/schema";
import { and, eq, sql, desc, gt } from "drizzle-orm";

export const statisticsRouter = router({
  dashboard_stats: publicProcedure.query(async () => {
    try {
      const [
        totalStudents,
        totalBooks,
        availableBooks,
        booksOnLoan,
        overdueBooks,
      ] = await Promise.all([
        db.select({ count: sql<number>`count(*)` }).from(studentsTable),
        db
          .select({ count: sql<number>`sum(${booksTable.quantity})` })
          .from(booksTable),
        db
          .select({ count: sql<number>`sum(${booksTable.quantity})` })
          .from(booksTable),
        db
          .select({ count: sql<number>`count(*)` })
          .from(lentTable)
          .where(eq(lentTable.status, "lent")),
        db
          .select({ count: sql<number>`count(*)` })
          .from(lentTable)
          .where(
            and(
              eq(lentTable.status, "lent"),
              gt(sql<string>`CURRENT_DATE`, lentTable.dueDate)
            )
          ),
      ]);

      const categoryLoans = await db
        .select({
          category: booksTable.category,
          count: sql<number>`count(*)`,
        })
        .from(lentTable)
        .leftJoin(booksTable, eq(lentTable.bookId, booksTable.id))
        .groupBy(booksTable.category)
        .orderBy(desc(sql<number>`count(*)`));

      const totalLoans = categoryLoans.reduce((sum, cat) => sum + cat.count, 0);
      const popularCategories = categoryLoans.slice(0, 4).map((cat) => ({
        name: cat.category,
        count: cat.count,
        percentage: totalLoans ? Math.round((cat.count / totalLoans) * 100) : 0,
      }));

      return {
        totalStudents: totalStudents[0].count,
        totalBooks: totalBooks[0].count === null ? 0 : totalBooks[0].count,
        availableBooks:
          availableBooks[0].count === null ? 0 : availableBooks[0].count,
        booksOnLoan: booksOnLoan[0].count,
        overdueBooks: overdueBooks[0].count,
        utilizationRate: totalBooks[0].count
          ? Math.round((booksOnLoan[0].count / totalBooks[0].count) * 100)
          : 0,
        popularCategories,
      };
    } catch (error) {
      console.error("Error getting dashboard stats:", error);
      throw new Error("Failed to fetch data");
    }
  }),

  popular_books: publicProcedure.query(async () => {
    try {
      const popularBooks = await db
        .select({
          id: booksTable.id,
          title: booksTable.title,
          author: booksTable.author,
          category: booksTable.category,
          status: booksTable.status,
          timesLoaned: sql<number>`count(${lentTable.id})`,
        })
        .from(booksTable)
        .leftJoin(lentTable, eq(lentTable.bookId, booksTable.id))
        .groupBy(booksTable.id)
        .orderBy(desc(sql<number>`count(${lentTable.id})`))
        .limit(4);

      return popularBooks;
    } catch (error) {
      console.error("Error getting popular books:", error);
      throw new Error("Failed to fetch data");
    }
  }),

  overdue_books: publicProcedure.query(async () => {
    const today = new Date().toISOString().split("T")[0];

    try {
      const overdueBooks = await db
        .select({
          id: lentTable.id,
          bookTitle: booksTable.title,
          author: booksTable.author,
          studentName: studentsTable.name,
          studentId: studentsTable.studentId,
          grade: studentsTable.grade,
          dueDate: lentTable.dueDate,
          isbn: booksTable.isbn,
          category: booksTable.category,
        })
        .from(lentTable)
        .leftJoin(booksTable, eq(lentTable.bookId, booksTable.id))
        .leftJoin(studentsTable, eq(lentTable.studentId, studentsTable.id))
        .where(
          and(
            eq(lentTable.status, "lent"),
            gt(sql<string>`CURRENT_DATE`, lentTable.dueDate)
          )
        )
        .limit(5);

      return overdueBooks.map((book) => ({
        ...book,
        daysOverdue: Math.floor(
          (new Date().getTime() - new Date(book.dueDate).getTime()) /
            (1000 * 60 * 60 * 24)
        ),
      }));
    } catch (error) {
      console.error("Error getting overdue books:", error);
      throw new Error("Failed to fetch data");
    }
  }),

  recent_activity: publicProcedure.query(async () => {
    try {
      const recentActivities = await db
        .select({
          id: lentTable.id,
          type: lentTable.status,
          studentName: studentsTable.name,
          studentId: studentsTable.studentId,
          grade: studentsTable.grade,
          bookTitle: booksTable.title,
          author: booksTable.author,
          category: booksTable.category,
          date: lentTable.lentAt,
          dueDate: lentTable.dueDate,
        })
        .from(lentTable)
        .leftJoin(booksTable, eq(lentTable.bookId, booksTable.id))
        .leftJoin(studentsTable, eq(lentTable.studentId, studentsTable.id))
        .orderBy(desc(lentTable.lentAt))
        .limit(4);

      return recentActivities.map((activity) => ({
        ...activity,
        time: activity.date
          ? new Date(activity.date).toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })
          : null,
        date: activity.date
          ? new Date(activity.date).toISOString().split("T")[0]
          : null,
      }));
    } catch (error) {
      console.error("Error getting recent activity:", error);
      throw new Error("Failed to fetch data");
    }
  }),
});
