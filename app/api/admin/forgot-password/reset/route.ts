import { NextResponse } from "next/server";
import { connectDB } from "@/src/lib/mongoose";
import { Admin } from "@/src/models/Admin";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
    try {
        await connectDB();

        const { username, code, newPassword } = await request.json();

        if (!username || !code || !newPassword) {
            return NextResponse.json({ 
                error: "Username, verification code, and new password are required" 
            }, { status: 400 });
        }

        if (newPassword.length < 6) {
            return NextResponse.json({ error: "Password must be at least 6 characters long" }, { status: 400 });
        }

        const admin = await Admin.findOne({ username });

        if (!admin) {
            return NextResponse.json({ error: "No account found with that username" }, { status: 404 });
        }

        // Verify the code again to prevent direct route bypass/abuse
        if (!admin.resetCode || admin.resetCode !== code.trim()) {
            return NextResponse.json({ error: "Invalid verification code" }, { status: 400 });
        }

        if (!admin.resetCodeExpires || new Date() > admin.resetCodeExpires) {
            return NextResponse.json({ error: "Verification code has expired. Please request a new one." }, { status: 400 });
        }

        // Hash password (10 rounds is standard and secure)
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password and invalidate the recovery code
        admin.password = hashedPassword;
        admin.resetCode = undefined;
        admin.resetCodeExpires = undefined;
        await admin.save();

        return NextResponse.json({ 
            success: true, 
            message: "Password updated successfully" 
        });

    } catch (error: any) {
        console.error("Forgot password reset error:", error);
        return NextResponse.json({ error: "Internal Server Error: " + error.message }, { status: 500 });
    }
}
