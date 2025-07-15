import z from "zod";

export const bookSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title is too long"),
  author: z
    .string()
    .min(1, "Author is required")
    .max(255, "Author is too long"),
  quantity: z.coerce.number().min(0, "Quantity must be 0 or greater"),
  isbn: z.string().min(1, "ISBN is required").max(255, "ISBN is too long"),
  category: z
    .string()
    .min(1, "Category is required")
    .max(255, "Category is too long"),
  status: z.enum(["available", "unavailable"]).default("available"),
});

export const studentSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),
  grade: z.string().min(1, "Grade is required").max(50, "Grade is too long"),
  studentId: z
    .string()
    .min(1, "Student ID is required")
    .max(100, "Student ID is too long"),
  phoneNumber: z
    .string()
    .refine((val) => {
      const digits = val.replace(/\D/g, "");
      return digits.length >= 10 && digits.length <= 15;
    }, "Phone number must be digits")
    .optional(),
  status: z.enum(["active", "inactive"]).default("active"),
  createdAt: z.string().optional(),
});

export const lentSchema = z.object({
  bookId: z.string().min(1, "Book ID is required"),
  studentId: z.string().min(1, "Student ID is required"),
  status: z.enum(["lent", "returned"]).default("lent"),
  dueDate: z.string().min(1, "Due date is required"),
});
