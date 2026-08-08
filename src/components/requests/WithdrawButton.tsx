"use client";

import { Button } from "@/components/ui/button";

import { useWithdrawApplication } from "@/hooks/useWithdrawApplication";

interface WithdrawButtonProps {
  requestId: string;
}

export default function WithdrawButton({
  requestId,
}: WithdrawButtonProps) {
  const {
    mutate,
    isPending,
  } = useWithdrawApplication();

  const handleWithdraw = () => {
    const reason = window.prompt(
      "Why do you want to withdraw? (Optional)"
    );

    if (reason === null) {
      return;
    }

    mutate({
      requestId,
      reason: reason.trim() || undefined,
    });
  };

  return (
    <Button
      variant="destructive"
      disabled={isPending}
      onClick={handleWithdraw}
    >
      {isPending
        ? "Withdrawing..."
        : "Withdraw Application"}
    </Button>
  );
}