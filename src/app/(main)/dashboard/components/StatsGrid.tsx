"use client";

import {
  Bell,
  ClipboardList,
  Star,
  CheckCircle2,
  FileText,
} from "lucide-react";

import StatCard from "./StatCard";

interface Stats {
  activeRequests: number;
  myApplications: number;
  unreadNotifications: number;
  completedTasks: number;
  averageRating: number;
  totalReviews: number;
}

interface StatsGridProps {
  stats: Stats;
}

export default function StatsGrid({
  stats,
}: StatsGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      <StatCard
        title="Active Requests"
        value={stats.activeRequests}
        icon={FileText}
        description="Currently active"
        iconColor="text-blue-500"
      />

      <StatCard
        title="Applications"
        value={stats.myApplications}
        icon={ClipboardList}
        description="Applied requests"
        iconColor="text-green-500"
      />

      <StatCard
        title="Notifications"
        value={stats.unreadNotifications}
        icon={Bell}
        description="Unread"
        iconColor="text-yellow-500"
      />

      <StatCard
        title="Completed"
        value={stats.completedTasks}
        icon={CheckCircle2}
        description="Tasks completed"
        iconColor="text-emerald-500"
      />

      <StatCard
        title="Rating"
        value={`${stats.averageRating.toFixed(1)} ⭐`}
        icon={Star}
        description={`${stats.totalReviews} reviews`}
        iconColor="text-orange-500"
      />
    </div>
  );
}