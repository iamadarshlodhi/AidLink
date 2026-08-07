"use client";

import { useQuery } from "@tanstack/react-query";
import { getApplications } from "@/lib/api/request-application";

export function useApplications(
  requestId: string
) {
  return useQuery({
    queryKey: [
      "applications",
      requestId,
    ],

    queryFn: () =>
      getApplications(requestId),

    enabled: !!requestId,
  });
}