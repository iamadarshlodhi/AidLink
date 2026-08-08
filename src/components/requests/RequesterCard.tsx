"use client";

import { Card, CardContent } from "@/components/ui/card";
import type { HelpRequester } from "@/types/help-request";

interface RequesterCardProps {
  requester: HelpRequester;
}

export default function RequesterCard({
  requester,
}: RequesterCardProps) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 pt-6">
        <img
          src={
            requester.profilePicture ||
            "/default-avatar.png"
          }
          alt={requester.name}
          className="h-16 w-16 rounded-full object-cover"
        />

        <div>
          <h3 className="font-semibold">
            {requester.name}
          </h3>

          <p className="text-sm text-muted-foreground">
            @{requester.username}
          </p>

          <p className="text-sm">
            ⭐ {requester.averageRating ?? 0}
          </p>

          <p className="text-sm">
            Trust Score:{" "}
            {requester.trustScore ?? 0}
          </p>

          <p className="text-sm">
            {requester.verificationStatus}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}