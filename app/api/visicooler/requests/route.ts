import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectDB } from "@/src/lib/mongoose";
import { shop } from "@/src/models/visicooler/shop";
import { ShopRequest, RequestHistory } from "@/src/models/visicooler/request";
import { ShopValidationSchema } from "@/src/lib/validation";

// Helper to verify admin JWT token from cookie
async function verifyAdminSession() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("admin_token")?.value;
        if (!token) return null;

        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET missing in env variables");
            return null;
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET) as { username: string; adminId: string };
        return decoded;
    } catch (err) {
        return null;
    }
}

// GET: Fetch pending requests OR a single request by ID
export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (id) {
            const requestItem = await ShopRequest.findById(id);
            if (!requestItem) {
                return NextResponse.json({ success: false, message: "Request not found" }, { status: 404 });
            }
            return NextResponse.json({ success: true, data: requestItem }, { status: 200 });
        }

        // Return all pending requests
        const requests = await ShopRequest.find({ status: "pending" }).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: requests }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// POST: Approve or Reject a request
export async function POST(req: NextRequest) {
    try {
        await connectDB();

        // 1. Verify Admin Session
        const admin = await verifyAdminSession();
        if (!admin) {
            return NextResponse.json({ success: false, error: { message: "Unauthorized admin access" } }, { status: 401 });
        }

        const body = await req.json();
        const { requestId, action, approvedData } = body;

        if (!requestId || !action || !["approve", "reject"].includes(action)) {
            return NextResponse.json({ success: false, message: "Invalid parameters" }, { status: 400 });
        }

        // 2. Fetch the original request
        const pendingRequest = await ShopRequest.findById(requestId);
        if (!pendingRequest) {
            return NextResponse.json({ success: false, message: "Pending request not found" }, { status: 404 });
        }

        const adminName = admin.username || "Admin";

        if (action === "reject") {
            // Log rejection to history
            await RequestHistory.create({
                requestId: pendingRequest._id,
                type: pendingRequest.type,
                shopId: pendingRequest.shopId || undefined,
                requestedData: pendingRequest.requestedData,
                action: "rejected",
                actionBy: adminName
            });

            // Delete from pending requests
            await ShopRequest.deleteOne({ _id: pendingRequest._id });

            return NextResponse.json({ success: true, message: "Request rejected and logged to history." });
        }

        // Action is "approve"
        if (!approvedData) {
            return NextResponse.json({ success: false, message: "Approved data payload is required for approvals" }, { status: 400 });
        }

        // 3. Validate approved data with Zod
        const validation = ShopValidationSchema.safeParse(approvedData);
        if (!validation.success) {
            return NextResponse.json({ success: false, error: validation.error.format() }, { status: 400 });
        }

        const validatedData = validation.data;
        let finalShopId = pendingRequest.shopId;

        if (pendingRequest.type === "create") {
            // Create a new shop in database (explicitly set status to approved)
            const newShop = await shop.create({
                ...validatedData,
                status: "approved"
            });
            finalShopId = newShop._id;
        } else {
            // Edit existing shop
            if (!pendingRequest.shopId) {
                return NextResponse.json({ success: false, message: "Shop ID missing in edit request" }, { status: 400 });
            }

            const updatedShop = await shop.findByIdAndUpdate(pendingRequest.shopId, {
                ...validatedData,
                status: "approved"
            }, { new: true });

            if (!updatedShop) {
                return NextResponse.json({ success: false, message: "Target shop to update not found" }, { status: 404 });
            }
        }

        // 4. Log approval to history
        await RequestHistory.create({
            requestId: pendingRequest._id,
            type: pendingRequest.type,
            shopId: finalShopId,
            requestedData: validatedData,
            action: "approved",
            actionBy: adminName
        });

        // 5. Delete from pending requests
        await ShopRequest.deleteOne({ _id: pendingRequest._id });

        return NextResponse.json({ success: true, message: "Request approved and database updated successfully!" });

    } catch (error: any) {
        console.error("Error processing request action:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
