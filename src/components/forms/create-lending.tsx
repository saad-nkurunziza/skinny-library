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
import { DialogFooter } from "@/components/ui/dialog";
import { createLendingRecord } from "@/server/lending";
import { toast } from "sonner";
import { SelectBook, SelectStudent } from "@/database/schema";
import { Input } from "../ui/input";
import { FormDialog } from "@/components/form-dialog";
import { addDays, format } from "date-fns";
import useSwr, { preload } from "swr";
import { cn, fetcher } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Calendar } from "../ui/calendar";

const formSchema = z.object({
  borrowDate: z.date(),
  dueDate: z.date().min(new Date(), "Due date must be in the future"),
  bookId: z.string(),
  studentId: z.string(),
  returnDate: z.date().min(new Date(), "Return date must be in the future"),
});

if (typeof window !== "undefined") {
  preload("/api/books", fetcher);
  preload("/api/students", fetcher);
}

export default function CreateLending() {
  const {
    data: booksData,
    error: booksError,
    isLoading: isBooksLoading,
  } = useSwr<SelectBook[]>("/api/books", fetcher);
  const {
    data: studentsData,
    error: studentsError,
    isLoading: isStudentsLoading,
  } = useSwr<SelectStudent[]>("/api/students", fetcher);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      borrowDate: new Date(),
      dueDate: addDays(new Date(), 14),
      bookId: "",
      studentId: "",
      returnDate: addDays(new Date(), 14),
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const record = {
        bookId: values.bookId,
        studentId: values.studentId,
        borrowDate: values.borrowDate.toISOString(),
        dueDate: values.dueDate.toISOString(),
        returnDate: values.returnDate.toISOString(),
      };
      await createLendingRecord(record);
      toast.success("Book has been lent successfully");
      form.reset();
    } catch (error) {
      toast.error("Failed to lend book");
      console.error(error);
    }
  }

  const { isSubmitting } = form.formState;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="bookId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Select Book</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? booksData?.find((book) => book.id === field.value)
                            ?.title
                        : "Search and select a book"}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput
                      placeholder="Type book title or author..."
                      className="h-8"
                    />
                    <CommandList>
                      {isBooksLoading && (
                        <CommandEmpty>Loading books...</CommandEmpty>
                      )}
                      {booksError && (
                        <CommandEmpty>
                          Error loading books. Please try again.
                        </CommandEmpty>
                      )}
                      <CommandGroup heading="Available Books">
                        {booksData?.map((book) => (
                          <CommandItem
                            value={book.title}
                            key={book.id}
                            onSelect={() => {
                              form.setValue("bookId", book.id);
                            }}
                          >
                            {book.title} - {book.author}
                            <Check
                              className={cn(
                                "ml-auto",
                                book.id === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormDescription>
                Only available books are shown in this list
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="studentId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Select Student</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? studentsData?.find(
                            (student) => student.id === field.value
                          )?.name
                        : "Search and select a student"}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="p-0">
                  <Command>
                    <CommandInput
                      placeholder="Type student name or ID..."
                      className="h-8"
                    />
                    <CommandList>
                      {isStudentsLoading && (
                        <CommandEmpty>Loading students...</CommandEmpty>
                      )}
                      {studentsError && (
                        <CommandEmpty>
                          Error loading students. Please try again.
                        </CommandEmpty>
                      )}
                      <CommandGroup heading="Active Students">
                        {studentsData?.map((student) => (
                          <CommandItem
                            value={student.name}
                            key={student.id}
                            onSelect={() => {
                              form.setValue("studentId", student.id);
                            }}
                          >
                            {student.name} ({student.studentId}) - Grade{" "}
                            {student.grade}
                            <Check
                              className={cn(
                                "ml-auto",
                                student.id === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormDescription>
                Only active students can borrow books
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="returnDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Return date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Card className="max-w-[300px] py-4">
                    <CardContent className="px-4">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        defaultMonth={field.value || new Date()}
                        className="bg-transparent p-0 [--cell-size:--spacing(9.5)]"
                      />
                    </CardContent>
                    <CardFooter className="!flex !flex-wrap gap-2 border-t px-4 !pt-4">
                      {[
                        // { label: "Today", value: 0 },
                        { label: "Tomorrow", value: 1 },
                        { label: "In 3 days", value: 3 },
                        { label: "In a week", value: 7 },
                        { label: "In 2 weeks", value: 14 },
                        { label: "In 4 weeks", value: 28 },
                      ].map((preset) => (
                        <Button
                          key={preset.value}
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newDate = addDays(new Date(), preset.value);
                            field.onChange(newDate);
                          }}
                        >
                          {preset.label}
                        </Button>
                      ))}
                    </CardFooter>
                  </Card>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Lending..." : "Lend Book"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

export const CreateLendingDialog = () => {
  return (
    <FormDialog
      title="Create Lending"
      triggerText="Create new lending"
      description="Insert a new lending record"
    >
      <CreateLending />
    </FormDialog>
  );
};
