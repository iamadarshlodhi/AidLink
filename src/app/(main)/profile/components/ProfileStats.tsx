import type { LucideIcon } from "lucide-react";
import {
  ClipboardList,
  HandHelping,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";

import { ProfileStats as ProfileStatsType } from "@/types/profile";

interface ProfileStatsProps {
  stats: ProfileStatsType;
}

type StatCard = {
  key: keyof ProfileStatsType;
  label: string;
  icon: LucideIcon;
  suffix?: string;
};

const cards: StatCard[] = [
  {
    key: "requestsCreated",
    label: "Requests",
    icon: ClipboardList,
  },
  {
    key: "helpProvided",
    label: "Help Given",
    icon: HandHelping,
  },
  {
    key: "completedRequests",
    label: "Completed",
    icon: CheckCircle2,
  },
  {
    key: "trustScore",
    label: "Trust Score",
    icon: ShieldCheck,
    suffix: "%",
  },
];

export default function ProfileStats({
  stats,
}: ProfileStatsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.key}
            className="rounded-xl border bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {card.label}
              </p>

              <Icon className="h-5 w-5 text-primary" />
            </div>

            <h2 className="mt-4 text-3xl font-bold">
              {stats[card.key]}
              {card.suffix}
            </h2>
          </div>
        );
      })}
    </div>
  );
}