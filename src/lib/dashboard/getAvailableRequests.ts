import mongoose from "mongoose";

import HelpRequestModel from "@/model/HelpRequest";

export async function getAvailableRequests(
  userId: string
) {
  const objectId = new mongoose.Types.ObjectId(userId);

  const requests = await HelpRequestModel.aggregate([
    {
      $match: {
        requester: {
          $ne: objectId,
        },
        status: "open",
      },
    },

    {
      $sort: {
        createdAt: -1,
      },
    },

    {
      $limit: 5,
    },

    // Populate requester (only required fields)
    {
      $lookup: {
        from: "users",
        let: {
          requesterId: "$requester",
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$_id", "$$requesterId"],
              },
            },
          },
          {
            $project: {
              _id: 1,
              name: 1,
              username: 1,
              profilePicture: 1,
            },
          },
        ],
        as: "requester",
      },
    },

    {
      $unwind: "$requester",
    },

    // Get application count
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
      },
    },

    {
      $project: {
        applications: 0,
        adminNotes: 0,
        __v: 0,
      },
    },
  ]);

  return requests;
}