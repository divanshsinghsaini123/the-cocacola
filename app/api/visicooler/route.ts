import { NextRequest, NextResponse } from "next/server";
import { connectDB } from '@/src/lib/mongoose';
import { shop } from "@/src/models/visicooler/shop";
import { ShopValidationSchema } from "@/src/lib/validation";
import { ShopRequest } from "@/src/models/visicooler/request";
import { sendRequestNotificationEmail } from "@/src/lib/email";

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

// POST: Submit a new shop request
export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const body = await req.json();

        // Validate using Zod
        const validation = ShopValidationSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({ success: false, error: validation.error.format() }, { status: 400 });
        }

        const newRequest = await ShopRequest.create({
            type: "create",
            requestedData: validation.data,
            status: "pending",
            requestedBy: validation.data.se || "Field Personnel"
        });

        // Send email alert to admin asynchronously
        const protocol = req.nextUrl.protocol || "http:";
        const host = req.nextUrl.host || "localhost:3000";
        const redirectUrl = `${protocol}//${host}/visicooler/createshop?requestId=${newRequest._id}`;

        sendRequestNotificationEmail({
            type: "create",
            requestId: newRequest._id.toString(),
            shopName: validation.data.outletDetails.shopName,
            ownerName: validation.data.outletDetails.ownerName,
            requestedBy: newRequest.requestedBy,
            redirectUrl
        }).catch(err => console.error("Error sending admin approval email:", err));

        return NextResponse.json({ success: true, data: newRequest, message: "Creation request submitted successfully!" }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// PUT: Submit an edit shop request
export async function PUT(req: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ success: false, message: "Shop ID is required" }, { status: 400 });
        }

        // Verify that target shop exists
        const existingShop = await shop.findById(id);
        if (!existingShop) {
            return NextResponse.json({ success: false, message: "Shop not found" }, { status: 404 });
        }

        const body = await req.json();

        // Validate using Zod
        const validation = ShopValidationSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({ success: false, error: validation.error.format() }, { status: 400 });
        }

        const newRequest = await ShopRequest.create({
            type: "edit",
            shopId: id,
            requestedData: validation.data,
            status: "pending",
            requestedBy: validation.data.se || "Field Personnel"
        });

        // Send email alert to admin asynchronously
        const protocol = req.nextUrl.protocol || "http:";
        const host = req.nextUrl.host || "localhost:3000";
        const redirectUrl = `${protocol}//${host}/visicooler/createshop?requestId=${newRequest._id}`;

        sendRequestNotificationEmail({
            type: "edit",
            requestId: newRequest._id.toString(),
            shopName: validation.data.outletDetails.shopName,
            ownerName: validation.data.outletDetails.ownerName,
            requestedBy: newRequest.requestedBy,
            redirectUrl
        }).catch(err => console.error("Error sending admin approval email:", err));

        return NextResponse.json({ success: true, data: newRequest, message: "Edit request submitted successfully!" }, { status: 201 });
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
