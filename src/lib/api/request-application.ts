import axios from "axios";

import type {
  RequestApplicationListResponse,
  MyAppliedRequestsResponse,
} from "@/types/request-application";

export async function getApplications(
  requestId: string
): Promise<RequestApplicationListResponse> {
  const response =
    await axios.get<RequestApplicationListResponse>(
      `/api/help-request/${requestId}/applications`
    );

  return response.data;
}

export async function acceptHelper(
  requestId: string,
  applicationId: string
) {
  const response = await axios.patch(
    `/api/help-request/${requestId}/accept`,
    {
      applicationId,
    }
  );

  return response.data;
}

export async function rejectHelper(
  requestId: string,
  applicationId: string
) {
  const response = await axios.patch(
    `/api/help-request/${requestId}/reject`,
    {
      applicationId,
    }
  );

  return response.data;
}

export async function withdrawApplication(
  requestId: string,
  reason?: string
) {
  const response = await axios.patch(
    `/api/help-request/${requestId}/withdraw`,
    {
      reason,
    }
  );

  return response.data;
}

export async function getMyAppliedRequests(): Promise<MyAppliedRequestsResponse> {
  const response =
    await axios.get<MyAppliedRequestsResponse>(
      "/api/help-request/my-applied"
    );

  return response.data;
}