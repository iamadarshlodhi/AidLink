import mongoose, {
  Document,
  Model,
  Schema,
} from "mongoose";

export interface IReview extends Document {
  requestId: mongoose.Types.ObjectId;

  applicationId: mongoose.Types.ObjectId;

  reviewer: mongoose.Types.ObjectId;

  reviewee: mongoose.Types.ObjectId;

  reviewerRole: "requester" | "helper";

  rating: number;

  comment?: string;

  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    requestId: {
      type: Schema.Types.ObjectId,
      ref: "HelpRequest",
      required: true,
    },

    applicationId: {
      type: Schema.Types.ObjectId,
      ref: "RequestApplication",
      required: true,
    },

    reviewer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    reviewee: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    reviewerRole: {
      type: String,
      enum: ["requester", "helper"],
      required: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    comment: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// One user can review a particular application only once.
ReviewSchema.index(
  {
    applicationId: 1,
    reviewer: 1,
  },
  {
    unique: true,
  }
);

// Helpful indexes
ReviewSchema.index({
  reviewee: 1,
});

ReviewSchema.index({
  reviewer: 1,
});

const ReviewModel =
  (mongoose.models.Review as Model<IReview>) ||
  mongoose.model<IReview>(
    "Review",
    ReviewSchema
  );

export default ReviewModel;