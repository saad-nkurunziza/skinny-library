"use client";

import { LendingColumn } from "@/utils/columns";
import { DataTable } from "@/components/table/data-table";
import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/utils/trpc";

export default function LendingPage() {
  const records = useQuery(trpc.lent.get_all.queryOptions());
  if (!records.data) return null;

  const sanitizedData = records.data.map((record) => ({
    ...record,
    lentAt: record.lentAt ?? "",
    status: record.status ?? "lent",
  }));

  return (
    <div className="space-y-6">
      <DataTable columns={LendingColumn} data={sanitizedData} tag="lending" />
    </div>
  );
}
