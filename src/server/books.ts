"use server";
import { eq, desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { booksTable, lendingTable, type InsertBook } from "@/database/schema";
import { revalidateTag, unstable_cache } from "next/cache";

export async function getBooks() {
  try {
    return await db.select().from(booksTable).orderBy(booksTable.createdAt);
  } catch (error) {
    console.error("Error getting books:", error);
    throw new Error("Failed to get books");
  }
}

export const getCachedBooks = unstable_cache(
  async () => getBooks(),
  ["books"],
  {
    revalidate: 300,
    tags: ["books"],
  }
);

export async function getBookById(bookId: string) {
  try {
    const book = await db.query.booksTable.findFirst({
      where: eq(booksTable.id, bookId),
      with: {
        lendings: {
          orderBy: desc(lendingTable.createdAt),
          with: {
            student: true,
          },
        },
      },
    });

    if (!book) {
      throw new Error("Book not found");
    }

    return book;
  } catch (error) {
    console.error("Error getting book:", error);
    throw new Error("Failed to get book");
  }
}

export const getCachedBookById = async (id: string) =>
  unstable_cache(() => getBookById(id), ["books", id], {
    revalidate: 300,
    tags: ["books", id],
  });

export async function createBook(book: InsertBook) {
  try {
    const [newBook] = await db.insert(booksTable).values(book).returning();
    revalidateTag("books");
    return newBook;
  } catch (error) {
    console.error("Error creating book:", error);
    throw new Error("Failed to create book");
  }
}
export async function updateBook(book: InsertBook) {
  try {
    const [updatedBook] = await db
      .update(booksTable)
      .set(book)
      .where(eq(booksTable.id, book.id!))
      .returning();
    revalidateTag("books");
    return updatedBook;
  } catch (error) {
    console.error("Error creating book:", error);
    throw new Error("Failed to create book");
  }
}

export async function updateBookStatus(
  bookId: string,
  status: "available" | "unavailable"
) {
  try {
    const [updatedBook] = await db
      .update(booksTable)
      .set({ status })
      .where(eq(booksTable.id, bookId))
      .returning();
    revalidateTag("books");
    return updatedBook;
  } catch (error) {
    console.error("Error updating book status:", error);
    throw new Error("Failed to update book status");
  }
}

export async function deleteBook(
  bookId: string
): Promise<{ status: number; msg: string }> {
  try {
    if (!bookId) {
      return { status: 400, msg: "Book ID is required." };
    }

    const existingLoan = await db.query.lendingTable.findFirst({
      where: eq(lendingTable.bookId, bookId),
    });
    if (existingLoan) {
      return {
        status: 403,
        msg: "Cannot delete book. It has an active or past loan record.",
      };
    }

    const result = await db.delete(booksTable).where(eq(booksTable.id, bookId));
    if (result.rowsAffected === 0) {
      return { status: 500, msg: "Failed to delete book. No rows affected." };
    }

    revalidateTag("books");
    return { status: 204, msg: "Book deleted successfully." };
  } catch (error) {
    console.error("Error deleting book:", error);
    return { status: 500, msg: "Failed to delete book." };
  }
}
