"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { format } from "date-fns";
import { bookSchema } from "../../../../server/src/type-interfaces/zod-schemas";
import { FormDialog } from "../form-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { trpc } from "@/utils/trpc";
import type { SelectBook } from "@/types";

const categories = [
  "Fiction",
  "Non-Fiction",
  "Science",
  "Technology",
  "History",
  "Biography",
  "Literature",
  "Reference",
] as const;

export default function CreateBook({ book }: { book?: SelectBook }) {
  const queryClient = useQueryClient();
  const createMutation = useMutation(
    trpc.book.create.mutationOptions({
      onSuccess: () => {
        toast.success(`Book has been created`, {
          description: format(new Date(), "EEEE MM yyyy h:mm a"),
        });
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
        form.reset();
      },
    })
  );
  const updateMutation = useMutation(
    trpc.book.update.mutationOptions({
      onSuccess: () => {
        toast.success(`Book has been updated`, {
          description: format(new Date(), "EEEE MM yyyy h:mm a"),
        });
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
        form.reset();
      },
    })
  );

  const form = useForm({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      title: book ? book.title : "",
      author: book ? book.author : "",
      isbn: book ? book.isbn : "",
      category: book ? book.category : "",
      quantity: book && book.quantity !== null ? book.quantity ?? 0 : 1,
    },
  });

  function onSubmit(values: z.infer<typeof bookSchema>) {
    try {
      book
        ? updateMutation.mutate({ ...values, id: book.id })
        : createMutation.mutate(values);
    } catch (error) {
      toast.error(`Failed to ${book ? "update" : "create"} book`, {
        description: "Please try again",
      });
      console.error(error);
    }
  }
  const { isSubmitting } = form.formState;
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Book Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g., The Great Gatsby" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="author"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Author</FormLabel>
              <FormControl>
                <Input placeholder="e.g., F. Scott Fitzgerald" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isbn"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ISBN</FormLabel>
              <FormControl>
                <Input placeholder="e.g., 978-3-16-148410-0" {...field} />
              </FormControl>
              <FormDescription>
                International Standard Book Number
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="e.g., Fiction" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantity</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="0"
                  placeholder="e.g., 5"
                  {...field}
                  value={field.value as number | string | undefined}
                />
              </FormControl>
              <FormDescription>Number of copies available</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? `${book ? "Updating" : "Creating"} ...`
            : `${book ? "Update" : "Create"} book`}
        </Button>
      </form>
    </Form>
  );
}

export const CreateBookDialog = () => {
  return (
    <FormDialog
      title="Create New Book"
      triggerText="Create Book"
      description="Fill in the details of the new book you want to add to the library."
    >
      <CreateBook />
    </FormDialog>
  );
};
