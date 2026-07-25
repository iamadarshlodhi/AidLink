import mongoose, {
  Schema,
  Document,
  Types,
  Model,
} from "mongoose";

export type HelpRequestStatus =
  | "open"
  | "in-progress"
  | "completed"
  | "cancelled";

export interface IHelpRequest
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

  mode:
    | "online"
    | "offline";

  taskType:
    | "paid"
    | "volunteer";

  status: HelpRequestStatus;

  requester: Types.ObjectId;

  acceptedHelpers: Types.ObjectId[];

  helpersRequired: number;

  tentativePayment?: number;

  deadline: Date;

  location?: string;

  images: string[];

  adminNotes?: string;

  completedAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

const HelpRequestSchema =
  new Schema<IHelpRequest>(
    {
      title: {
        type: String,
        required: true,
        trim: true,
      },

      description: {
        type: String,
        required: true,
        trim: true,
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

      mode: {
        type: String,
        enum: [
          "online",
          "offline",
        ],
        required: true,
      },

      taskType: {
        type: String,
        enum: [
          "paid",
          "volunteer",
        ],
        required: true,
      },

      status: {
        type: String,
        enum: [
          "open",
          "in-progress",
          "completed",
          "cancelled",
        ],
        default: "open",
      },

      requester: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      acceptedHelpers: {
        type: [
          {
            type: Schema.Types.ObjectId,
            ref: "User",
          },
        ],
        default: [],
      },

      helpersRequired: {
        type: Number,
        required: true,
        min: 1,
        default: 1,
      },

      tentativePayment: {
        type: Number,
        min: 0,
      },

      deadline: {
        type: Date,
        required: true,
      },

      location: {
        type: String,
        default: "",
      },

      images: {
        type: [
          {
            type: String,
            trim: true,
          },
        ],
        default: [],
      },

      adminNotes: {
        type: String,
        default: "",
      },

      completedAt: {
        type: Date,
      },
    },
    {
      timestamps: true,
    }
  );

HelpRequestSchema.index({
  requester: 1,
});

HelpRequestSchema.index({
  status: 1,
});

HelpRequestSchema.index({
  category: 1,
});

HelpRequestSchema.index({
  urgency: 1,
});

HelpRequestSchema.index({
  deadline: 1,
});

// Search
HelpRequestSchema.index({
  title: "text",
  description: "text",
});

// Frequently used filters
HelpRequestSchema.index({
  mode: 1,
});

HelpRequestSchema.index({
  taskType: 1,
});

// Compound indexes
HelpRequestSchema.index({
  status: 1,
  category: 1,
});

HelpRequestSchema.index({
  status: 1,
  deadline: 1,
});

HelpRequestSchema.index({
  requester: 1,
  status: 1,
});

const HelpRequestModel =
  (mongoose.models
    .HelpRequest as Model<IHelpRequest>) ||
  mongoose.model<IHelpRequest>(
    "HelpRequest",
    HelpRequestSchema
  );

export default HelpRequestModel;