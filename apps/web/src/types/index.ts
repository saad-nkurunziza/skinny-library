import type {
  SelectBook,
  InsertBook,
  SelectStudent,
  InsertStudent,
  Selectlent,
  Insertlent,
} from "../../../server/src/db/schema";

export type lentRecordsInterface = {
  id: string;
  bookId: string | null;
  studentId: string | null;
  lentAt: string;
  dueDate: string;
  returnedAt: string | null;
  status: "lent" | "returned";
  book: {
    title: string;
    author: string;
  } | null;
  student: {
    name: string;
    studentId: string;
  } | null;
};

export type BookPayload = SelectBook & {
  lent: Selectlent & {
    book: SelectBook;
    student: SelectStudent;
  };
};
export type { SelectBook };
export type { InsertBook };
export type { SelectStudent };
export type { InsertStudent };
export type { Selectlent };
export type { Insertlent };
