import jwt from "jsonwebtoken";
import { rateLimit } from "@/src/lib/rate-limit";

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

        // Rate Limiter
        const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
            || "unknown";
        const { success: allowed } = rateLimit(`login:${ip}`, 5, 900); // 5 per 15 min

        if (!allowed) {
            return NextResponse.json(
                { error: "Too many login attempts. Please try again later." },
                { status: 429 }
            );
        }

        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET is missing in environment variables.");
            return NextResponse.json({ error: "Server misconfiguration: JWT_SECRET missing" }, { status: 500 });
        }

        // Check if admin exists
        let admin = await Admin.findOne({ username });

        if (!admin) {
            return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
        }

        let unhashpassword = await bcrypt.compare(password, admin.password);
        // Verify Password (hashed password)
        if (!unhashpassword || !admin.isActive || admin.role !== "Superadmin") {
            return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
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
            maxAge: 3600, // 1 hour
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
