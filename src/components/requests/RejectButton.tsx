"use client";

import { Button } from "@/components/ui/button";

import { useRejectHelper } from "@/hooks/useRejectHelper";

interface RejectButtonProps {
  requestId: string;
  applicationId: string;
}

export default function RejectButton({
  requestId,
  applicationId,
}: RejectButtonProps) {
  const { mutate, isPending } =
    useRejectHelper();

  return (
    <Button
      variant="destructive"
      disabled={isPending}
      onClick={() =>
        mutate({
          requestId,
          applicationId,
        })
      }
    >
      {isPending
        ? "Rejecting..."
        : "Reject"}
    </Button>
  );
}