"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "../ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { trpc } from "@/utils/trpc";
import { toast } from "sonner";
import { format } from "date-fns";
import { FormDialog } from "../form-dialog";

const formSchema = z.object({
  studentId: z.string().min(1, "Lending record is required"),
});

export default function ReturnBook() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      studentId: "",
    },
  });
  const queryClient = useQueryClient();
  const createMutation = useMutation(
    trpc.lent.return.mutationOptions({
      onSuccess: () => {
        toast.success(`Book returned`, {
          description: format(new Date(), "EEEE MM yyyy h:mm a"),
        });
        queryClient.invalidateQueries({
          queryKey: ["lent", "book", "student"],
        });
        form.reset();
      },
    })
  );

  function handleSubmit(values: z.infer<typeof formSchema>) {
    createMutation.mutate({ id: values.studentId });
  }
  const { isSubmitting } = form.formState;
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="studentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Enter Student ID</FormLabel>
              <FormControl>
                <Input placeholder="e.g., ST2024001" {...field} />
              </FormControl>
              <FormDescription>
                Enter the ID of the student returning the book. This will mark
                all borrowed books as returned.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Returning..." : "Return Book"}
        </Button>
      </form>
    </Form>
  );
}

export const CreateReturnDialog = () => {
  return (
    <FormDialog
      title="Create Return"
      outline
      triggerText="Create new return"
      description="Insert a new return record"
    >
      <ReturnBook />
    </FormDialog>
  );
};
