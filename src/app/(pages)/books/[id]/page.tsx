import { getBookById } from "@/server/books";
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

export default async function BookPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  try {
    const book = await getBookById((await params).id);

    if (!book) {
      notFound();
    }

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">{book.title}</CardTitle>
                <CardDescription>by {book.author}</CardDescription>
              </div>
              <Badge
                variant={book.status === "available" ? "default" : "secondary"}
              >
                {book.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold">ISBN</h3>
                <p className="text-sm text-muted-foreground">{book.isbn}</p>
              </div>
              <div>
                <h3 className="font-semibold">Category</h3>
                <p className="text-sm text-muted-foreground">{book.category}</p>
              </div>
              <div>
                <h3 className="font-semibold">Quantity</h3>
                <p className="text-sm text-muted-foreground">{book.quantity}</p>
              </div>
              <div>
                <h3 className="font-semibold">Added On</h3>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(book.createdAt!), "PPP")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lending History</CardTitle>
            <CardDescription>
              History of all borrows and returns for this book
            </CardDescription>
          </CardHeader>
          <CardContent>
            {book.lendings ? (
              <div className="space-y-4">
                {book.lendings.map((lending) => (
                  <div
                    key={lending.id}
                    className="flex items-center justify-between border-b py-4 last:border-0"
                  >
                    <div>
                      <div className="font-medium">
                        {lending.student?.name ?? ""} (
                        {lending.student?.studentId})
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
                No lending history found
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
