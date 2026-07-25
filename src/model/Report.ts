import mongoose, { Document, Schema } from "mongoose";

export interface IReport extends Document {
  reporter: mongoose.Types.ObjectId;

  targetType: "user" | "helpRequest";

  targetId: mongoose.Types.ObjectId;

  reason:
    | "spam"
    | "fake_request"
    | "harassment"
    | "fraud"
    | "inappropriate"
    | "other";

  description: string;

  status:
    | "pending"
    | "reviewed"
    | "resolved"
    | "dismissed";

  reviewedBy?: mongoose.Types.ObjectId;

  reviewedAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

const ReportSchema = new Schema<IReport>(
  {
    reporter: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    targetType: {
      type: String,
      enum: ["user", "helpRequest"],
      required: true,
    },

    targetId: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: "targetType",
    },

    reason: {
      type: String,
      enum: [
        "spam",
        "fake_request",
        "harassment",
        "fraud",
        "inappropriate",
        "other",
      ],
      required: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "reviewed",
        "resolved",
        "dismissed",
      ],
      default: "pending",
      index: true,
    },

    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    reviewedAt: Date,
  },
  {
    timestamps: true,
  }
);

ReportSchema.index({
  reporter: 1,
  targetType: 1,
  targetId: 1,
});

const ReportModel =
  mongoose.models.Report ||
  mongoose.model<IReport>("Report", ReportSchema);

export default ReportModel;