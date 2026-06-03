import { NextRequest, NextResponse } from "next/server";
import { connectDB } from '@/src/lib/mongoose';
import { shop } from "@/src/models/visicooler/shop";
import { ShopValidationSchema } from "@/src/lib/validation";
import { VisicoolerOtp } from "@/src/models/visicooler/otp";

// GET: Get all shops OR get one shop by ID (e.g. ?id=...)
export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (id) {
            const singleShop = await shop.findOne({ _id: id, isActive: true });
            if (!singleShop) {
                return NextResponse.json({ success: false, message: "Shop not found" }, { status: 404 });
            }
            return NextResponse.json({ success: true, data: singleShop });
        }

        const shops = await shop.find({ isActive: true });
        return NextResponse.json({ success: true, data: shops });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// POST: Create a new shop
export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const body = await req.json();
        const { otp, ...shopData } = body;

        // Enforce OTP verification
        if (!otp) {
            return NextResponse.json({ success: false, error: { message: "Authorization code (OTP) is required" } }, { status: 400 });
        }

        const otpRecord = await VisicoolerOtp.findOne({ otp: otp.trim() });
        if (!otpRecord || new Date() > otpRecord.expiresAt) {
            return NextResponse.json({ success: false, error: { message: "Invalid or expired authorization code" } }, { status: 400 });
        }

        // OTP is valid - consume/delete it immediately to prevent replay attacks
        await VisicoolerOtp.deleteOne({ _id: otpRecord._id });

        // Validate using Zod
        const validation = ShopValidationSchema.safeParse(shopData);
        if (!validation.success) {
            return NextResponse.json({ success: false, error: validation.error.format() }, { status: 400 });
        }

        const newShop = await shop.create(validation.data);
        return NextResponse.json({ success: true, data: newShop }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// PUT: Update an existing shop
export async function PUT(req: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ success: false, message: "Shop ID is required" }, { status: 400 });
        }

        const body = await req.json();
        const { otp, ...shopData } = body;

        // Enforce OTP verification
        if (!otp) {
            return NextResponse.json({ success: false, error: { message: "Authorization code (OTP) is required" } }, { status: 400 });
        }

        const otpRecord = await VisicoolerOtp.findOne({ otp: otp.trim() });
        if (!otpRecord || new Date() > otpRecord.expiresAt) {
            return NextResponse.json({ success: false, error: { message: "Invalid or expired authorization code" } }, { status: 400 });
        }

        // OTP is valid - consume/delete it immediately to prevent replay attacks
        await VisicoolerOtp.deleteOne({ _id: otpRecord._id });

        // Validate using Zod
        const validation = ShopValidationSchema.safeParse(shopData);
        if (!validation.success) {
            return NextResponse.json({ success: false, error: validation.error.format() }, { status: 400 });
        }

        const updatedShop = await shop.findByIdAndUpdate(id, validation.data, { new: true });
        if (!updatedShop) {
            return NextResponse.json({ success: false, message: "Shop not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: updatedShop }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// DELETE: Delete a shop by ID (e.g. ?id=...)
export async function DELETE(req: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ success: false, message: "Shop ID is required" }, { status: 400 });
        }

        const deletedShop = await shop.findByIdAndDelete(id);
        if (!deletedShop) {
            return NextResponse.json({ success: false, message: "Shop not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Shop deleted successfully" });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// PATCH: Add or remove an image from a shop
export async function PATCH(req: NextRequest) {
    try {
        await connectDB();
        const body = await req.json();
        const { id, action, url } = body;

        // action should be either "add_image" or "delete_image"
        if (!id || !action || !url) {
            return NextResponse.json({ success: false, message: "id, action, and url are required" }, { status: 400 });
        }

        if (action === "add_image") {
            const updatedShop = await shop.findByIdAndUpdate(
                id,
                { $push: { images: { url } } }, // Pushes the new object to the array
                { new: true }
            );
            return NextResponse.json({ success: true, data: updatedShop });
        }

        if (action === "delete_image") {
            const updatedShop = await shop.findByIdAndUpdate(
                id,
                { $pull: { images: { url } } }, // Pulls the object with this exact URL out of the array
                { new: true }
            );
            return NextResponse.json({ success: true, data: updatedShop });
        }

        return NextResponse.json({ success: false, message: "Invalid action" }, { status: 400 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
