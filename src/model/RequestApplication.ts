import mongoose, { Schema, Model, Document } from 'mongoose';
export interface IRequestApplication extends Document {
    requestId: mongoose.Types.ObjectId;
    helper: mongoose.Types.ObjectId;
    message?: string;
    status:
        "pending" |
        "accepted" |
        "rejected" |
        "withdrawn" |
        "completed";
    
    appliedAt: Date;
    acceptedAt?: Date;
    completedAt?: Date;
    rejectedAt?: Date;
    withdrawnAt?: Date;
    withdrawReason?: string;
    helperConfirmed: boolean;
    requesterConfirmed: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const RequestApplicationSchema: Schema<IRequestApplication> = new Schema({
        requestId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "HelpRequest",
            required: true
        },
        helper:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        message:{
            type: String,
            trim: true,
            maxlength: 500,
            default: ""
        },
        status:{
            type: String,
            enum: ["pending", "accepted", "rejected", "withdrawn", "completed"],
            default: "pending"
        },
        appliedAt:{
            type: Date,
            default: Date.now
        },
        acceptedAt:{
            type: Date,
            default: null
        },
        completedAt:{
            type: Date,
            default: null
        },
        withdrawnAt:{
            type: Date,
            default: null
        },
        withdrawReason:{
            type: String,
            trim: true,
            maxlength: 500
        },
        rejectedAt:{
            type: Date,
            default: null
        },
        helperConfirmed: {
            type: Boolean,
            default: false,
        },
        requesterConfirmed: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
)

RequestApplicationSchema.index(
  {
    requestId: 1,
    helper: 1,
  },
  {
    unique: true,
  }
);

const RequestApplicationModel =
  (mongoose.models
    .RequestApplication as Model<IRequestApplication>) ||
  mongoose.model<IRequestApplication>(
    "RequestApplication",
    RequestApplicationSchema
  );

export default RequestApplicationModel;