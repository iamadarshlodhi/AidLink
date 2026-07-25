import mongoose from "mongoose";

import HelpRequestModel from "@/model/HelpRequest";
import NotificationModel from "@/model/Notification";
import RequestApplicationModel from "@/model/RequestApplication";
import ReviewModel from "@/model/Review";

export async function getDashboardStats(
  userId: string
) {
  const objectId = new mongoose.Types.ObjectId(userId);

  const [
    activeRequests,
    myApplications,
    unreadNotifications,
    completedAsHelper,
    completedAsRequester,
    ratingResult,
  ] = await Promise.all([
    // Active requests created by the user
    HelpRequestModel.countDocuments({
      requester: objectId,
      status: {
        $in: ["open", "in-progress"],
      },
    }),

    // Applications submitted by the user
    RequestApplicationModel.countDocuments({
      helper: objectId,
      status: {
        $in: ["pending", "accepted"],
      },
    }),

    // Unread notifications
    NotificationModel.countDocuments({
      recipient: objectId,
      isRead: false,
    }),

    // Tasks completed as helper
    RequestApplicationModel.countDocuments({
      helper: objectId,
      status: "completed",
    }),

    // Tasks completed as requester
    RequestApplicationModel.aggregate([
      {
        $lookup: {
          from: "helprequests",
          localField: "requestId",
          foreignField: "_id",
          as: "request",
        },
      },
      {
        $unwind: "$request",
      },
      {
        $match: {
          status: "completed",
          "request.requester": objectId,
        },
      },
      {
        $count: "count",
      },
    ]),

    // Average rating received
    ReviewModel.aggregate([
      {
        $match: {
          reviewee: objectId,
        },
      },
      {
        $group: {
          _id: null,
          averageRating: {
            $avg: "$rating",
          },
          totalReviews: {
            $sum: 1,
          },
        },
      },
    ]),
  ]);

  const completedRequesterCount =
    completedAsRequester.length > 0
      ? completedAsRequester[0].count
      : 0;

  const completedTasks =
    completedAsHelper + completedRequesterCount;

  const averageRating =
    ratingResult.length > 0
      ? Number(
          ratingResult[0].averageRating.toFixed(1)
        )
      : 0;

  const totalReviews =
    ratingResult.length > 0
      ? ratingResult[0].totalReviews
      : 0;

  return {
    activeRequests,

    myApplications,

    unreadNotifications,

    completedTasks,

    averageRating,

    totalReviews,
  };
}