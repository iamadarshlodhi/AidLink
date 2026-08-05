import axios from "axios";

import type {
  CreateHelpRequestData,
  HelpRequest,
  HelpRequestFilters,
  HelpRequestListResponse,
  HelpRequestResponse,
} from "@/types/help-request";

const API = "/api/help-request";

export async function createHelpRequest(
  data: CreateHelpRequestData
): Promise<HelpRequest> {
  const response = await axios.post<HelpRequestResponse>(
    API,
    data
  );

  return response.data.data;
}

export async function getHelpRequests(
  filters: HelpRequestFilters = {}
): Promise<HelpRequestListResponse> {
  const response =
    await axios.get<HelpRequestListResponse>(
      API,
      {
        params: filters,
      }
    );

  return response.data;
}

export async function getHelpRequestById(
  requestId: string
): Promise<HelpRequest> {
  const response =
    await axios.get<HelpRequestResponse>(
      `${API}/${requestId}`
    );

  return response.data.data;
}

export async function getMyCreatedRequests() {
  const response = await axios.get(
    `${API}/my-created`
  );

  return response.data;
}

export async function getMyAppliedRequests() {
  const response = await axios.get(
    `${API}/my-applied`
  );

  return response.data;
}

export async function applyToRequest(
  requestId: string
) {
  const response = await axios.post(
    `${API}/${requestId}/apply`
  );

  return response.data;
}

export async function withdrawApplication(
  requestId: string
) {
  const response = await axios.delete(
    `${API}/${requestId}/withdraw`
  );

  return response.data;
}

export async function acceptHelper(
  requestId: string,
  applicationId: string
) {
  const response = await axios.patch(
    `${API}/${requestId}/accept`,
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
    `${API}/${requestId}/reject`,
    {
      applicationId,
    }
  );

  return response.data;
}

export async function completeRequest(
  requestId: string
) {
  const response = await axios.patch(
    `${API}/${requestId}/complete`
  );

  return response.data;
}