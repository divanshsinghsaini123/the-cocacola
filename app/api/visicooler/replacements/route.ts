import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/src/lib/mongoose";
import { shop } from "@/src/models/visicooler/shop";
import { ReplacementRequest } from "@/src/models/visicooler/replacementRequest";
import { ReplacementRequestValidationSchema } from "@/src/lib/validation";
import { sendReplacementRequestEmail } from "@/src/lib/email";

// GET: Fetch replacement requests
export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const status = searchParams.get("status");

        const query: any = {};
        if (status) {
            query.status = status;
        }

        const requests = await ReplacementRequest.find(query)
            .populate("shopId")
            .sort({ createdAt: -1 });

        return NextResponse.json({ success: true, data: requests });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// POST: Create a new replacement request
export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const body = await req.json();

        // Validate using Zod
        const validation = ReplacementRequestValidationSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({ success: false, error: validation.error.format() }, { status: 400 });
        }

        const data = validation.data;

        // Fetch corresponding shop for snapshot
        const targetShop = await shop.findById(data.shopId);
        if (!targetShop) {
            return NextResponse.json({ success: false, message: "Shop not found" }, { status: 404 });
        }

        // Create snapshot
        const shopDetailsSnapshot = {
            outletDetails: targetShop.outletDetails,
            distributorDetails: targetShop.distributorDetails,
            businessDetails: targetShop.businessDetails,
        };

        const newRequest = await ReplacementRequest.create({
            shopId: data.shopId,
            shopDetailsSnapshot,
            casesPerMonth: data.casesPerMonth,
            describeIssue: data.describeIssue,
            triedToRepair: data.triedToRepair,
            fridgeType: data.fridgeType,
            branding: data.branding,
            currentSerial: data.currentSerial,
            currentMfgdDate: data.currentMfgdDate,
            status: "pending"
        });

        // Send email alert to admin asynchronously
        const protocol = req.nextUrl.protocol || "http:";
        const host = req.nextUrl.host || "localhost:3000";
        const redirectUrl = `${protocol}//${host}/visicooler/requests?tab=replacement`;

        sendReplacementRequestEmail({
            requestId: newRequest._id.toString(),
            shopName: shopDetailsSnapshot.outletDetails.shopName,
            ownerName: shopDetailsSnapshot.outletDetails.ownerName,
            phone: shopDetailsSnapshot.outletDetails.mobileNumber,
            address: shopDetailsSnapshot.outletDetails.address,
            area: shopDetailsSnapshot.outletDetails.area,
            casesPerMonth: newRequest.casesPerMonth,
            distributorName: shopDetailsSnapshot.distributorDetails.distributorName,
            accountNumber: shopDetailsSnapshot.distributorDetails.accountNumber.toString(),
            hubName: shopDetailsSnapshot.distributorDetails.hubName,
            describeIssue: newRequest.describeIssue,
            triedToRepair: newRequest.triedToRepair,
            fridgeType: newRequest.fridgeType,
            branding: newRequest.branding.join(", ") || "None",
            currentSerial: newRequest.currentSerial,
            currentMfgdDate: newRequest.currentMfgdDate,
            redirectUrl
        }).catch(err => console.error("Error sending replacement request email:", err));

        return NextResponse.json({ success: true, data: newRequest, message: "Replacement request submitted successfully!" }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// PATCH: Mark a replacement request as completed
export async function PATCH(req: NextRequest) {
    try {
        await connectDB();
        const body = await req.json();
        const { id, status } = body;

        if (!id || status !== "completed") {
            return NextResponse.json({ success: false, message: "ID and status: 'completed' are required" }, { status: 400 });
        }

        const updatedRequest = await ReplacementRequest.findByIdAndUpdate(
            id,
            {
                status: "completed",
                completedAt: new Date()
            },
            { new: true }
        );

        if (!updatedRequest) {
            return NextResponse.json({ success: false, message: "Replacement request not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: updatedRequest, message: "Request marked as completed successfully!" });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
