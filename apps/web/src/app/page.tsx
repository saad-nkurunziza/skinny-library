"use client";

import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/utils/trpc";
import Stat from "@/components/dashboard/stat";
import { OverdueBooks } from "@/components/dashboard/overdue-books";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { PopularBooks } from "@/components/dashboard/popular-books";
import { LibraryStats } from "@/components/dashboard/library-stats";
import { Loader2 } from "lucide-react";

export default function Home() {
  const dashboardStats = useQuery(
    trpc.statistics.dashboard_stats.queryOptions()
  );
  console.log({ dashboardStats: dashboardStats.data });
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        {dashboardStats.isLoading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : !dashboardStats.data ? (
          <p className="py-4 text-center">
            No dashboard stats yet. Add one above!
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 w-full">
            <Stat
              name="Total Books"
              stat={dashboardStats.data.totalBooks ?? 0}
            />
            <Stat
              name="Available"
              stat={dashboardStats.data.availableBooks ?? 0}
            />
            <Stat name="On Loan" stat={dashboardStats.data.booksOnLoan ?? 0} />
            <Stat name="Overdue" stat={dashboardStats.data.overdueBooks ?? 0} />
          </div>
        )}
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
