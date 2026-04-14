
import { NextResponse } from "next/server";

import { connectDB } from "@/src/lib/mongoose";
import { Product } from "@/src/models/Product";
export async function GET() {
    try {
        await connectDB();
        const products = await Product.find();
        return NextResponse.json({ products });
    } catch (error: any) {
        console.error("Product fetch error", error);
        return NextResponse.json({ error: "Internal Server Error: " + error.message }, { status: 500 });
    }
}


//this route is for creating new product , 