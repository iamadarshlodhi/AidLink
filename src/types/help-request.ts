export type HelpRequestCategory =
  | "medical"
  | "food"
  | "education"
  | "transport"
  | "shelter"
  | "other";

export type HelpRequestUrgency =
  | "low"
  | "medium"
  | "high"
  | "critical";

export type HelpRequestMode =
  | "online"
  | "offline";

export type HelpRequestTaskType =
  | "paid"
  | "volunteer";

export type HelpRequestStatus =
  | "open"
  | "in-progress"
  | "completed"
  | "cancelled";

export type HelpRequestSort =
  | "newest"
  | "oldest"
  | "deadline";

export interface HelpRequester {
  _id: string;
  name: string;
  username: string;
  profileImage?: string;
  averageRating?: number;
  trustScore?: number;
  verificationStatus?: string;
}

export interface HelpRequest {
  _id: string;
  title: string;
  description: string;
  category: HelpRequestCategory;
  urgency: HelpRequestUrgency;
  mode: HelpRequestMode;
  taskType: HelpRequestTaskType;
  status: HelpRequestStatus;
  requester: HelpRequester | string;
  acceptedHelpers: string[];
  helpersRequired: number;
  tentativePayment?: number;
  deadline: string;
  location?: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateHelpRequestData {
  title: string;
  description: string;
  category: HelpRequestCategory;
  urgency: HelpRequestUrgency;
  mode: HelpRequestMode;
  taskType: HelpRequestTaskType;
  helpersRequired: number;
  tentativePayment?: number;
  deadline: Date | string;
  location?: string;
  images: string[];
}

export interface HelpRequestFilters {
  page?: number;
  limit?: number;
  q?: string;
  category?: HelpRequestCategory;
  mode?: HelpRequestMode;
  taskType?: HelpRequestTaskType;
  urgency?: HelpRequestUrgency;
  status?: HelpRequestStatus;
  sort?: HelpRequestSort;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface HelpRequestListResponse {
  success: boolean;
  message: string;
  count: number;
  data: HelpRequest[];
  pagination: Pagination;
}

export interface HelpRequestResponse {
  success: boolean;
  message: string;
  data: HelpRequest;
}