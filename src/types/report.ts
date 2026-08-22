export type ReportTargetType =
  | "user"
  | "helpRequest";

export type ReportReason =
  | "spam"
  | "fake_request"
  | "harassment"
  | "fraud"
  | "inappropriate"
  | "other";

export type ReportStatus =
  | "pending"
  | "reviewed"
  | "resolved"
  | "dismissed";

export interface Report {
  _id: string;

  reporter: string;

  targetType: ReportTargetType;

  targetId: string;

  reason: ReportReason;

  description: string;

  status: ReportStatus;

  reviewedBy?: {
    _id: string;
    name: string;
    username: string;
    profilePicture?: string;
  } | null;

  reviewedAt?: string;

  createdAt: string;

  updatedAt: string;
}