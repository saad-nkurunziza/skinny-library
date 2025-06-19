import { DataTable } from "@/components/table/data-table";
import { getCachedBooks } from "@/server/books";
import { BookColumn } from "@/utils/columns";
import { Book } from "lucide-react";

export default async function BooksPage() {
  const books = await getCachedBooks();

  return (
    <div className="space-y-6">
      <DataTable columns={BookColumn} data={books} tag="books" />
    </div>
  );
}
