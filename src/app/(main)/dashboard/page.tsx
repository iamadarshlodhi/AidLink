"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import WelcomeCard from "./components/WelcomeCard";
import QuickActions from "./components/QuickActions";
import StatsGrid from "./components/StatsGrid";
import MyRequests from "./components/MyRequests";
import AvailableRequests from "./components/AvailableRequests";

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

      <div>
        <MyRequests requests={data.myRequests} />
      </div>

      <AvailableRequests requests={data.availableRequests} />
    </div>
  );
}