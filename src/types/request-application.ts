import { HelpRequester } from "./help-request";

export type ApplicationStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "withdrawn"
  | "completed";

export interface RequestApplication {
  _id: string;
  requestId: string;
  helper: HelpRequester;
  message?: string;
  status: ApplicationStatus;

  appliedAt: string;
  acceptedAt?: string;
  rejectedAt?: string;
  withdrawnAt?: string;
  completedAt?: string;

  withdrawReason?: string;

  helperConfirmed: boolean;
  requesterConfirmed: boolean;

  createdAt: string;
  updatedAt: string;
}

export interface RequestApplicationResponse {
  success: boolean;
  message: string;
  data: RequestApplication;
}

export interface RequestApplicationListResponse {
  success: boolean;
  message: string;
  count: number;
  data: RequestApplication[];
}

export interface AppliedRequest {
  _id: string;

  requestId: {
    _id: string;
    title: string;
    status: string;
    category: string;
    taskType: string;
    mode: string;
    deadline: string;

    requester: {
      _id: string;
      username: string;
      name: string;
      profilePicture?: string;
      averageRating: number;
    };

    helpersRequired: number;
    acceptedHelpers: string[];

    createdAt: string;
  };

  helper: string;

  message: string;

  status: ApplicationStatus;

  appliedAt: string;
  acceptedAt?: string;
  rejectedAt?: string;
  withdrawnAt?: string;
  completedAt?: string;

  withdrawReason?: string;

  helperConfirmed: boolean;
  requesterConfirmed: boolean;

  createdAt: string;
  updatedAt: string;
}

export interface MyAppliedRequestsResponse {
  success: boolean;
  message?: string;
  data: AppliedRequest[];
}