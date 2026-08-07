"use client";

import ApplyDialog from "./ApplyDialog";

interface ApplyButtonProps {
  requestId: string;
}

export default function ApplyButton({
  requestId,
}: ApplyButtonProps) {
  return (
    <ApplyDialog requestId={requestId} />
  );
}