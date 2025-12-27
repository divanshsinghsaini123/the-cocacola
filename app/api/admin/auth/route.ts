import jwt from "jsonwebtoken";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectDB } from "@/src/lib/mongoose";
import { Admin } from "@/src/models/Admin";
import bcrypt from "bcrypt";

export async function GET(request: Request) {
    await connectDB();

    const { username, password } = await request.json();

    const admin = await Admin.findOne({ username });
    if (!admin) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isValid = await bcrypt.compare(password, admin.password);
    if (!isValid) {
        return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    // create token
    const token = jwt.sign(
        { adminId: admin._id, username: admin.username },
        process.env.JWT_SECRET!,
        { expiresIn: "1h" }
    );

    const response = NextResponse.json({ message: "Login successful" });

    // set cookie
    response.cookies.set("admin_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
    });

    return response;
}

export async function POST() {
    (await cookies()).delete("admin_token");
    return NextResponse.json({ message: "Logged out" });
}
