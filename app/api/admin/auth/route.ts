import jwt from "jsonwebtoken";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectDB } from "@/src/lib/mongoose";
import { Admin } from "@/src/models/Admin";
import bcrypt from "bcrypt";
import { AdminLoginSchema } from "@/src/lib/validation";

export async function POST(request: Request) {
    try {
        await connectDB();

        const body = await request.json();
        const validation = AdminLoginSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ error: validation.error.issues[0].message }, { status: 400 });
        }

        const { username, password } = validation.data;

        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET is missing in environment variables.");
            return NextResponse.json({ error: "Server misconfiguration: JWT_SECRET missing" }, { status: 500 });
        }

        // Check if admin exists
        let admin = await Admin.findOne({ username });

        if (!admin) {
            let hashpassword = await bcrypt.hash(password, 10);
            return NextResponse.json({ error: "Failed to create admin: " }, { status: 500 });
        }

        let unhashpassword = await bcrypt.compare(password, admin.password);
        // Verify Password (hashed password)
        if (!unhashpassword) {
            return NextResponse.json({ error: "Invalid password" }, { status: 401 });
        }

        // Create Token
        const token = jwt.sign(
            { adminId: admin._id, username: admin.username },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        const response = NextResponse.json({ message: "Login successful" });

        // Set Cookie
        response.cookies.set("admin_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
        });

        return response;

    } catch (error: any) {
        console.error("Login Error:", error);
        return NextResponse.json({ error: "Internal Server Error: " + error.message }, { status: 500 });
    }
}

export async function DELETE() {
    (await cookies()).delete("admin_token");
    return NextResponse.json({ message: "Logged out" });
}
