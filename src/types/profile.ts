export interface EmergencyContact {
  name: string;
  email: string;
  relationship: string;
}

export interface UserLocation {
  state: string;
  city: string;
  area: string;
}

export interface ProfileUser {
  _id: string;

  name: string;
  username: string;
  email: string;
  phone: string;

  profilePicture?: string;
  bio?: string;

  skills: string[];

  location: UserLocation;

  trustScore: number;
  averageRating: number;
  totalReviews: number;

  phoneVerified: boolean;

  dateofBirth?: string | Date;

  gender?: "male" | "female" | "other";

  notificationsEnabled: boolean;

  verificationStatus:
    | "unverified"
    | "pending"
    | "verified";

  role: "user" | "admin";

  isActive: boolean;

  emergencyContacts: EmergencyContact[];

  bookmarkedTasks: string[];

  blockedUsers: string[];

  isDeleted: boolean;

  deletedAt?: string | Date;

  lastSeen?: string | Date;

  createdAt: string | Date;

  updatedAt: string | Date;

  requestsCreated?: number;
  helpProvided?: number;
  completedRequests?: number;
}

export interface ProfileStats {
  requestsCreated: number;
  helpProvided: number;
  completedRequests: number;
  trustScore: number;
}

export interface ProfileResponse {
  success: boolean;
  message: string;
  data: ProfileUser;
}