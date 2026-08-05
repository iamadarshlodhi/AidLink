"use client";

import { useQuery } from "@tanstack/react-query";

import { getHelpRequestById } from "@/lib/api/help-request";

export function useHelpRequest(requestId: string) {
  return useQuery({
    queryKey: ["help-request", requestId],

    queryFn: () => getHelpRequestById(requestId),

    enabled: !!requestId,
  });
}