"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { acceptHelper } from "@/lib/api/help-request";

export function useAcceptHelper() {
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
      acceptHelper(
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