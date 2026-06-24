import { NextResponse } from "next/server";
import { connectDB } from "@/src/lib/mongoose";
import { Brand } from "@/src/models/Brand";
import { BrandSchema } from "@/src/lib/validation";

// GET all brands
export async function GET() {
    try {
        await connectDB();
        const brands = await Brand.find().sort({ order: 1, createdAt: -1 });
        return NextResponse.json({ brands }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch brands" },
            { status: 500 }
        );
    }
}

// CREATE brand
export async function POST(request: Request) {
    try {
        await connectDB();
        const body = await request.json();

        const validation = BrandSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({ error: validation.error.issues[0].message }, { status: 400 });
        }

        const brand = await Brand.create(validation.data);
        return NextResponse.json({ brand }, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to create brand" },
            { status: 500 }
        );
    }
}

// UPDATE brand
export async function PUT(request: Request) {
    try {
        await connectDB();
        const body = await request.json();

        // Separate ID from data for validation
        const { id, ...data } = body;

        if (!id) {
            return NextResponse.json({ error: "Brand ID is required" }, { status: 400 });
        }

        const validation = BrandSchema.partial().safeParse(data); // Partial for updates if we want to allow partial updates, but PUT usually means replace. 
        // However, the user flow seems to send full data. Let's strictly validate if it sends full data, OR allow partial. 
        // Given the UI usually sends the whole form, strict or partial is fine. Let's use partial to be safe for updates.

        if (!validation.success) {
            return NextResponse.json({ error: validation.error.issues[0].message }, { status: 400 });
        }

        const brand = await Brand.findByIdAndUpdate(
            id,
            validation.data,
            { new: true }
        );

        return NextResponse.json({ brand }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to update brand" },
            { status: 500 }
        );
    }
}

import { deleteFromGcore, deleteFilesFromGcore } from "@/src/lib/gcore";

// DELETE brand
export async function DELETE(request: Request) {
    try {
        await connectDB();
        const body = await request.json();

        // Find the brand first to get image paths
        const brand = await Brand.findById(body.id);

        if (!brand) {
            return NextResponse.json({ error: "Brand not found" }, { status: 404 });
        }

        // Delete logo
        if (brand.logo) {
            await deleteFromGcore(brand.logo);
        }

        // Delete gallery images
        if (brand.images && brand.images.length > 0) {
            await deleteFilesFromGcore(brand.images);
        }

        // Delete the brand record
        await Brand.findByIdAndDelete(body.id);

        return NextResponse.json({ message: "Brand and associated images deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Delete Brand Error:", error);
        return NextResponse.json(
            { error: "Failed to delete brand" },
            { status: 500 }
        );
    }
}
