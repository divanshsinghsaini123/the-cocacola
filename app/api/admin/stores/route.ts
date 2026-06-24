import { deleteFromGcore } from "@/src/lib/gcore";
import { NextResponse } from "next/server";
import { Store } from '@/src/models/store';
import { StoreSchema } from '@/src/lib/validation';
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

        const validation = StoreSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({ error: validation.error.issues[0].message }, { status: 400 });
        }

        const store = await Store.create(validation.data);
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

        const { id, ...data } = body;
        if (!id) {
            return NextResponse.json({ error: "Store ID is required" }, { status: 400 });
        }

        const validation = StoreSchema.partial().safeParse(data);
        if (!validation.success) {
            return NextResponse.json({ error: validation.error.issues[0].message }, { status: 400 });
        }

        await Store.findByIdAndUpdate(id, validation.data);
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

        // Find store first
        const store = await Store.findById(id);

        if (!store) {
            return NextResponse.json({ error: "Store not found" }, { status: 404 });
        }

        // Delete image from Gcore
        if (store.image) {
            await deleteFromGcore(store.image);
        }

        await Store.deleteOne({ _id: id });
        return NextResponse.json({ message: "Store and image deleted successfully" }, { status: 200 });
    }
    catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to delete store" }, { status: 500 });
    }
}
