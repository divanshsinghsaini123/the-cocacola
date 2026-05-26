import { NextResponse } from "next/server";
import { connectDB } from "@/src/lib/mongoose";
import { Admin } from "@/src/models/Admin";

export async function POST(request: Request) {
    try {
        await connectDB();

        const { username, code } = await request.json();

        if (!username || !code) {
            return NextResponse.json({ error: "Username and verification code are required" }, { status: 400 });
        }

        const admin = await Admin.findOne({ username });

        if (!admin) {
            return NextResponse.json({ error: "No account found with that username" }, { status: 404 });
        }

        if (!admin.resetCode || admin.resetCode !== code.trim()) {
            console.log(admin.resetCode, code.trim())
            return NextResponse.json({ error: "Invalid verification code" }, { status: 400 });
        }

        if (!admin.resetCodeExpires || new Date() > admin.resetCodeExpires) {
            return NextResponse.json({ error: "Verification code has expired. Please request a new one." }, { status: 400 });
        }

        return NextResponse.json({
            success: true,
            message: "Verification code verified successfully"
        });

    } catch (error: any) {
        console.error("Forgot password verify code error:", error);
        return NextResponse.json({ error: "Internal Server Error: " + error.message }, { status: 500 });
    }
}
