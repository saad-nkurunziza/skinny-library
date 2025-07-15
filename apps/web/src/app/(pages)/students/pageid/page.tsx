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

// export default function StudentPage() {
//   const { id } = useParams<{ id: string }>();
//   const studentReq = useQuery(trpc.student.get_by_id.queryOptions({ id }));
//   console.log("Student data:", studentReq.data);

//   if (!studentReq.data) {
//     notFound();
//   }
//   const student = studentReq.data;

//   return (
//     <div className="space-y-6">
//       <Card>
//         <CardHeader>
//           <div className="flex items-center justify-between">
//             <div>
//               <CardTitle className="text-2xl">{student.name}</CardTitle>
//               <CardDescription>Student ID: {student.studentId}</CardDescription>
//             </div>
//             <Badge
//               variant={student.status === "active" ? "default" : "secondary"}
//             >
//               {student.status}
//             </Badge>
//           </div>
//         </CardHeader>
//         <CardContent className="grid gap-4">
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <h3 className="font-semibold">Grade</h3>
//               <p className="text-sm text-muted-foreground">{student.grade}</p>
//             </div>
//             <div>
//               <h3 className="font-semibold">Registered On</h3>
//               <p className="text-sm text-muted-foreground">
//                 {format(new Date(student.createdAt!), "PPP")}
//               </p>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       <Card>
//         <CardHeader>
//           <CardTitle>Borrowing History</CardTitle>
//           <CardDescription>
//             History of all books borrowed by this student
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           {student.lents ? (
//             <div className="space-y-4">
//               {student.lents.map((lending) => {
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
      <h1 className="text-2xl font-bold">Student Page</h1>
    </div>
  );
}
