import mongoose, {
  Document,
  Schema,
} from "mongoose";

export interface IVerificationCode
  extends Document {
  email: string;
  code: string;
  expireAt: Date;
}

const VerificationCodeSchema =
  new Schema<IVerificationCode>(
    {
      email: {
        type: String,
        required: true,
        index: true,
      },

      code: {
        type: String,
        required: true,
      },

      expireAt: {
        type: Date,
        required: true,
        expires : 0, // This will automatically delete the document after the expireAt time has passed
      },
    },
    {
      timestamps: true,
    }
  );

export default mongoose.models
  .VerificationCode ||
  mongoose.model<IVerificationCode>(
    "VerificationCode",
    VerificationCodeSchema
  );