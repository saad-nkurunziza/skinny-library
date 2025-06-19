"use client";

import { Table } from "@tanstack/react-table";
import { X, Circle, CircleOff } from "lucide-react";

import { Button } from "@/components/ui/button";

import { DataTableViewOptions } from "./data-table-view-options";
import { DataTableDashFilter } from "./data-table-faceted-filter";
import { studentStatuses } from "@/utils/columns/students";
import { CreateStudentDialog } from "@/components/forms/create-student";
import { DataTableSearch } from "./data-table-search";
import { DataTableExportPDF } from "./data-table-export-pdf";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function StudentsDataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const studentGrades = [
    {
      value: "6",
      label: "Grade 6",
    },
    {
      value: "7",
      label: "Grade 7",
    },
    {
      value: "8",
      label: "Grade 8",
    },
    {
      value: "9",
      label: "Grade 9",
    },
    {
      value: "10",
      label: "Grade 10",
    },
    {
      value: "11",
      label: "Grade 11",
    },
    {
      value: "12",
      label: "Grade 12",
    },
  ];
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center gap-2">
        <DataTableSearch table={table} placeholder="Filter students..." />
        {table.getColumn("status") && (
          <DataTableDashFilter
            column={table.getColumn("status")}
            title="Status"
            options={studentStatuses}
          />
        )}
        {table.getColumn("grade") && (
          <DataTableDashFilter
            column={table.getColumn("grade")}
            title="Grade"
            options={studentGrades}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => table.resetColumnFilters()}
          >
            Reset
            <X />
          </Button>
        )}
      </div>
      <div className="flex items-center gap-2">
        <DataTableExportPDF
          table={table}
          filename="students_export"
          title="Students Report"
        />
        <DataTableViewOptions table={table} />
        <CreateStudentDialog />
      </div>
    </div>
  );
}
