"use client";

import React, { type FC, useState } from "react";
import { Edit, MoreHorizontal, Package, Trash, Eye } from "lucide-react";
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
import UpdateDialog from "../update-dialog";
import CreateBook from "../forms/create-book";
import Link from "next/link";
import { format } from "date-fns";
import type { SelectBook } from "../../../../server/src/db/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { trpc } from "@/utils/trpc";

export interface BookRowActionsProps {
  book: SelectBook;
}

const BookRowActions: FC<BookRowActionsProps> = ({ book }) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const deleteMutation = useMutation(
    trpc.book.delete.mutationOptions({
      onSuccess: () => {
        toast.success(`Book deleted`, {
          description: format(new Date(), "EEEE MM yyyy h:mm a"),
        });
        queryClient.invalidateQueries({
          queryKey: trpc.book.get_all.queryKey(),
        });
      },
      onError: (e) => {
        console.log(e);
        toast.error("Failed to delete");
      },
    })
  );
  const handleDeleteConfirm = () => {
    setIsLoading(true);
    try {
      deleteMutation.mutate({ id: book.id });
    } catch (err) {
      console.error(err);
      return toast.error("Error deleting book", {
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
            onClick={() => navigator.clipboard.writeText(book.id)}
          >
            Copy Book ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href={`/books/${book.id}`} prefetch>
              View book details
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setIsUpdateDialogOpen(true)}
            className="cursor-pointer"
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onClick={() => setIsDeleteDialogOpen(true)}
            className="cursor-pointer"
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDialog
        isDialogOpen={isDeleteDialogOpen}
        setIsDialogOpen={setIsDeleteDialogOpen}
        handleConfirm={handleDeleteConfirm}
        isLoading={isLoading}
        title="Delete book"
        description={`Are you sure you want to delete this book? This action cannot be undone.`}
      />
      <UpdateDialog
        title="Edit Book"
        description="Update the details of the selected book."
        isDialogOpen={isUpdateDialogOpen}
        setIsDialogOpen={setIsUpdateDialogOpen}
      >
        <CreateBook book={book} />
      </UpdateDialog>
    </>
  );
};

export default React.memo(BookRowActions);
