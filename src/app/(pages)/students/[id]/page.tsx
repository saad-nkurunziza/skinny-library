import { getStudentById } from "@/server/students";
import { notFound } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default async function StudentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  try {
    const student = await getStudentById((await params).id);

    if (!student) {
      notFound();
    }

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">{student.name}</CardTitle>
                <CardDescription>
                  Student ID: {student.studentId}
                </CardDescription>
              </div>
              <Badge
                variant={student.status === "active" ? "default" : "secondary"}
              >
                {student.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold">Grade</h3>
                <p className="text-sm text-muted-foreground">{student.grade}</p>
              </div>
              <div>
                <h3 className="font-semibold">Registered On</h3>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(student.createdAt!), "PPP")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Borrowing History</CardTitle>
            <CardDescription>
              History of all books borrowed by this student
            </CardDescription>
          </CardHeader>
          <CardContent>
            {student.lendings ? (
              <div className="space-y-4">
                {student.lendings.map((lending) => (
                  <div
                    key={lending.id}
                    className="flex items-center justify-between border-b py-4 last:border-0"
                  >
                    <div>
                      <div className="font-medium">
                        {lending.book?.title} by {lending.book?.author}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Borrowed: {format(new Date(lending.borrowDate), "PP")}
                        {lending.returnDate &&
                          ` • Returned: ${format(
                            new Date(lending.returnDate),
                            "PP"
                          )}`}
                      </div>
                    </div>
                    <Badge
                      variant={
                        lending.status === "returned"
                          ? "secondary"
                          : lending.status === "overdue"
                          ? "destructive"
                          : "default"
                      }
                    >
                      {lending.status}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                No borrowing history found
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  } catch (error) {
    notFound();
  }
}
