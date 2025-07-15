"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { Timer, CheckIcon, CircleOff } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import LendingRowActions from "@/components/table/lent-row-actions";
import type { lentRecordsInterface } from "@/types";

export const LendingColumn: ColumnDef<lentRecordsInterface>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = lendingStatuses.find(
        (status) => status.value === row.getValue("status")
      );

      if (!status) {
        return null;
      }
      const isOverdue =
        row.original.status === "lent" && row.original.dueDate
          ? new Date(row.original.dueDate) < new Date()
          : false;
      if (isOverdue && status.value === "lent") {
        return (
          <Badge variant="destructive" className="capitalize">
            <CircleOff className="text-muted-foreground size-4" />
            <span>Overdue</span>
          </Badge>
        );
      } else {
        return (
          <Badge variant={status.variant} className="capitalize">
            {status.icon && (
              <status.icon className="text-muted-foreground size-4" />
            )}
            <span>{status.label}</span>
          </Badge>
        );
      }
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "student.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Student Name" />
    ),
    cell: ({ row }) => row.original.student?.name || "N/A",
  },
  {
    accessorKey: "lentAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Lent At" />
    ),
    cell: ({ row }) => {
      const date = row.original.lentAt ? new Date(row.original.lentAt) : null;
      return date ? format(date, "MMM dd, yyyy") : "N/A";
    },
  },
  {
    accessorKey: "dueDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Due Date" />
    ),
    cell: ({ row }) => {
      const date = row.original.dueDate ? new Date(row.original.dueDate) : null;
      return date ? format(date, "MMM dd, yyyy") : "N/A";
    },
  },
  {
    accessorKey: "returnedAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Returned At" />
    ),
    cell: ({ row }) => {
      const date = row.original.returnedAt
        ? new Date(row.original.returnedAt)
        : null;
      return date ? format(date, "MMM dd, yyyy") : "N/A";
    },
  },
  {
    accessorKey: "book.title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Book Title" />
    ),
    cell: ({ row }) => row.original.book?.title || "N/A",
  },
  {
    id: "actions",
    cell: ({ row }) => <LendingRowActions lent={row.original} />,
  },
];

export const lendingStatuses = [
  {
    value: "lent",
    label: "Lent",
    variant: "outline" as "secondary" | "destructive" | "outline",
    icon: Timer,
  },
  {
    value: "returned",
    label: "Returned",
    variant: "secondary" as "secondary" | "destructive" | "outline",
    icon: CheckIcon,
  },
];
