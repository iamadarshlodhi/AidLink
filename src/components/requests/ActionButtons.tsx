"use client";

import ApplyButton from "./ApplyButton";
import { Button } from "@/components/ui/button";

interface ActionButtonsProps {
  requestId: string;
  isOwner?: boolean;
  hasApplied?: boolean;
}

export default function ActionButtons({
  requestId,
  isOwner = false,
  hasApplied = false,
}: ActionButtonsProps) {
  if (isOwner) {
    return (
      <div className="flex gap-3">
        <Button variant="outline">
          Edit
        </Button>

        <Button variant="destructive">
          Delete
        </Button>
      </div>
    );
  }

  if (hasApplied) {
    return (
      <Button disabled>
        Already Applied
      </Button>
    );
  }

  return (
    <ApplyButton requestId={requestId} />
  );
}