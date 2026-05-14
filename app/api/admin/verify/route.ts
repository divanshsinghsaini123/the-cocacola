import { NextResponse } from "next/server";
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
            return NextResponse.json({ success: false, error: validation.error.issues[0].message }, { status: 400 });
        }

        const { username, password } = validation.data;

        const admin = await Admin.findOne({ username });

        if (!admin) {
            return NextResponse.json({ success: false, error: "Please enter the correct username or password." }, { status: 401 });
        }

        const isValidPassword = await bcrypt.compare(password, admin.password);
        
        if (!isValidPassword) {
            return NextResponse.json({ success: false, error: "Please enter the correct username or password." }, { status: 401 });
        }
        
        if (!admin.isActive) {
            return NextResponse.json({ success: false, error: "Admin account is inactive" }, { status: 401 });
        }

        return NextResponse.json({ success: true, message: "Admin verified successfully" });

    } catch (error: any) {
        console.error("Verification Error:", error);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}
