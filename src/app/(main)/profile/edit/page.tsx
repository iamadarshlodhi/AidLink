"use client";

import { toast } from "sonner";
import { useRouter } from "next/navigation";

import ProfileForm from "./components/ProfileForm";
import { useProfile } from "@/hooks/useProfile";
import { useUpdateProfile } from "@/hooks/useUpdateProfile";

export default function EditProfilePage() {
  const router = useRouter();

  const { data: user, isLoading } = useProfile();

  const updateProfile = useUpdateProfile();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>User not found.</div>;
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-8">
        <ProfileForm
            user={user}
            onSubmit={async (values, image) => {
                try {
                    await updateProfile.mutateAsync({
                        values,
                        image,
                    });

                    toast.success("Profile updated successfully.");

                    router.push("/profile");
                } catch (error: any) {
                    toast.error(
                        error?.response?.data?.message ??
                        "Something went wrong."
                    );
                }
            }}
        />
    </div>
  );
}