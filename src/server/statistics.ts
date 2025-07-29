"use server";

import { db } from "@/lib/db";
import {
  booksTable,
  studentsTable,
  lendingTable,
  type SelectBook,
  type SelectStudent,
  type SelectLending,
} from "@/database/schema";
import { and, eq, sql, desc, count, gt } from "drizzle-orm";

export interface LibraryStatistics {
  totalBooks: number;
  availableBooks: number;
  booksOnLoan: number;
  overdueBooks: number;
  utilizationRate: number;
  popularCategories: {
    name: string;
    count: number;
    percentage: number;
  }[];
}

export interface BookActivity {
  id: string;
  timesLoaned: number;
  title: string;
  author: string;
  category: string;
  status: string;
  grade?: string;
}

export async function getDashboardStats() {
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
        .from(lendingTable)
        .where(eq(lendingTable.status, "borrowed")),
      db
        .select({ count: sql<number>`count(*)` })
        .from(lendingTable)
        .where(eq(lendingTable.status, "overdue")),
    ]);

    const categoryLoans = await db
      .select({
        category: booksTable.category,
        count: sql<number>`count(*)`,
      })
      .from(lendingTable)
      .leftJoin(booksTable, eq(lendingTable.bookId, booksTable.id))
      .groupBy(booksTable.category)
      .orderBy(desc(sql<number>`count(*)`));

    const totalLoans = categoryLoans.reduce((sum, cat) => sum + cat.count, 0);
    const popularCategories = categoryLoans.slice(0, 4).map((cat) => ({
      name: cat.category,
      count: cat.count,
      percentage: Math.round((cat.count / totalLoans) * 100),
    }));

    return {
      totalStudents: totalStudents[0].count,
      totalBooks: totalBooks[0].count === null ? 0 : totalBooks[0].count,
      availableBooks:
        availableBooks[0].count === null ? 0 : availableBooks[0].count,
      booksOnLoan: booksOnLoan[0].count,
      overdueBooks: overdueBooks[0].count,
      utilizationRate: Math.round(
        (booksOnLoan[0].count / totalBooks[0].count) * 100
      ),
      popularCategories,
    };
  } catch (error) {
    console.error("Error getting dashboard stats:", error);
    throw new Error("Failed to fetch data");
  }
}

export async function getPopularBooks() {
  try {
    const popularBooks = await db
      .select({
        id: booksTable.id,
        title: booksTable.title,
        author: booksTable.author,
        category: booksTable.category,
        status: booksTable.status,
        timesLoaned: sql<number>`count(${lendingTable.id})`,
      })
      .from(booksTable)
      .leftJoin(lendingTable, eq(lendingTable.bookId, booksTable.id))
      .groupBy(booksTable.id)
      .orderBy(desc(sql<number>`count(${lendingTable.id})`))
      .limit(4);

    return popularBooks;
  } catch (error) {
    console.error("Error getting popular books:", error);
    throw new Error("Failed to fetch data");
  }
}

export async function getOverdueBooks() {
  const today = new Date().toISOString().split("T")[0];

  try {
    const overdueBooks = await db
      .select({
        id: lendingTable.id,
        bookTitle: booksTable.title,
        author: booksTable.author,
        studentName: studentsTable.name,
        studentId: studentsTable.studentId,
        grade: studentsTable.grade,
        dueDate: lendingTable.dueDate,
        isbn: booksTable.isbn,
        category: booksTable.category,
      })
      .from(lendingTable)
      .leftJoin(booksTable, eq(lendingTable.bookId, booksTable.id))
      .leftJoin(studentsTable, eq(lendingTable.studentId, studentsTable.id))
      .where(
        and(
          eq(lendingTable.status, "overdue"),
          gt(sql<string>`CURRENT_DATE`, lendingTable.dueDate)
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
}

export async function getRecentActivity() {
  try {
    const recentActivities = await db
      .select({
        id: lendingTable.id,
        type: lendingTable.status,
        studentName: studentsTable.name,
        studentId: studentsTable.studentId,
        grade: studentsTable.grade,
        bookTitle: booksTable.title,
        author: booksTable.author,
        category: booksTable.category,
        date: lendingTable.createdAt,
        dueDate: lendingTable.dueDate,
      })
      .from(lendingTable)
      .leftJoin(booksTable, eq(lendingTable.bookId, booksTable.id))
      .leftJoin(studentsTable, eq(lendingTable.studentId, studentsTable.id))
      .orderBy(desc(lendingTable.createdAt))
      .limit(4);

    return recentActivities.map((activity) => ({
      ...activity,
      time: new Date(activity.date!).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
      date: new Date(activity.date!).toISOString().split("T")[0],
    }));
  } catch (error) {
    console.error("Error getting recent activity:", error);
    throw new Error("Failed to fetch data");
  }
}
