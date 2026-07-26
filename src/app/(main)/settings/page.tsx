import Link from "next/link";

import {
  User,
  LockKeyhole,
  Bell,
  Trash2,
  ChevronRight,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import DeleteAccountDialog from "@/components/settings/DeleteAccountDialog";

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold">
          Settings
        </h1>

        <p className="mt-2 text-muted-foreground">
          Manage your account and preferences.
        </p>
      </div>

      <div className="space-y-4">

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile
            </CardTitle>

            <CardDescription>
              Update your personal information.
            </CardDescription>
          </CardHeader>

          <CardContent className="flex justify-end">
            <Button asChild>
              <Link href="/profile">
                Edit Profile
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LockKeyhole className="h-5 w-5" />
              Password
            </CardTitle>

            <CardDescription>
              Change your account password.
            </CardDescription>
          </CardHeader>

          <CardContent className="flex justify-end">
            <Button asChild>
              <Link href="/settings/change-password">
                Change Password
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>

            <CardDescription>
              Manage your notification preferences.
            </CardDescription>
          </CardHeader>

          <CardContent className="flex justify-end">
            <Button asChild variant="secondary">
              <Link href="/settings/notifications">
                Manage
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-destructive">
            <CardHeader>
                <CardTitle className="text-destructive">
                    Delete Account
                </CardTitle>

                <CardDescription>
                    Permanently deactivate your account.
                    This action cannot be undone.
                </CardDescription>
            </CardHeader>

            <CardContent className="flex justify-end">
                <DeleteAccountDialog />
            </CardContent>
        </Card>

      </div>
    </div>
  );
}