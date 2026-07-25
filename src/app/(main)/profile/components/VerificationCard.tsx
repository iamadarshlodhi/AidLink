import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BadgeCheck,
  Phone,
  ShieldCheck,
} from "lucide-react";

import { ProfileUser } from "@/types/profile";

interface VerificationCardProps {
  user: ProfileUser;
}

export default function VerificationCard({
  user,
}: VerificationCardProps) {
  const verificationColor = {
    verified: "default",
    pending: "secondary",
    unverified: "destructive",
  } as const;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Verification</CardTitle>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-primary" />

            <span>Identity Verification</span>
          </div>

          <Badge
            variant={
              verificationColor[user.verificationStatus]
            }
          >
            {user.verificationStatus}
          </Badge>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Phone className="h-5 w-5 text-primary" />

            <span>Phone Verification</span>
          </div>

          <Badge
            variant={
              user.phoneVerified
                ? "default"
                : "secondary"
            }
          >
            {user.phoneVerified
              ? "Verified"
              : "Not Verified"}
          </Badge>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BadgeCheck className="h-5 w-5 text-primary" />

            <span>Role</span>
          </div>

          <Badge variant="outline">
            {user.role}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}