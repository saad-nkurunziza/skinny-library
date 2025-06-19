import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { getOverdueBooks } from "@/server/statistics";
import { Suspense } from "react";

async function OverdueBooksContent() {
  const overdueBooks = await getOverdueBooks();
  return (
    <CardContent className="pt-0">
      <div className="space-y-6">
        {overdueBooks.length === 0 ? (
          <div className="text-center text-muted-foreground py-6">
            No overdue books
          </div>
        ) : (
          overdueBooks.map((book) => (
            <div key={book.id} className="border p-2">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div>
                    <span className="font-medium">{book.bookTitle}</span>
                    <span className="text-sm text-muted-foreground ml-2">
                      by {book.author}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <span>{book.studentName}</span>
                    <span className="mx-2">•</span>
                    <span>{book.grade}</span>
                    <span className="mx-2">•</span>
                    <span>ID: {book.studentId}</span>
                  </div>
                </div>
                <Badge variant="destructive" className="shrink-0">
                  {book.daysOverdue} days overdue
                </Badge>
              </div>
              <div className="mt-2 flex items-center text-xs text-muted-foreground">
                <Clock className="mr-1 size-3" />
                Due: {new Date(book.dueDate).toLocaleDateString()}
              </div>
            </div>
          ))
        )}
      </div>
    </CardContent>
  );
}

export function OverdueBooks() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Overdue Books</CardTitle>
        <CardDescription>
          Books requiring immediate attention from students
        </CardDescription>
      </CardHeader>
      <Suspense
        fallback={
          <div className="p-4 text-center">Loading overdue books...</div>
        }
      >
        <OverdueBooksContent />
      </Suspense>
    </Card>
  );
}
