"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { withdrawApplication } from "@/lib/api/help-request";

export function useWithdrawApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (requestId: string) =>
      withdrawApplication(requestId),

    onSuccess: (_, requestId) => {
      toast.success("Application withdrawn successfully.");

      queryClient.invalidateQueries({
        queryKey: ["help-request", requestId],
      });

      queryClient.invalidateQueries({
        queryKey: ["applications", requestId],
      });

      queryClient.invalidateQueries({
        queryKey: ["my-applied-requests"],
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