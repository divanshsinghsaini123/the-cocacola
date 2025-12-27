import { NextResponse } from "next/server";
import { connectDB } from "@/src/lib/mongoose";
import { Brand } from "@/src/models/Brand";

// GET all brands
export async function GET() {
    try {
        await connectDB();
        const brands = await Brand.find();
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
        const brand = await Brand.create(body);
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

        const brand = await Brand.findByIdAndUpdate(
            body.id,
            body,
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

// DELETE brand
export async function DELETE(request: Request) {
    try {
        await connectDB();
        const body = await request.json();

        const brand = await Brand.findByIdAndDelete(body.id);

        return NextResponse.json({ brand }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to delete brand" },
            { status: 500 }
        );
    }
}
