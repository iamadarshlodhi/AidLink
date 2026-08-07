"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { rejectHelper } from "@/lib/api/help-request";

export function useRejectHelper() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      requestId,
      applicationId,
    }: {
      requestId: string;
      applicationId: string;
    }) =>
      rejectHelper(
        requestId,
        applicationId
      ),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [
          "applications",
          variables.requestId,
        ],
      });

      queryClient.invalidateQueries({
        queryKey: [
          "help-request",
          variables.requestId,
        ],
      });
    },
  });
}