import { NextResponse } from "next/server";
import { Store } from '@/src/models/store';
import { connectDB } from '@/src/lib/mongoose';

//get all the stores from the database 

export async function GET() {
    try {
        await connectDB();
        const stores = await Store.find({}).sort({ createdAt: -1 }).lean();
        return NextResponse.json(stores);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to fetch stores" }, { status: 500 });
    }
}
//create a new product 
export async function POST(request: Request) {
    try {
        await connectDB();
        const body = await request.json();
        console.log(request.body);
        const store = await Store.create(body);
        return NextResponse.json(store, { status: 201 });
    }
    catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to create store" }, { status: 500 });
    }
}
//edit a store 
export async function PUT(request: Request) {
    try {
        await connectDB();
        const body = await request.json();
        const id = body.id;
        await Store.findByIdAndUpdate(id, body);
        return NextResponse.json({ message: "Store updated successfully" }, { status: 200 });

    }
    catch (error) {
        console.error(error);
        return Response.json({
            message: "Failed to update store"
        }, { status: 500 });
    }
}

//delete a store 
export async function DELETE(request: Request) {
    try {
        await connectDB();
        const body = await request.json();
        const id = body.id;
        await Store.deleteOne({ _id: id });
        return NextResponse.json({ message: "Store deleted successfully" }, { status: 200 });
    }
    catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to delete store" }, { status: 500 });
    }
}
