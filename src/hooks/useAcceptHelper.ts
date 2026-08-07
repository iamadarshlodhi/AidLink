"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { acceptHelper } from "@/lib/api/request-application";

export function useAcceptHelper() {
  const queryClient = useQueryClient();

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

    onSuccess(_, variables) {
      toast.success(
        "Application accepted."
      );

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

    onError(error: any) {
      toast.error(
        error?.response?.data?.message ??
          "Failed to accept application."
      );
    },
  });
}