import jwt from "jsonwebtoken";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectDB } from "@/src/lib/mongoose";
import { Admin } from "@/src/models/Admin";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
    try {
        await connectDB();

        const { username, password } = await request.json();

        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET is missing in environment variables.");
            return NextResponse.json({ error: "Server misconfiguration: JWT_SECRET missing" }, { status: 500 });
        }

        // Check if admin exists
        let admin = await Admin.findOne({ username });

        // If no admin found, CREATE one (Auto-registration)
        if (!admin) {
            console.log("Admin not found, creating new admin:", username);
            try {
                admin = await Admin.create({ username, password });
            } catch (error: any) {
                console.error("Error creating admin:", error);
                return NextResponse.json({ error: "Failed to create admin: " + error.message }, { status: 500 });
            }
        }

        // Verify Password (Plain text currently)
        if (password !== admin.password) {
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
