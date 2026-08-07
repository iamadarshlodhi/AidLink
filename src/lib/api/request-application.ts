import axios from "axios";

import type {
  RequestApplicationListResponse,
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