import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import VerificationCode from "@/model/VerificationCode";

export async function POST(request: Request) {
    await dbConnect();
    try {
        const { 
            name,
            username, 
            email,
            phone, 
            password, 
            verificationCode,
            role = "user",
        } = await request.json();

        // 1. Check username exists

        const existingUser =
            await UserModel.findOne({
                $or: [
                { email },
                { username },
                ],
            });
            if (existingUser?.email === email) {
                return Response.json(
                    {
                    success: false,
                    message: "Email already registered",
                    },
                    { status: 400 }
                );
            }

            if (existingUser?.username === username) {
                return Response.json(
                    {
                    success: false,
                    message: "Username already taken",
                    },
                    { status: 400 }
                );
            }

        // 3. Find VerificationCode document

        const verificationRecord =
            await VerificationCode.findOne({
                email,
            });

        if (!verificationRecord) {
            return Response.json(
                {
                    success: false,
                    message: "Verification code not found",
                },
                {
                    status: 400,
                }
            );
        }

        const isCodeValid =
            await bcrypt.compare(
                verificationCode,
                verificationRecord.code
            );

        if (!isCodeValid) {
            return Response.json(
                {
                    success: false,
                    message: "Invalid verification code",
                },
                {
                    status: 400,
                }
            );
        }

        // 5. Hash password

        const hashedPassword = await bcrypt.hash(password, 10);

        // 6. Create user

        const newUser =
            await UserModel.create({
                name,
                username,
                email,
                phone,
                password: hashedPassword,
                role,   
                verificationStatus: "verified",
            }); 

        // 7. Delete OTP document

        await VerificationCode.deleteOne({
            _id: verificationRecord._id,
        });

        // 8. Return success response

        return Response.json(
            {
                success: true,
                message:
                "Account created successfully",
                data: {
                userId: newUser._id,
                },
            },
            {
                status: 201,
            }
        );

    } catch (error) {
        console.error("Error in sign-up route:", error);
        return Response.json({ 
            success: false,
            message: "Error occurred during sign-up. Please try again later." 
        }, 
        { 
            status: 500 
        });
    }
}
