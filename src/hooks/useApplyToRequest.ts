"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { applyToRequest } from "@/lib/api/help-request";

export function useApplyToRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      requestId,
      interestNote,
    }: {
      requestId: string;
      interestNote: string;
    }) =>
      applyToRequest(
        requestId,
        interestNote
      ),

    onSuccess: (_, variables) => {
      toast.success(
        "Application submitted successfully."
      );

      queryClient.invalidateQueries({
        queryKey: [
          "help-request",
          variables.requestId,
        ],
      });

      queryClient.invalidateQueries({
        queryKey: [
          "my-applied-requests",
        ],
      });
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ??
          "Failed to submit application."
      );
    },
  });
}