
import { NextResponse } from "next/server";

import { connectDB } from "@/src/lib/mongoose";
import { Cal } from "@/src/models/calc/calc";
import { CalculatorProductSchema } from "@/src/lib/validation";

export async function GET(request: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (!id) {
            const products = await Cal.find();
            return NextResponse.json({ products });
        }
        const products = await Cal.findById(id);
        return NextResponse.json({ products });
    } catch (error: any) {
        console.error("Product fetch error", error);
        return NextResponse.json({ error: "Internal Server Error: " + error.message }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (!id) {
            return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
        }
        const products = await Cal.findByIdAndDelete(id);
        return NextResponse.json({ products });
    } catch (error: any) {
        console.error("Product fetch error", error);
        return NextResponse.json({ error: "Internal Server Error: " + error.message }, { status: 500 });
    }
}

// for saving an edit 
export async function PUT(request: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (!id) {
            return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
        }
        const body = await request.json();
        const validation = CalculatorProductSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({ error: validation.error.issues[0].message }, { status: 400 });
        }
        const products = await Cal.findByIdAndUpdate(id, validation.data, { new: true });
        return NextResponse.json({ products });
    } catch (error: any) {
        console.error("Product fetch error", error);
        return NextResponse.json({ error: "Internal Server Error: " + error.message }, { status: 500 });
    }
}

// for saving an new product 

export async function POST(request: Request) {
    try {
        await connectDB();
        const body = await request.json();
        const validation = CalculatorProductSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({ error: validation.error.issues[0].message }, { status: 400 });
        }
        const product = await Cal.create(validation.data);
        return NextResponse.json({ product });
    } catch (error: any) {
        console.error("Product fetch error", error);
        return NextResponse.json({ error: "Internal Server Error: " + error.message }, { status: 500 });
    }
}

