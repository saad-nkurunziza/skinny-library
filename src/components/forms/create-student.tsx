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
import { DialogFooter } from "@/components/ui/dialog";
import { createStudent, updateStudent } from "@/server/students";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { FormDialog } from "../form-dialog";
import type { SelectStudent } from "@/database/schema";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  grade: z.string(),
  studentId: z.string().min(3, "Student ID must be at least 3 characters"),
});

export default function CreateStudent({
  student,
}: {
  student?: SelectStudent;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: student ? student.name : "",
      grade: student ? student.grade : "6",
      studentId: student ? student.studentId : "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const studentRecord = student
        ? await updateStudent({ ...values, id: student.id })
        : await createStudent(values);
      if (studentRecord) {
        toast.success(`Student has been ${student ? "updated" : "created"}`, {
          description: format(new Date(), "EEEE MM yyyy h:mm a"),
        });
        form.reset();
      }
    } catch (error) {
      toast.error(`Failed to ${student ? "update" : "create"} student`, {
        description: "Please try again",
      });
      console.error(error);
    }
  }
  const { isSubmitting } = form.formState;
  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., John Smith" {...field} />
                </FormControl>
                <FormDescription>
                  Enter student's complete name as it appears in official
                  documents
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="grade"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Grade</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select student's grade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="6">Grade 6</SelectItem>
                      <SelectItem value="7">Grade 7</SelectItem>
                      <SelectItem value="8">Grade 8</SelectItem>
                      <SelectItem value="9">Grade 9</SelectItem>
                      <SelectItem value="10">Grade 10</SelectItem>
                      <SelectItem value="11">Grade 11</SelectItem>
                      <SelectItem value="12">Grade 12</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormDescription>
                  Current academic year of the student
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="studentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Student ID</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., ST2024001" {...field} />
                </FormControl>
                <FormDescription>
                  Unique identifier for the student. Use school's standard
                  format
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <DialogFooter>
            <Button type="button" variant="outline">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? `${student ? "Updating" : "Creating"} ...`
                : `${student ? "Update" : "Create"} student`}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </div>
  );
}

export const CreateStudentDialog = () => {
  return (
    <FormDialog
      title="Create Student"
      triggerText="Create new student"
      description="Create a new student record"
    >
      <CreateStudent />
    </FormDialog>
  );
};
