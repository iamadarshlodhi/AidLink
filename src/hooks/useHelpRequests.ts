"use client";

import { useQuery } from "@tanstack/react-query";

import { getHelpRequests } from "@/lib/api/help-request";
import type { HelpRequestFilters } from "@/types/help-request";

export function useHelpRequests(
  filters: HelpRequestFilters = {}
) {
  return useQuery({
    queryKey: ["help-requests", filters],

    queryFn: () => getHelpRequests(filters),

    placeholderData: (previousData) => previousData,
  });
}