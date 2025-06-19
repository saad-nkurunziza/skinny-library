import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, TrendingUp, Clock, Users2 } from "lucide-react";
import { getDashboardStats } from "@/server/statistics";
import { Suspense } from "react";

async function LibraryStatsContent() {
  const stats = await getDashboardStats();

  return (
    <CardContent className="pt-0 space-y-6">
      {/* Collection Status */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Users2 className="size-4" />
            <span className="text-sm text-muted-foreground">
              Total Students
            </span>
          </div>
          <Badge variant="secondary">{stats.totalStudents}</Badge>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <BookOpen className="size-4" />
            <span className="text-sm text-muted-foreground">
              Available Books
            </span>
          </div>
          <Badge variant="secondary">{stats.availableBooks}</Badge>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Clock className="size-4 " />
            <span className="text-sm text-muted-foreground">
              Currently Loaned
            </span>
          </div>
          <Badge variant="outline">{stats.booksOnLoan}</Badge>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <TrendingUp className="size-4" />
            <span className="text-sm text-muted-foreground">Overdue Items</span>
          </div>
          <Badge variant="destructive">{stats.overdueBooks}</Badge>
        </div>

        <div className="pt-2 border-t ">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium ">Utilization Rate</span>
            <span className="text-sm font-semibold ">
              {stats.utilizationRate}%
            </span>
          </div>
          {/* <Progress value={stats.utilizationRate} className="h-2" /> */}
        </div>
      </div>

      {/* Popular Categories */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium ">Popular Categories</h4>
        <div className="space-y-3">
          {stats.popularCategories.map((category, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  {category.name}
                </span>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-muted-foreground/90">
                    {category.count} loans
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {category.percentage}%
                  </Badge>
                </div>
              </div>
              {/* <Progress value={category.percentage} className="h-1.5" /> */}
            </div>
          ))}
        </div>
      </div>
    </CardContent>
  );
}

export function LibraryStats() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Library Overview</CardTitle>
      </CardHeader>
      <Suspense
        fallback={<div className="p-4 text-center">Loading stats...</div>}
      >
        <LibraryStatsContent />
      </Suspense>
    </Card>
  );
}
