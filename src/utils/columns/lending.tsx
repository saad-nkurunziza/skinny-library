"use client";

import type { SelectLending } from "@/database/schema";
import { ColumnDef } from "@tanstack/react-table";
import {
  MoreHorizontal,
  Circle,
  Timer,
  CheckIcon,
  CircleOff,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import type { getLendingRecordsInterface } from "@/server/lending";
import LendingRowActions from "@/components/table/lending-row-actions";

export const LendingColumn: ColumnDef<getLendingRecordsInterface>[] = [
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
      return (
        <Badge variant={status.variant} className="capitalize">
          {status.icon && (
            <status.icon className="text-muted-foreground size-4" />
          )}
          <span>{status.label}</span>
        </Badge>
      );
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
    accessorKey: "borrowDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Borrow Date" />
    ),
    cell: ({ row }) => {
      const date = row.original.borrowDate
        ? new Date(row.original.borrowDate)
        : null;
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
    accessorKey: "returnDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Return Date" />
    ),
    cell: ({ row }) => {
      const date = row.original.returnDate
        ? new Date(row.original.returnDate)
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
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => {
      const date = row.original.createdAt
        ? new Date(row.original.createdAt)
        : null;
      return date ? format(date, "MMM dd, yyyy") : "N/A";
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <LendingRowActions lending={row.original} />,
  },
];

export const lendingStatuses = [
  {
    value: "borrowed",
    label: "borrowed",
    variant: "outline" as "secondary" | "destructive" | "outline",
    icon: Timer,
  },
  {
    value: "returned",
    label: "returned",
    variant: "secondary" as "secondary" | "destructive" | "outline",
    icon: CheckIcon,
  },
  {
    value: "overdue",
    label: "overdue",
    variant: "secondary" as "secondary" | "destructive" | "outline",
    icon: CircleOff,
  },
];
