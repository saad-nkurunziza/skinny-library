"use server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  type InsertStudent,
  studentsTable,
  lendingTable,
} from "@/database/schema";
import { revalidateTag, unstable_cache } from "next/cache";

export async function getStudents() {
  try {
    return await db
      .select()
      .from(studentsTable)
      .orderBy(studentsTable.createdAt);
  } catch (error) {
    console.error("Error getting students:", error);
    throw new Error("Failed to get students");
  }
}

export const getCachedStudents = unstable_cache(
  async () => getStudents(),
  ["students"],
  {
    revalidate: 300,
    tags: ["students"],
  }
);

export async function getStudentById(studentId: string) {
  try {
    const student = await db.query.studentsTable.findFirst({
      where: eq(studentsTable.id, studentId),
      with: {
        lendings: {
          with: {
            student: true,
            book: true,
          },
        },
      },
    });

    if (!student) {
      throw new Error("Student not found");
    }

    return student;
  } catch (error) {
    console.error("Error getting student:", error);
    throw new Error("Failed to get student");
  }
}

export const getCachedStudentById = async (id: string) =>
  unstable_cache(() => getStudentById(id), ["students", id], {
    revalidate: 300,
    tags: ["students", id],
  });

export async function createStudent(student: InsertStudent) {
  try {
    const [newStudent] = await db
      .insert(studentsTable)
      .values(student)
      .returning();
    revalidateTag("students");
    return newStudent;
  } catch (error) {
    console.error("Error creating student:", error);
    throw new Error("Failed to create student");
  }
}
export async function updateStudent(student: InsertStudent) {
  try {
    const [updatedStudent] = await db
      .update(studentsTable)
      .set(student)
      .where(eq(studentsTable.id, student.id!))
      .returning();
    revalidateTag("students");
    return updatedStudent;
  } catch (error) {
    console.error("Error creating student:", error);
    throw new Error("Failed to create student");
  }
}

export async function updateStudentStatus(
  studentId: string,
  status: "active" | "inactive"
) {
  try {
    const [updatedStudent] = await db
      .update(studentsTable)
      .set({ status })
      .where(eq(studentsTable.id, studentId))
      .returning();
    revalidateTag("students");
    return updatedStudent;
  } catch (error) {
    console.error("Error updating student status:", error);
    throw new Error("Failed to update student status");
  }
}

export async function deleteStudent(
  studentId: string
): Promise<{ status: number; msg: string }> {
  try {
    if (!studentId) {
      return { status: 400, msg: "Student ID is required." };
    }

    const existingLoan = await db.query.lendingTable.findFirst({
      where: eq(lendingTable.studentId, studentId),
    });

    if (existingLoan) {
      return {
        status: 403,
        msg: "Cannot delete student. They have an active or past loan record.",
      };
    }

    const result = await db
      .delete(studentsTable)
      .where(eq(studentsTable.id, studentId));
    if (result.rowsAffected === 0) {
      return {
        status: 500,
        msg: "Failed to delete student. No rows affected.",
      };
    }
    revalidateTag("students");
    return { status: 204, msg: "Student deleted successfully." };
  } catch (error) {
    console.error("Error deleting student:", error);
    throw new Error("Failed to delete student");
  }
}
