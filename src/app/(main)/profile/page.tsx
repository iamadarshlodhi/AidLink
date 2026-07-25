"use client";

import ProfileHeader from "./components/ProfileHeader";
import ProfileInfo from "./components/ProfileInfo";
import ProfileStats from "./components/ProfileStats";
import { useProfile } from "@/hooks/useProfile";
import VerificationCard from "./components/VerificationCard";
import BioCard from "./components/BioCard";
import SkillsCard from "./components/SkillsCard";
import LocationCard from "./components/LocationCard";

export default function ProfilePage() {
  const { data: user, isLoading, isError } = useProfile();

  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        Loading...
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        Failed to load profile.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ProfileHeader user={user} />

      <ProfileStats
        stats={{
          requestsCreated: user.requestsCreated ?? 0,
          helpProvided: user.helpProvided ?? 0,
          completedRequests: user.completedRequests ?? 0,
          trustScore: user.trustScore ?? 0,
        }}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <ProfileInfo user={user} />

        <VerificationCard user={user} />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <BioCard bio={user.bio} />

        <SkillsCard skills={user.skills} />
      </div>
      <LocationCard location={user.location} />
    </div>
  );
}