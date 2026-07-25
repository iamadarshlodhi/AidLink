export interface ProfileUser {
  _id: string;

  name: string;
  username: string;
  email: string;
  phone: string;

  profilePicture?: string;
  bio?: string;

  skills: string[];

  location: {
    state: string;
    city: string;
    area: string;
  };

  trustScore: number;
  averageRating: number;
  totalReviews: number;

  phoneVerified: boolean;

  dateofBirth?: string;

  gender?: "male" | "female" | "other";

  notificationsEnabled: boolean;

  verificationStatus:
    | "unverified"
    | "pending"
    | "verified";

  role: "user" | "admin";

  isActive: boolean;

  createdAt: string;
  updatedAt: string;
}

export interface ProfileStats {
  requestsCreated: number;
  helpProvided: number;
  completedRequests: number;
  trustScore: number;
}