import { db } from "@/lib/db";
import {
  booksTable,
  studentsTable,
  lendingTable,
  InsertBook,
  InsertStudent,
  InsertLending,
} from "./src/database/schema";

const books: InsertBook[] = [
  {
    id: "book-1",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    quantity: 3,
    isbn: "9780061120084",
    category: "Fiction",
    status: "available",
  },
  {
    id: "book-2",
    title: "1984",
    author: "George Orwell",
    quantity: 2,
    isbn: "9780451524935",
    category: "Dystopian",
    status: "available",
  },
  {
    id: "book-3",
    title: "A Brief History of Time",
    author: "Stephen Hawking",
    quantity: 1,
    isbn: "9780553380163",
    category: "Science",
    status: "available",
  },
  {
    id: "book-4",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    quantity: 4,
    isbn: "9780743273565",
    category: "Classic",
    status: "available",
  },
];

const students: InsertStudent[] = [
  {
    id: "student-1",
    name: "Alice Johnson",
    grade: "10",
    studentId: "S1001",
    status: "active",
  },
  {
    id: "student-2",
    name: "Brian Smith",
    grade: "11",
    studentId: "S1002",
    status: "active",
  },
  {
    id: "student-3",
    name: "Catherine Lee",
    grade: "12",
    studentId: "S1003",
    status: "active",
  },
  {
    id: "student-4",
    name: "David Kim",
    grade: "10",
    studentId: "S1004",
    status: "inactive",
  },
];

const lendings: InsertLending[] = [
  {
    id: "lending-1",
    bookId: "book-1",
    studentId: "student-1",
    borrowDate: "2024-05-01",
    dueDate: "2024-05-15",
    returnDate: "2024-05-10",
    status: "returned",
  },
  {
    id: "lending-2",
    bookId: "book-2",
    studentId: "student-2",
    borrowDate: "2024-05-10",
    dueDate: "2024-05-24",
    returnDate: null,
    status: "borrowed",
  },
  {
    id: "lending-3",
    bookId: "book-3",
    studentId: "student-3",
    borrowDate: "2024-04-20",
    dueDate: "2024-05-04",
    returnDate: null,
    status: "overdue",
  },
  {
    id: "lending-4",
    bookId: "book-4",
    studentId: "student-1",
    borrowDate: "2024-03-15",
    dueDate: "2024-03-29",
    returnDate: "2024-03-28",
    status: "returned",
  },
];

async function seed() {
  await db.delete(lendingTable);
  await db.delete(booksTable);
  await db.delete(studentsTable);

  for (const book of books) {
    await db.insert(booksTable).values(book);
  }

  for (const student of students) {
    await db.insert(studentsTable).values(student);
  }

  for (const lending of lendings) {
    await db.insert(lendingTable).values(lending);
  }

  console.log("Database seeded successfully.");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
