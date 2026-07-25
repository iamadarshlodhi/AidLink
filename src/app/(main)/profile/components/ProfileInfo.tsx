import {
  Mail,
  Phone,
  User,
  CalendarDays,
  BadgeCheck,
} from "lucide-react";

import { ProfileUser } from "@/types/profile";

interface ProfileInfoProps {
  user: ProfileUser;
}

const formatDate = (date?: string | Date) => {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export default function ProfileInfo({
  user,
}: ProfileInfoProps) {
  const items = [
    {
      label: "Name",
      value: user.name,
      icon: User,
    },
    {
      label: "Username",
      value: `@${user.username}`,
      icon: User,
    },
    {
      label: "Email",
      value: user.email,
      icon: Mail,
    },
    {
      label: "Phone",
      value: user.phone || "-",
      icon: Phone,
    },
    {
      label: "Joined",
      value: formatDate(user.createdAt),
      icon: CalendarDays,
    },
  ];

  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-semibold">
        Personal Information
      </h2>

      <div className="grid gap-6 sm:grid-cols-2">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="flex items-start gap-4"
            >
              <div className="rounded-lg bg-primary/10 p-2">
                <Icon className="h-5 w-5 text-primary" />
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  {item.label}
                </p>

                <p className="font-medium break-all">
                  {item.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}