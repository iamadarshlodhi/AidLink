"use client";

import { Button } from "@/components/ui/button";

import { useAcceptHelper } from "@/hooks/useAcceptHelper";

interface AcceptButtonProps {
  requestId: string;
  applicationId: string;
}

export default function AcceptButton({
  requestId,
  applicationId,
}: AcceptButtonProps) {
  const { mutate, isPending } =
    useAcceptHelper();

  return (
    <Button
      disabled={isPending}
      onClick={() =>
        mutate({
          requestId,
          applicationId,
        })
      }
    >
      {isPending
        ? "Accepting..."
        : "Accept"}
    </Button>
  );
}