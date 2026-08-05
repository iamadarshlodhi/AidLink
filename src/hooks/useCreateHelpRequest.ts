"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createHelpRequest } from "@/lib/api/help-request";
import type { CreateHelpRequestData } from "@/types/help-request";

export function useCreateHelpRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateHelpRequestData) =>
      createHelpRequest(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["help-requests"],
      });

      queryClient.invalidateQueries({
        queryKey: ["my-created-requests"],
      });
    },
  });
}