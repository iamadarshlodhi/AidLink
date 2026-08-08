"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { toast } from "sonner";

import { withdrawApplication } from "@/lib/api/request-application";

export function useWithdrawApplication() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      requestId,
      reason,
    }: {
      requestId: string;
      reason?: string;
    }) =>
      withdrawApplication(
        requestId,
        reason
      ),

    onSuccess: (_, variables) => {
      toast.success(
        "Application withdrawn successfully."
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

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ??
          "Failed to withdraw application."
      );
    },
  });
}