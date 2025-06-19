"use client";

import React, { FC, useState } from "react";
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
import type { SelectStudent } from "@/database/schema";
import CreateStudent from "../forms/create-student";
import UpdateDialog from "../update-dialog";
import Link from "next/link";
import { format } from "date-fns";

export interface StudentRowActionsProps {
  student: SelectStudent;
}

const StudentRowActions: FC<StudentRowActionsProps> = ({ student }) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteConfirm = async () => {
    setIsLoading(true);
    try {
      const resp = await fetch("/api/students", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: student.id }),
      });
      if (resp.status !== 204) {
        const { message } = await resp.json().catch(() => ({}));
        setIsLoading(false);
        return toast.error("Error deleting student", {
          description: `${message}`,
        });
      }
      setIsDeleteDialogOpen(false);
      return toast.success("Student deleted successfully.", {
        description: `${format(new Date(), "PPP")}`,
      });
    } catch (err) {
      console.error(err);
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
            onClick={() => navigator.clipboard.writeText(student.id)}
          >
            Copy Student ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href={`/students/${student.id}`} prefetch>
              {" "}
              View student details
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
        title="Delete student"
        description={`Are you sure you want to delete this student? This action cannot be undone.`}
      />
      <UpdateDialog
        title="Edit Student"
        description="Update the details of the selected student."
        isDialogOpen={isUpdateDialogOpen}
        setIsDialogOpen={setIsUpdateDialogOpen}
      >
        <CreateStudent student={student} />
      </UpdateDialog>
    </>
  );
};

export default React.memo(StudentRowActions);
