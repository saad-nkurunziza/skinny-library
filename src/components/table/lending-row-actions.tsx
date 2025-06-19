"use client";

import React, { FC, useState } from "react";
import { MoreHorizontal, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import ConfirmDialog from "../confirm-dialog";
import type { getLendingRecordsInterface } from "@/server/lending";

export interface LendingRowActionsProps {
  lending: getLendingRecordsInterface;
}

const LendingRowActions: FC<LendingRowActionsProps> = ({ lending }) => {
  const [isReturnDialogOpen, setIsReturnDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleReturnConfirm = async () => {
    setIsLoading(true);
    try {
      const resp = await fetch("/api/lending", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: lending.studentId }),
      });
      if (!resp.ok) {
        const { message } = await resp.json().catch(() => ({}));
        throw new Error(
          message || `Failed to return ${lending.book?.title ?? "item"}`
        );
      }
      toast.success("Success", {
        description: `${
          (lending.book?.title?.charAt(0).toUpperCase() ?? "I") +
          (lending.book?.title?.slice(1) ?? "tem")
        } has been returned.`,
      });
      setIsReturnDialogOpen(false);
    } catch (err) {
      toast.error("Error", {
        description:
          err instanceof Error ? err.message : "An unexpected error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() =>
              navigator.clipboard.writeText(lending.studentId ?? "")
            }
          >
            Copy Student ID
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(lending.bookId ?? "")}
          >
            Copy Book ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setIsReturnDialogOpen(true)}
            className="cursor-pointer"
          >
            <Package className="mr-2 h-4 w-4" />
            Mark as Returned
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDialog
        isDialogOpen={isReturnDialogOpen}
        setIsDialogOpen={setIsReturnDialogOpen}
        handleConfirm={handleReturnConfirm}
        isLoading={isLoading}
        title="Mark as Returned"
        description={`Are you sure you want to mark "${
          lending.book?.title ?? "this item"
        }" as returned? This action cannot be undone.`}
      />
    </>
  );
};

export default React.memo(LendingRowActions);
