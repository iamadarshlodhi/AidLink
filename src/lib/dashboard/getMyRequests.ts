import mongoose from "mongoose";

import HelpRequestModel from "@/model/HelpRequest";

export async function getMyRequests(
  userId: string
) {
  const objectId = new mongoose.Types.ObjectId(userId);

  const requests = await HelpRequestModel.aggregate([
    {
      $match: {
        requester: objectId,
        status: {
          $in: ["open", "in-progress"],
        },
      },
    },

    {
      $lookup: {
        from: "requestapplications",
        localField: "_id",
        foreignField: "requestId",
        as: "applications",
      },
    },

    {
      $addFields: {
        applicationCount: {
          $size: "$applications",
        },

        acceptedHelpersCount: {
          $size: "$acceptedHelpers",
        },
      },
    },

    {
      $project: {
        applications: 0,
        adminNotes: 0,
        __v: 0,
      },
    },

    {
      $sort: {
        createdAt: -1,
      },
    },

    {
      $limit: 3,
    },
  ]);

  return requests;
}