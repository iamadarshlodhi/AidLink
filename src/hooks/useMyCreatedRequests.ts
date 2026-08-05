"use client";

import { useQuery } from "@tanstack/react-query";

import { getMyCreatedRequests } from "@/lib/api/help-request";

export function useMyCreatedRequests() {
  return useQuery({
    queryKey: ["my-created-requests"],

    queryFn: getMyCreatedRequests,
  });
}