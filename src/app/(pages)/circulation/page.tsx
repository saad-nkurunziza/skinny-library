import { LendingColumn } from "@/utils/columns";
import { getCachedLendingRecords } from "@/server/lending";
import { DataTable } from "@/components/table/data-table";

export default async function LendingPage() {
  const records = await getCachedLendingRecords();
  return (
    <div className="space-y-6">
      <DataTable columns={LendingColumn} data={records} tag="lending" />
    </div>
  );
}
