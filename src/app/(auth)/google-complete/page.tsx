"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default function GoogleCompletePage() {
  const {
    data: session,
    status,
  } = useSession();

  const router = useRouter();

  useEffect(() => {
    if (
      status === "authenticated" &&
      !session?.user?.googleOnboarding
    ) {
      router.replace("/dashboard");
    }
  }, [router, session, status]);

  const [username, setUsername] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setError("");

    if (!username.trim()) {
      setError(
        "Username is required."
      );
      return;
    }

    if (!phone.trim()) {
      setError(
        "Phone number is required."
      );
      return;
    }

    try {
      setLoading(true);

      // Complete Google signup
      await axios.post(
        "/api/auth/google-complete",
        {
          username:
            username.trim(),
          phone: phone.trim(),
        }
      );

      // Remove temporary Google session
      await signOut({
        redirect: false,
      });

      // Login again with Google.
      // This time the user already exists
      // in MongoDB, so auth.ts will load
      // the complete user information.
      await signIn("google", {
        redirectTo: "/",
      });
    } catch (error: any) {
      setError(
        error?.response?.data?.message ??
          "Unable to complete signup."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>
            Complete your profile
          </CardTitle>

          <CardDescription>
            Just a few more details are
            required to create your AidLink
            account.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            {/* Google account information */}

            <div className="rounded-lg border p-4">
              <p className="font-medium">
                {session?.user?.name}
              </p>

              <p className="text-sm text-muted-foreground">
                {session?.user?.email}
              </p>
            </div>

            {/* Username */}

            <div className="space-y-2">
              <label
                htmlFor="username"
                className="text-sm font-medium"
              >
                Username
              </label>

              <Input
                id="username"
                value={username}
                onChange={(e) =>
                  setUsername(
                    e.target.value
                  )
                }
                placeholder="Enter username"
                disabled={loading}
              />
            </div>

            {/* Phone */}

            <div className="space-y-2">
              <label
                htmlFor="phone"
                className="text-sm font-medium"
              >
                Phone Number
              </label>

              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) =>
                  setPhone(
                    e.target.value
                  )
                }
                placeholder="Enter phone number"
                disabled={loading}
              />
            </div>

            {/* Error */}

            {error && (
              <p className="text-sm text-red-500">
                {error}
              </p>
            )}

            {/* Submit */}

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading
                ? "Creating account..."
                : "Complete Signup"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}