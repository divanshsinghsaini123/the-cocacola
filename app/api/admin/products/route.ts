import { NextResponse } from "next/server";
import { connectDB } from "@/src/lib/mongoose";
import { Product } from "@/src/models/Product";
import { ProductSchema } from "@/src/lib/validation";
import "@/src/models/Brand"; // Ensure Brand model is registered for populate

// GET → get all products (optionally by brand)
export async function GET(request: Request) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const brandId = searchParams.get("brand");

        const query = { brand: brandId };

        const products = await Product.find(query)
            .populate("brand", "name logo slug")
            .sort({ createdAt: -1 });

        return NextResponse.json({ products }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch products" },
            { status: 500 }
        );
    }
}

// POST → create product
export async function POST(request: Request) {
    try {
        await connectDB();

        const body = await request.json();

        const validation = ProductSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({ error: validation.error.issues[0].message }, { status: 400 });
        }

        const product = await Product.create(validation.data);

        return NextResponse.json({ product }, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to create product" },
            { status: 500 }
        );
    }
}

// PUT → update product
export async function PUT(request: Request) {
    try {
        await connectDB();

        const body = await request.json();

        const { id, ...data } = body;
        if (!id) {
            return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
        }

        const validation = ProductSchema.partial().safeParse(data);
        if (!validation.success) {
            return NextResponse.json({ error: validation.error.issues[0].message }, { status: 400 });
        }

        const product = await Product.findByIdAndUpdate(
            id,
            validation.data,
            { new: true }
        );

        return NextResponse.json({ product }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to update product" },
            { status: 500 }
        );
    }
}

// DELETE → delete product
export async function DELETE(request: Request) {
    try {
        await connectDB();

        const body = await request.json();

        const product = await Product.findByIdAndDelete(body.id);

        return NextResponse.json({ product }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to delete product" },
            { status: 500 }
        );
    }
}
