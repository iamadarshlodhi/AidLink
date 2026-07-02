import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { changePasswordSchema } from "@/schemas/changePasswordSchema";
import { auth } from "@/auth";

export async function PATCH(request: Request) {
    await dbConnect();

    try {
        const session = await auth();

        if (!session || !session.user) {
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

        const validationResult = changePasswordSchema.safeParse(body);

        if (!validationResult.success) {
            return Response.json(
                {
                    success: false,
                    message: "Invalid input data",
                    errors: validationResult.error.flatten(),
                },
                {
                    status: 400,
                }
            );
        }
        
        const { currentPassword, newPassword } = validationResult.data;

        const user = await UserModel.findById(session.user.id);

        if (!user) {
            return Response.json(
                {
                    success: false,
                    message: "User not found",
                },
                {
                    status: 404,
                }
            );
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);

        if (!isMatch) {
            return Response.json(
                {
                    success: false,
                    message: "Current password is incorrect",
                },
                {
                    status: 400,
                }
            );
        }

        if(currentPassword === newPassword) {
            return Response.json(
                {
                    success: false,
                    message: "New password cannot be the same as the current password",
                },
                {
                    status: 400,
                }
            );
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        await user.save();

        return Response.json(
            {
                success: true,
                message: "Password changed successfully",
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        return Response.json(
            {
                success: false,
                message: "An error occurred while changing the password",
            },
            {
                status: 500,
            }
        );
    }
}