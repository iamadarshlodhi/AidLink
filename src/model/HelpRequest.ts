import mongoose, {
  Schema,
  Document,
  Types,
} from "mongoose";

export type HelpRequestStatus =
  | "pending"
  | "accepted"
  | "in-progress"
  | "completed"
  | "cancelled";

export interface HelpRequest
  extends Document {
  title: string;
  description: string;

  category:
    | "medical"
    | "food"
    | "education"
    | "transport"
    | "shelter"
    | "other";

  urgency:
    | "low"
    | "medium"
    | "high"
    | "critical";

  status: HelpRequestStatus;

  location: string;

  requester: Types.ObjectId;

  assignedTo?: Types.ObjectId;

  contactPhone?: string;

  images?: string[];

  adminNotes?: string;

  completedAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

const HelpRequestSchema =
  new Schema<HelpRequest>(
    {
      title: {
        type: String,
        required: true,
        trim: true,
      },

      description: {
        type: String,
        required: true,
      },

      category: {
        type: String,
        enum: [
          "medical",
          "food",
          "education",
          "transport",
          "shelter",
          "other",
        ],
        required: true,
      },

      urgency: {
        type: String,
        enum: [
          "low",
          "medium",
          "high",
          "critical",
        ],
        default: "medium",
      },

      status: {
        type: String,
        enum: [
          "pending",
          "accepted",
          "in-progress",
          "completed",
          "cancelled",
        ],
        default: "pending",
      },

      location: {
        type: String,
        required: true,
      },

      requester: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      assignedTo: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },

      contactPhone: {
        type: String,
      },

      images: [
        {
          type: String,
        },
      ],

      adminNotes: {
        type: String,
      },

      completedAt: {
        type: Date,
      },
    },
    {
      timestamps: true,
    }
  );

const HelpRequestModel =
  (mongoose.models
    .HelpRequest as mongoose.Model<HelpRequest>) ||
  mongoose.model<HelpRequest>(
    "HelpRequest",
    HelpRequestSchema
  );

export default HelpRequestModel;