"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { trpc } from "@/utils/trpc";
import { useQuery } from "@tanstack/react-query";

export function RecentActivity() {
  const recentActivities = useQuery(
    trpc.statistics.recent_activity.queryOptions()
  );
  if (!recentActivities.data) return null;
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest transactions and library updates
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-muted-foreground">
            Last 24 hours
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentActivities.data.map((activity) => {
            return (
              <div key={activity.id} className={`p-2 border`}>
                <div className="flex items-start space-x-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <p className="font-medium ">{activity.studentName}</p>
                      </div>
                      <Badge className="capitalize">{activity.type}</Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <span className="font-medium">
                          {activity.bookTitle}
                        </span>
                        <ArrowRight className="size-3 mx-2 text-muted-foreground" />
                        <span>{activity.author}</span>
                      </div>

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center space-x-4">
                          <span>ID: {activity.studentId}</span>
                          <Badge variant="outline" className="text-xs">
                            {activity.category}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span>{activity.date}</span>
                          <span>•</span>
                          <span>{activity.time}</span>
                        </div>
                      </div>

                      {activity.dueDate && (
                        <p className="text-xs rounded-md inline-block">
                          Due: {activity.dueDate}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
