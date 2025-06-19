import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormDialog } from "@/components/form-dialog";
import CreateStudent from "@/components/forms/create-student";
import CreateBook from "@/components/forms/create-book";
import CreateLending from "@/components/forms/create-lending";
import ReturnBook from "@/components/forms/return-book";

export function QuickActions() {
  return (
    <Card>
      <CardHeader className="p">
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-2 gap-3">
          <FormDialog
            title="Create Student"
            triggerText="Create new student"
            description="Create a new student record"
            big
            outline
          >
            <CreateStudent />
          </FormDialog>
          <FormDialog
            title="Create New Book"
            triggerText="Create new book"
            description="Fill in the details of the new book you want to add to the library."
            big
            outline
          >
            <CreateBook />
          </FormDialog>
          <FormDialog
            title="Create Lending"
            triggerText="Create new lending"
            description="Insert a new lending record"
            big
            outline
          >
            <CreateLending />
          </FormDialog>
          <FormDialog
            title="Create Return"
            triggerText="Create new return"
            description="Insert a new return record"
            big
            outline
          >
            <ReturnBook />
          </FormDialog>
        </div>
      </CardContent>
    </Card>
  );
}
