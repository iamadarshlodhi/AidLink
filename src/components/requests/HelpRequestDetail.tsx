"use client";

import { useHelpRequest } from "@/hooks/useHelpRequest";

import RequestImageGallery from "./RequestImageGallery";
import RequestInfo from "./RequestInfo";
import RequesterCard from "./RequesterCard";
import ActionButtons from "./ActionButtons";

import ReportDialog from "../reports/ReportDialog";

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
      <div className="flex justify-center py-10">
        Loading request...
      </div>
    );
  }

  if (isError || !request) {
    return (
      <div className="flex justify-center py-10 text-sm text-red-500">
        {(error as any)?.response?.data?.message ??
          "Failed to load request."}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Images */}
      <RequestImageGallery
        images={request.images}
      />

      {/* Request information */}
      <RequestInfo request={request} />

      {/* Requester */}
      <RequesterCard
        requester={
          request.requester as HelpRequester
        }
      />

      {/* Actions */}
      <ActionButtons
        requestId={request._id}
        isOwner={request.isOwner}
        isAdmin={request.isAdmin}
        isAcceptedHelper={request.isAcceptedHelper}
        hasApplied={request.hasApplied}
        status={request.status}
      />

      {/* Report */}
      {!request.isOwner && (
        <div className="flex justify-end">
          <ReportDialog
            targetType="helpRequest"
            targetId={request._id}
          />
        </div>
      )}
    </div>
  );
}