import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/src/lib/mongoose";
import { shop } from "@/src/models/visicooler/shop";

function escapeRegex(str: string) {
    return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const { name } = await req.json();

        if (!name || typeof name !== "string" || !name.trim()) {
            return NextResponse.json(
                { success: false, error: "ASM / SE Name is required" },
                { status: 400 }
            );
        }

        const trimmedName = name.trim();
        const escapedName = escapeRegex(trimmedName);

        // Find if there is any shop with matching ASM or SE name (case-insensitive, trimmed)
        const match = await shop.findOne({
            $or: [
                { asm: { $regex: new RegExp(`^${escapedName}$`, "i") } },
                { se: { $regex: new RegExp(`^${escapedName}$`, "i") } }
            ]
        });

        if (!match) {
            return NextResponse.json(
                { success: false, error: " Access Denied." },
                { status: 401 }
            );
        }

        // Determine if they matched as ASM or SE
        const isAsm = match.asm && match.asm.toLowerCase() === trimmedName.toLowerCase();
        const role = isAsm ? "ASM" : "SE";
        const matchedName = isAsm ? match.asm : match.se;

        return NextResponse.json({
            success: true,
            role,
            name: matchedName,
            message: "Authentication successful"
        });
    } catch (error: any) {
        console.error("Auth error:", error);
        return NextResponse.json(
            { success: false, error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}
