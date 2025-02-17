import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
    await connectToDatabase()
    try {
        //email and password nikalo
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 }
            )
        }


        const user = await User.findOne({ email });
        // Check if user exists
        if (!user) {
            return NextResponse.json({ message: "User Not found" }, { status: 404 })
        }

        //compare the password

        const isMatchPassword = await bcrypt.compare(password, user.password)

        if (!isMatchPassword) {
            return NextResponse.json({ message: "Invalid Password" }, { status: 401 })
        }

        return NextResponse.json({
            message: "Login Successfully",
            user: { _id: user._id, email: user.email },
        },
            { status: 200 })



    } catch (error) {
        return NextResponse.json(
            { error: "Failed to Login" },
            { status: 400 }
        );
    }
}