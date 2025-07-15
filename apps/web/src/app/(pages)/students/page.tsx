"use client";

import { DataTable } from "@/components/table/data-table";
import { StudentColumn } from "@/utils/columns";
import { trpc } from "@/utils/trpc";
import { useQuery } from "@tanstack/react-query";

export default function StudentsPage() {
  const students = useQuery(trpc.student.get_all.queryOptions());
  return (
    <div className="space-y-6">
      <DataTable
        columns={StudentColumn}
        data={students.data ?? []}
        tag="students"
      />
    </div>
  );
}
