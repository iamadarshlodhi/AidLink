import mongoose, { Schema, Document } from "mongoose";

export interface INotification extends Document {
  recipient: mongoose.Types.ObjectId;
  sender?: mongoose.Types.ObjectId;

  type:
    | "application"
    | "accepted"
    | "rejected"
    | "withdrawn"
    | "completed"
    | "review"
    | "system";

  title: string;
  message: string;

  request?: mongoose.Types.ObjectId;

  isRead: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    recipient: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    type: {
      type: String,
      enum: [
        "application",
        "accepted",
        "rejected",
        "withdrawn",
        "completed",
        "review",
        "system",
      ],
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    request: {
      type: Schema.Types.ObjectId,
      ref: "HelpRequest",
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

NotificationSchema.index({
  recipient: 1,
  isRead: 1,
  createdAt: -1,
});

const NotificationModel =
  mongoose.models.Notification ||
  mongoose.model<INotification>(
    "Notification",
    NotificationSchema
  );

export default NotificationModel;