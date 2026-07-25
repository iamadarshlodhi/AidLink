import mongoose from "mongoose";

import NotificationModel from "@/model/Notification";

export async function getRecentActivity(
  userId: string
) {
  const objectId = new mongoose.Types.ObjectId(userId);

  const activities = await NotificationModel.find({
    recipient: objectId,
  })
    .populate(
      "sender",
      "name username profilePicture"
    )
    .populate(
      "request",
      "title category status"
    )
    .sort({
      createdAt: -1,
    })
    .limit(5)
    .lean();

  return activities;
}