import Link from "next/link";
import Image from "next/image";
import { connectDB } from "@/src/lib/mongoose";
import { Store } from "@/src/models/store";
import StoreForm from "@/app/admin/_components/StoreForm";

export const dynamic = "force-dynamic";

export default async function AddStore() {
    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div>
                <Link
                    href="/admin/stores"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-black transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
                    Back to Stores
                </Link>
            </div>
            <div>
                <div className="mb-8">
                    <h3 className="text-3xl font-extrabold text-gray-900 mt-1">Adding Store</h3>
                </div>
                <StoreForm />
            </div>
        </div>
    );
}