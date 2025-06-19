import { RecentActivity } from "@/components/dashboard/recent-activity";
import { OverdueBooks } from "@/components/dashboard/overdue-books";
import { PopularBooks } from "@/components/dashboard/popular-books";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { LibraryStats } from "@/components/dashboard/library-stats";
import Stat from "@/components/dashboard/stat";
import { getDashboardStats } from "@/server/statistics";

export default async function Page() {
  const stats = await getDashboardStats();
  if (stats.totalBooks === 0 && stats.totalStudents === 0)
    return (
      <div>
        <h5 className="text-lg font-medium mb-8 mt-2">Welcome</h5>
        <QuickActions />
      </div>
    );
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 w-full">
          <Stat name="Total Books" stat={stats.totalBooks} />
          <Stat name="Available" stat={stats.availableBooks} />
          <Stat name="On Loan" stat={stats.booksOnLoan} />
          <Stat name="Overdue" stat={stats.overdueBooks} />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 mt-8">
          <div className="xl:col-span-8 space-y-8">
            <RecentActivity />
            <OverdueBooks />
          </div>

          <div className="xl:col-span-4 space-y-8">
            <QuickActions />
            <PopularBooks />
            <LibraryStats />
          </div>
        </div>
      </div>
    </div>
  );
}
