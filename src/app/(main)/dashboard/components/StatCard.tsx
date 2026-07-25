"use client";

import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  iconColor?: string;
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  description,
  iconColor = "text-primary",
}: StatCardProps) {
  return (
    <div className="rounded-2xl border bg-card p-5 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">
            {title}
          </p>

          <h3 className="text-3xl font-bold tracking-tight">
            {value}
          </h3>

          {description && (
            <p className="text-xs text-muted-foreground">
              {description}
            </p>
          )}
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
      </div>
    </div>
  );
}