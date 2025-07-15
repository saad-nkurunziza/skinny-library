"use client";

import React, { type FC, useState } from "react";
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
import ConfirmDialog from "../confirm-dialog";
import type { lentRecordsInterface } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { trpc } from "@/utils/trpc";
import { toast } from "sonner";

export interface LentRowActionsProps {
  lent: lentRecordsInterface;
}

const LentRowActions: FC<LentRowActionsProps> = ({ lent }) => {
  const [isReturnDialogOpen, setIsReturnDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const returnMutation = useMutation(
    trpc.lent.return.mutationOptions({
      onSuccess: () => {
        toast.success(`Lent book returned`);
        queryClient.invalidateQueries({
          queryKey: trpc.student.get_all.queryKey(),
        });
        queryClient.invalidateQueries({
          queryKey: trpc.lent.get_all.queryKey(),
        });
        queryClient.invalidateQueries({
          queryKey: trpc.book.get_all.queryKey(),
        });
        queryClient.invalidateQueries({
          queryKey: trpc.statistics.dashboard_stats.queryKey(),
        });
        queryClient.invalidateQueries({
          queryKey: trpc.statistics.popular_books.queryKey(),
        });
        queryClient.invalidateQueries({
          queryKey: trpc.statistics.recent_activity.queryKey(),
        });
        queryClient.invalidateQueries({
          queryKey: trpc.statistics.overdue_books.queryKey(),
        });
      },
      onError: () => {
        toast.error("Failed to return");
      },
    })
  );
  const handleReturnConfirm = () => {
    setIsLoading(true);
    try {
      returnMutation.mutate({ id: lent.id });
    } catch (err) {
      console.error(err);
      return toast.error("Error returning book", {
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
            onClick={() => navigator.clipboard.writeText(lent.studentId ?? "")}
          >
            Copy Student ID
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(lent.bookId ?? "")}
          >
            Copy Book ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setIsReturnDialogOpen(true)}
            className="cursor-pointer"
          >
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
          lent.book?.title ?? "this item"
        }" as returned? This action cannot be undone.`}
      />
    </>
  );
};

export default React.memo(LentRowActions);
