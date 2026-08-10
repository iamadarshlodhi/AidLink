"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface ReviewStatusResponse {
  success: boolean;
  data: {
    hasReviewed: boolean;
    review: {
      rating: number;
      comment?: string;
    } | null;
  };
}

export function useReviewStatus(
  requestId: string,
  applicationId: string
) {
  return useQuery<ReviewStatusResponse>({
    queryKey: [
      "review-status",
      requestId,
      applicationId,
    ],

    queryFn: async () => {
      const response = await axios.get(
        `/api/help-request/${requestId}/review/${applicationId}`
      );

      return response.data;
    },

    enabled:
      Boolean(requestId) &&
      Boolean(applicationId),
  });
}