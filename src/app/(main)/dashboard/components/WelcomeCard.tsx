"use client";

import { Session } from "next-auth";
import { CalendarDays } from "lucide-react";

interface WelcomeCardProps {
  session: Session;
}

export default function WelcomeCard({
  session,
}: WelcomeCardProps) {
  const hour = new Date().getHours();

  let greeting = "Good Evening";

  if (hour < 12) {
    greeting = "Good Morning";
  } else if (hour < 17) {
    greeting = "Good Afternoon";
  }

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="rounded-2xl border bg-card p-6 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            {greeting}, {session.user.username}! 👋
          </h2>

          <p className="text-muted-foreground">
            Welcome back to <span className="font-medium">AidLink</span>. Ready
            to make a difference today?
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-lg border bg-muted/40 px-4 py-2 text-sm">
          <CalendarDays className="h-4 w-4" />
          <span>{today}</span>
        </div>
      </div>
    </div>
  );
}