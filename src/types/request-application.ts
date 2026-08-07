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