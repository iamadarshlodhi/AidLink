import mongoose, { Schema, Document } from "mongoose";

export interface IEmergencyContact {
  name: string;
  email: string;
  relationship: string;
}

export interface ILocation {
  state: string;
  city: string;
  area: string;
}

export interface IUser extends Document {
  username: string;
  name: string;
  email: string;
  phone: string;
  password: string;

  profilePicture?: string;
  bio?: string;

  skills: string[];

  location: ILocation;

  trustScore: number;
  averageRating: number;
  totalReviews: number;

  phoneVerified: boolean;

  dateofBirth?: Date;
  gender?: "male" | "female" | "other";
  notificationsEnabled?: boolean;

  verificationStatus:
    | "unverified"
    | "pending"
    | "verified";

  role: "user" | "admin";

  isActive: boolean;

  lastSeen?: Date;

  emergencyContacts: IEmergencyContact[];

  bookmarkedTasks: mongoose.Types.ObjectId[];

  blockedUsers: mongoose.Types.ObjectId[];

  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
      unique: true,
    },

    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please fill a valid email address"],
    },

    phone: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
      regex: [/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/, "Password must contain at least one letter and one number"],
    },

    profilePicture: {
      type: String,
      default: "",
    },

    bio: {
      type: String,
      default: "",
      maxlength: 500,
    },

    skills: {
      type: [
        {
          type: String,
          trim: true,
        },
      ],
      default: [],
    },

    location: {
      state: {
        type: String,
        default: "",
      },

      city: {
        type: String,
        default: "",
      },

      area: {
        type: String,
        default: "",
      },
    },

    trustScore: {
      type: Number,
      default: 50,
      min: 0,
      max: 100,
    },

    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    totalReviews: {
      type: Number,
      default: 0,
    },

    phoneVerified: {
      type: Boolean,
      default: false,
    },

    dateofBirth: {
      type: Date,
      default: null,
    },

    gender: {
      type: String,
      enum: ["male", "female", "other"],
      default: "other",
    },

    notificationsEnabled: {
      type: Boolean,
      default: true,
    },

    verificationStatus: {
      type: String,
      enum: ["unverified", "pending", "verified"],
      default: "unverified",
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    lastSeen: {
      type: Date,
      default: null,
    },

    emergencyContacts: [
      {
        name: {
          type: String,
          required: [true, "Name is required"],
          trim: true,
        },

        email: {
          type: String,
          required: [true, "Email is required"],
          lowercase: true,
          trim: true,
          match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please fill a valid email address"],
        },

        relationship: {
          type: String,
          required: [true, "Relationship is required"],
        },
      },
    ],

    bookmarkedTasks: [
      {
        type: Schema.Types.ObjectId,
        ref: "Task",
      },
    ],

    blockedUsers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const UserModel = (mongoose.models.User as mongoose.Model<IUser>) 
    || mongoose.model<IUser>("User", UserSchema);

export default UserModel;