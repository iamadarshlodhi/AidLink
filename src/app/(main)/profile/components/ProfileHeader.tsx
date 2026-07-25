"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Star } from "lucide-react";
import { ProfileUser } from "@/types/profile";

interface ProfileHeaderProps {
  user: ProfileUser;
}

export default function ProfileHeader({
  user,
}: ProfileHeaderProps) {

  const initials =
    user.name
      ?.split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase() || "U";

  return (
    <div className="rounded-xl border bg-card p-8 shadow-sm">
      <div className="flex flex-col items-center text-center">
        {/* Avatar */}
        <div className="relative">
          <Avatar className="h-32 w-32">
            <AvatarImage
              src={user.profilePicture || ""}
              alt={user.name || "Profile"}
            />
            <AvatarFallback className="text-3xl">
              {initials}
            </AvatarFallback>
          </Avatar>

          <Button
            size="icon"
            variant="secondary"
            className="absolute bottom-0 right-0 rounded-full"
            disabled
          >
            <Camera className="h-4 w-4" />
          </Button>
        </div>

        {/* User Info */}
        <div className="mt-6 space-y-2">
          <h1 className="text-3xl font-bold">
            {user.name}
          </h1>

          <p className="text-muted-foreground">
            @{user.username}
          </p>

          <p className="text-sm text-muted-foreground">
            {user.email}
          </p>

          <div className="flex items-center justify-center gap-1 text-amber-500">
            <Star className="h-4 w-4 fill-current" />
            <span className="font-medium">
              {user.averageRating?.toFixed(1) || "0.0"}
            </span>

            <span className="text-muted-foreground">
              ({user.totalReviews || 0} reviews)
            </span>
          </div>
        </div>

        {/* Edit Button */}
        <Button asChild className="mt-6">
          <Link href="/profile/edit">
            Edit Profile
          </Link>
        </Button>
      </div>
    </div>
  );
}