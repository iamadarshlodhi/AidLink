"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";

import WelcomeCard from "./components/WelcomeCard";
import QuickActions from "./components/QuickActions";
import StatsGrid from "./components/StatsGrid";
import MyRequests from "./components/MyRequests";
import AvailableRequests from "./components/AvailableRequests";
import RecentActivity from "./components/RecentActivity";

import { useDashboard } from "@/hooks/useDashboard";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Fetch dashboard data using TanStack Query
  const {
    data,
    isLoading,
    isError,
  } = useDashboard();

  // Redirect if user is not logged in
  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/sign-in");
    }
  }, [status, router]);

  // Wait for session and dashboard data
  if (status === "loading" || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!session) return null;

  if (isError || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Failed to load dashboard.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl space-y-8 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">
            Dashboard
          </h1>

          <div className="flex items-center gap-3">
            <ThemeToggle />

            <Button
              variant="outline"
              onClick={() =>
                signOut({
                  redirectTo: "/sign-in",
                })
              }
            >
              Sign Out
            </Button>
          </div>
        </div>

        {/* Welcome */}
        <WelcomeCard session={session} />

        {/* Quick Actions */}
        <QuickActions />

        {/* Stats */}
        <StatsGrid stats={data.stats} />

        {/* Requests + Activity */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <MyRequests requests={data.myRequests} />
          </div>

          <RecentActivity activities={data.recentActivity} />
        </div>

        {/* Available Requests */}
        <AvailableRequests requests={data.availableRequests} />
      </div>
    </div>
  );
}