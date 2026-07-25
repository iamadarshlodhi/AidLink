"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

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

  const {
    data,
    isLoading,
    isError,
  } = useDashboard();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/sign-in");
    }
  }, [status, router]);

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
    <div className="space-y-8">
      <WelcomeCard session={session} />

      <QuickActions />

      <StatsGrid stats={data.stats} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <MyRequests requests={data.myRequests} />
        </div>

        <RecentActivity activities={data.recentActivity} />
      </div>

      <AvailableRequests requests={data.availableRequests} />
    </div>
  );
}