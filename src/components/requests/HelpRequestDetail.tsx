"use client";

import { useHelpRequest } from "@/hooks/useHelpRequest";

import RequestImageGallery from "./RequestImageGallery";
import RequestInfo from "./RequestInfo";
import RequesterCard from "./RequesterCard";
import ActionButtons from "./ActionButtons";
import { HelpRequester } from "@/types/help-request";

interface HelpRequestDetailProps {
  requestId: string;
}

export default function HelpRequestDetail({
  requestId,
}: HelpRequestDetailProps) {
  const {
    data: request,
    isLoading,
    isError,
    error,
  } = useHelpRequest(requestId);

  if (isLoading) {
    return (
      <div className="text-center py-10">
        Loading request...
      </div>
    );
  }

  if (isError || !request) {
    return (
      <div className="text-center py-10 text-red-500">
        {(error as any)?.response?.data?.message ??
          "Failed to load request."}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
        <RequestImageGallery images={request.images} />

        <RequestInfo request={request} />

        <RequesterCard 
            requester={request.requester as HelpRequester} 
        />

        <ActionButtons 
          requestId={request._id} 
          isOwner={request.isOwner}
          hasApplied={request.hasApplied}
        />
    </div>
  );
}