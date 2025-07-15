// "use client";

// import { notFound, useParams } from "next/navigation";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { format } from "date-fns";
// import { useQuery } from "@tanstack/react-query";
// import { trpc } from "@/utils/trpc";

// export default function BookPage() {
//   const { id } = useParams<{ id: string }>();
//   const bookReq = useQuery(trpc.book.get_by_id.queryOptions({ id }));
//   console.log("Book data:", bookReq.data);

//   if (!bookReq.data) {
//     notFound();
//   }
//   const book = bookReq.data;
//   return (
//     <div className="space-y-6">
//       <Card>
//         <CardHeader>
//           <div className="flex items-center justify-between">
//             <div>
//               <CardTitle className="text-2xl">{book.title}</CardTitle>
//               <CardDescription>by {book.author}</CardDescription>
//             </div>
//             <Badge
//               variant={book.status === "available" ? "default" : "secondary"}
//             >
//               {book.status}
//             </Badge>
//           </div>
//         </CardHeader>
//         <CardContent className="grid gap-4">
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <h3 className="font-semibold">ISBN</h3>
//               <p className="text-sm text-muted-foreground">{book.isbn}</p>
//             </div>
//             <div>
//               <h3 className="font-semibold">Category</h3>
//               <p className="text-sm text-muted-foreground">{book.category}</p>
//             </div>
//             <div>
//               <h3 className="font-semibold">Quantity</h3>
//               <p className="text-sm text-muted-foreground">{book.quantity}</p>
//             </div>
//             <div>
//               <h3 className="font-semibold">Added On</h3>
//               <p className="text-sm text-muted-foreground">
//                 {format(new Date(book.createdAt!), "PPP")}
//               </p>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       <Card>
//         <CardHeader>
//           <CardTitle>Lending History</CardTitle>
//           <CardDescription>
//             History of all borrows and returns for this book
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           {book.lents ? (
//             <div className="space-y-4">
//               {book.lents.map((lending) => {
//                 const isOverdue =
//                   lending.status === "lent"
//                     ? new Date(lending.dueDate) < new Date()
//                     : false;
//                 const statusVariant =
//                   lending.status === "returned"
//                     ? "secondary"
//                     : isOverdue
//                     ? "destructive"
//                     : "default";
//                 const statusText =
//                   lending.status === "returned"
//                     ? "Returned"
//                     : isOverdue
//                     ? "Overdue"
//                     : "Lent";
//                 return (
//                   <div
//                     key={lending.id}
//                     className="flex items-center justify-between border-b py-4 last:border-0"
//                   >
//                     <div>
//                       <div className="font-medium">
//                         {lending.student?.name ?? ""} (
//                         {lending.student?.studentId})
//                       </div>
//                       <div className="text-sm text-muted-foreground">
//                         Borrowed: {format(new Date(lending.lentAt!), "PP")}
//                         {lending.returnedAt &&
//                           ` • Returned: ${format(
//                             new Date(lending.returnedAt!),
//                             "PP"
//                           )}`}
//                       </div>
//                     </div>
//                     <Badge variant={statusVariant}>{statusText}</Badge>
//                   </div>
//                 );
//               })}
//             </div>
//           ) : (
//             <div className="text-center py-6 text-muted-foreground">
//               No lending history found
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

export default function page() {
  return (
    <div className="flex items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">Book Page</h1>
    </div>
  );
}
