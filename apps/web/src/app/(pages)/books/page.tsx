"use client";
import { DataTable } from "@/components/table/data-table";
import { BookColumn } from "@/utils/columns";
import { trpc } from "@/utils/trpc";
import { useQuery } from "@tanstack/react-query";

export default function BooksPage() {
  const books = useQuery(trpc.book.get_all.queryOptions());
  console.log(books.data);
  // if (!books.data) return null;
  return (
    <div className="space-y-6">
      <DataTable columns={BookColumn} data={books.data ?? []} tag="books" />
    </div>
  );
}
