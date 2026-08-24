import mongoose, {
  Document,
  Model,
  Schema,
} from "mongoose";

import "@/model/Message";

export interface IConversation extends Document {
  requestId: mongoose.Types.ObjectId;
  applicationId: mongoose.Types.ObjectId;
  requester: mongoose.Types.ObjectId;
  helper: mongoose.Types.ObjectId;
  lastMessage?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ConversationSchema =
  new Schema<IConversation>(
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

      requester: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      helper: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      lastMessage: {
        type: Schema.Types.ObjectId,
        ref: "Message",
        default: null,
      },
    },
    {
      timestamps: true,
    }
  );

/*
 * One conversation per application
 */
ConversationSchema.index(
  {
    applicationId: 1,
  },
  {
    unique: true,
  }
);

ConversationSchema.index({
  requester: 1,
});

ConversationSchema.index({
  helper: 1,
});

const ConversationModel =
  (mongoose.models.Conversation as Model<IConversation>) ||
  mongoose.model<IConversation>(
    "Conversation",
    ConversationSchema
  );

export default ConversationModel;