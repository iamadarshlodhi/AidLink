"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/sign-in");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">

        <div className="flex justify-between items-center mb-8">

            <h1 className="text-3xl font-bold">
              Dashboard
            </h1>

          <div className="flex gap-4 items-center">
            <ThemeToggle />

            <Button
              variant="outline"
              onClick={() =>
                signOut({
                  redirectTo: "/sign-in",
                })
              }
            >
              Sign Out
            </Button>
          </div>
        </div>

        <div className="bg-card border rounded-lg p-6 space-y-4">
          <div>
            <h2 className="text-lg font-semibold mb-2">
              Welcome, {session.user?.username}
            </h2>

            <p className="text-muted-foreground">
              You are successfully logged in to AidLink!
            </p>
          </div>

          <div className="space-y-2 mt-4">
            <p>
              <strong>Email:</strong>{" "}
              {session.user?.email}
            </p>

            <p>
              <strong>Username:</strong>{" "}
              {session.user?.username}
            </p>

            <p>
              <strong>Role:</strong>{" "}
              {session.user?.role}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}