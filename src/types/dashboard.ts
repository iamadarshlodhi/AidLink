export interface BaseRequest {
  _id: string;
  title: string;
  category: string;
  applicationCount: number;
  location?: string;
  createdAt: string;
}

export interface MyRequest extends BaseRequest {
  status: string;
  acceptedHelpersCount: number;
}

export interface AvailableRequest extends BaseRequest {
  urgency: string;
  requester: {
    _id: string;
    name: string;
    username: string;
    profilePicture?: string;
  };
}

export interface DashboardStats {
  activeRequests: number;
  myApplications: number;
  unreadNotifications: number;
  completedTasks: number;
  averageRating: number;
  totalReviews: number;
}

export interface Activity {
  _id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface DashboardResponse {
  stats: DashboardStats;
  myRequests: MyRequest[];
  availableRequests: AvailableRequest[];
  recentActivity: Activity[];
}