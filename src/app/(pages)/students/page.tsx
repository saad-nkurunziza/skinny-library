import { DataTable } from "@/components/table/data-table";
import { getCachedStudents } from "@/server/students";
import { StudentColumn } from "@/utils/columns";

export default async function StudentsPage() {
  const students = await getCachedStudents();

  return (
    <div className="space-y-6">
      <DataTable columns={StudentColumn} data={students} tag="students" />
    </div>
  );
}
