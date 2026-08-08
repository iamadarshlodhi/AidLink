"use client";

import { Camera } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface ProfilePictureUploadProps {
  image?: string;
  name: string;
  onImageSelect: (file: File) => void;
}

export default function ProfilePictureUpload({
  image,
  name,
  onImageSelect,
}: ProfilePictureUploadProps) {
  const initials =
    name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <Avatar className="h-32 w-32">
          <AvatarImage
            src={image || ""}
            alt={name}
          />

          <AvatarFallback className="text-3xl">
            {initials}
          </AvatarFallback>
        </Avatar>

        <label htmlFor="profile-picture">
          <Button
            size="icon"
            type="button"
            asChild
            className="absolute bottom-0 right-0 cursor-pointer rounded-full"
          >
            <span>
              <Camera className="h-4 w-4" />
            </span>
          </Button>
        </label>

        <input
          id="profile-picture"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];

            if (file) {
              onImageSelect(file);
            }
          }}
        />
      </div>

      <p className="text-sm text-muted-foreground">
        JPG, PNG or WEBP (Max 5 MB)
      </p>
    </div>
  );
}
