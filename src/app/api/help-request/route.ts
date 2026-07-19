import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";

import HelpRequestModel from "@/model/HelpRequest";
import { helpRequestQuerySchema } from "@/schemas/helpRequestQuerySchema";

import { helpRequestSchema } from "@/schemas/helpRequestSchema";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const session = await auth();

    if (!session?.user?.id) {
      return Response.json(
        {
          success: false,
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const body = await request.json();

    const validation =
      helpRequestSchema.safeParse(body);

    if (!validation.success) {
      return Response.json(
        {
          success: false,
          message: "Validation failed.",
          errors:
            validation.error.flatten(),
        },
        {
          status: 400,
        }
      );
    }

    const {
      title,
      description,
      category,
      urgency,
      mode,
      taskType,
      helpersRequired,
      tentativePayment,
      deadline,
      location,
      images,
    } = validation.data;

    const helpRequest =
      await HelpRequestModel.create({
        title,
        description,
        category,
        urgency,
        mode,
        taskType,
        helpersRequired,
        tentativePayment,
        deadline,
        location,
        images,

        requester: session.user.id,

        acceptedHelpers: [],

        status: "open",
      });

    return Response.json(
      {
        success: true,
        message:
          "Help request created successfully.",
        data: helpRequest,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "Create Help Request:",
      error
    );

    return Response.json(
      {
        success: false,
        message:
          "Internal server error.",
      },
      {
        status: 500,
      }
    );
  }
}


export async function GET(request: Request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);

    const validation = helpRequestQuerySchema.safeParse({
      page: searchParams.get("page"),
      limit: searchParams.get("limit"),
      q: searchParams.get("q"),
      category: searchParams.get("category"),
      mode: searchParams.get("mode"),
      taskType: searchParams.get("taskType"),
      urgency: searchParams.get("urgency"),
      status: searchParams.get("status"),
      sort: searchParams.get("sort"),
    });

    if (!validation.success) {
      return Response.json(
        {
          success: false,
          message: "Invalid query parameters.",
          errors: validation.error.issues,
        },
        {
          status: 400,
        }
      );
    }

    const {
      page,
      limit,
      q,
      category,
      mode,
      taskType,
      urgency,
      status,
      sort,
    } = validation.data;

    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {
      status,
    };

    if (category) filter.category = category;
    if (mode) filter.mode = mode;
    if (taskType) filter.taskType = taskType;
    if (urgency) filter.urgency = urgency;

    if (q?.trim()) {
      filter.$text = {
        $search: q.trim(),
      };
    }

    const sortOptions = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      deadline: { deadline: 1 },
    } as const;

    const query = HelpRequestModel.find(filter)
      .select(`
        title
        description
        category
        urgency
        mode
        taskType
        status
        helpersRequired
        tentativePayment
        deadline
        location
        images
        requester
        createdAt
      `)
      .populate({
        path: "requester",
        select:
          "name username profileImage averageRating trustScore verificationStatus",
        match: {
          isDeleted: false,
        },
      })
      .sort(sortOptions[sort])
      .skip(skip)
      .limit(limit)
      .lean();

    const [requests, total] = await Promise.all([
      query.exec(),
      HelpRequestModel.countDocuments(filter),
    ]);

    return Response.json(
      {
        success: true,
        message: "Requests fetched successfully.",
        count: requests.length,
        data: requests,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNextPage: page * limit < total,
          hasPreviousPage: page > 1,
        },
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("GET /api/help-request:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to fetch requests.",
      },
      {
        status: 500,
      }
    );
  }
}