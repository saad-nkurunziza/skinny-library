import React, { FC, useState } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import ConfirmDialog from "./confirm-dialog";

interface ItemActionsDropdownProps {
  itemId: string;
  itemName: string;
  tag: "book" | "student";
  setIsDropdownOpen: (t: boolean) => void;
}

const DeleteDropdownAction: FC<ItemActionsDropdownProps> = ({
  itemId,
  itemName,
  setIsDropdownOpen,
  tag,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = () => {
    setIsDropdownOpen(false);
    setIsDialogOpen(true);
  };

  const handleConfirm = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(`api/${tag}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: itemId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to delete ${itemName}`);
      }

      await response.json();

      toast.success("Success", {
        description: `${
          itemName.charAt(0).toUpperCase() + itemName.slice(1)
        } has been deleted.`,
      });

      setIsDialogOpen(false);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";

      toast.error("Error", {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <DropdownMenuItem
        onClick={handleAction}
        className="cursor-pointer text-destructive"
      >
        <Trash2 className="mr-2 h-4 w-4" />
        Delete
      </DropdownMenuItem>

      <ConfirmDialog
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        handleConfirm={handleConfirm}
        title={`Delete ${tag}`}
        description={`Are you sure you want to delete this ${itemName}? This action cannot be undone.`}
        isLoading={isLoading}
      />
    </>
  );
};

export default DeleteDropdownAction;
