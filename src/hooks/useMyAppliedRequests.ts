"use client";

import { useQuery } from "@tanstack/react-query";

import { getMyAppliedRequests } from "@/lib/api/request-application";

export function useMyAppliedRequests() {
  return useQuery({
    queryKey: ["my-applied-requests"],
    queryFn: getMyAppliedRequests,
  });
}