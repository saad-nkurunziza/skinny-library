"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Circle, Timer } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import BookRowActions from "@/components/table/book-row-actions";
import type { SelectBook } from "@/types";

export const BookColumn: ColumnDef<SelectBook>[] = [
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
      const status = bookStatuses.find(
        (status) => status.value === row.original.status
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
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
  },
  {
    accessorKey: "author",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Author" />
    ),
  },
  {
    accessorKey: "quantity",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Quantity" />
    ),
    cell: ({ row }) => row.original.quantity ?? null,
  },
  {
    accessorKey: "isbn",
    header: "ISBN",
  },
  {
    accessorKey: "category",
    header: "Category",
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
      return date ? format(date, "MMM dd, yyyy") : null;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <BookRowActions book={row.original} />,
  },
];

export const bookStatuses = [
  {
    value: "available",
    label: "Available",
    variant: "outline" as "secondary" | "destructive" | "outline",
    icon: Circle,
  },
  {
    value: "borrowed",
    label: "Borrowed",
    variant: "secondary" as "secondary" | "destructive" | "outline",
    icon: Timer,
  },
];
