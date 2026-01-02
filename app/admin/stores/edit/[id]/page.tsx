import Link from "next/link";
import Image from "next/image";
import { connectDB } from "@/src/lib/mongoose";
import { Store } from "@/src/models/store";
import StoreForm from "@/app/admin/_components/StoreForm";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function EditStore({ params }: { params: { id: string } }) {
    const { id } = await params;
    await connectDB();
    const store = await Store.findById(id);
    if (!store) return notFound();
    return (
        <div className="max-w-5xl mx-auto">
            <div className="mb-8">
                {/* <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">Adding Product To</span> */}
                <h3 className="text-3xl font-extrabold text-gray-900 mt-1">Adding Store</h3>
            </div>
            <StoreForm store={store} />
        </div>
    );
}