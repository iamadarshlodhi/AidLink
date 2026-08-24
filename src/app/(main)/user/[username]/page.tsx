"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import axios from "axios";
import PublicReviews from "./components/PublicReviews";

interface UserProfile {
  username: string;
  name: string;
  profilePicture?: string;
  bio?: string;
  skills: string[];
  location: {
    city: string;
    state: string;
  };
  averageRating: number;
  totalReviews: number;
  trustScore: number;
  verificationStatus: boolean;
  joinedAt: string;
}

export default function PublicProfilePage() {
  const params = useParams();
  const username = params.username as string;

  const [user, setUser] =
    useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `/api/user/${username}`
        );

        setUser(response.data.data);
      } catch (error: any) {
        console.error(
          "Failed to load profile:",
          error
        );

        setError(
          error?.response?.data?.message ||
            "Failed to load profile."
        );
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchProfile();
    }
  }, [username]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        Loading profile...
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-red-500">
          {error || "User not found."}
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      {/* Header */}
      <div className="rounded-lg border bg-card p-6">
        <div className="flex items-center gap-4">
          <Image
            src={
              user.profilePicture ||
              "/default-avatar.png"
            }
            alt={user.name}
            width={80}
            height={80}
            className="h-20 w-20 rounded-full object-cover"
          />

          <div>
            <h1 className="text-2xl font-semibold">
              {user.name}
            </h1>

            <p className="text-muted-foreground">
              @{user.username}
            </p>

            {user.verificationStatus && (
              <span className="mt-2 inline-block text-sm text-green-600">
                ✓ Verified
              </span>
            )}
          </div>
        </div>

        {user.bio && (
          <p className="mt-5 text-sm text-muted-foreground">
            {user.bio}
          </p>
        )}
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border p-4 text-center">
          <p className="text-2xl font-semibold">
            {user.averageRating.toFixed(1)}
          </p>
          <p className="text-sm text-muted-foreground">
            Rating ({user.totalReviews})
          </p>
        </div>

        <div className="rounded-lg border p-4 text-center">
          <p className="text-2xl font-semibold">
            {user.trustScore}
          </p>
          <p className="text-sm text-muted-foreground">
            Trust Score
          </p>
        </div>

        <div className="rounded-lg border p-4 text-center">
          <p className="text-2xl font-semibold">
            {new Date(
              user.joinedAt
            ).toLocaleDateString()}
          </p>
          <p className="text-sm text-muted-foreground">
            Joined
          </p>
        </div>
      </div>

      {/* Skills */}
      {user.skills?.length > 0 && (
        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-3 font-semibold">
            Skills
          </h2>

          <div className="flex flex-wrap gap-2">
            {user.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-muted px-3 py-1 text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Location */}
      {(user.location.city ||
        user.location.state) && (
        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-2 font-semibold">
            Location
          </h2>

          <p className="text-sm text-muted-foreground">
            {[user.location.city, user.location.state]
              .filter(Boolean)
              .join(", ")}
          </p>
        </div>
      )}
      <PublicReviews username={user.username} />
    </div>
  );
}