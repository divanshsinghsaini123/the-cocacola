import Link from "next/link";
import Image from "next/image";
import { connectDB } from "@/src/lib/mongoose";
import { Store } from "@/src/models/store";
import DeleteStoreButton from "./DeleteStoreButton";

export const dynamic = "force-dynamic";

export default async function StoresPage() {
    await connectDB();
    // Fetch all stores
    const stores = await Store.find({}).sort({ createdAt: -1 }).lean();

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">Stores</h1>
                    <p className="mt-1 md:mt-2 text-sm md:text-base text-gray-500">Manage your store locations and details.</p>
                </div>
                <div className="flex flex-wrap gap-3">
                    <Link
                        href="/admin/stores/add"
                        className="flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 text-sm font-semibold text-white bg-black rounded-lg hover:bg-gray-800 transition-all shadow-sm hover:shadow-md"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14" />
                            <path d="M12 5v14" />
                        </svg>
                        Add New Store
                    </Link>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {stores.map((store: any) => (
                    <div
                        key={store._id.toString()}
                        className="group relative flex flex-col overflow-hidden bg-white border border-gray-200 rounded-2xl shadow-sm transition-all hover:shadow-lg hover:border-gray-300"
                    >
                        {/* Delete Button (Client Component) */}
                        <DeleteStoreButton id={store._id.toString()} />

                        {/* Image Area */}
                        <div className="relative w-full h-48 bg-gray-50 group-hover:bg-gray-100 transition-colors overflow-hidden">
                            {store.image ? (
                                <Image
                                    src={store.image}
                                    alt={store.name}
                                    fill
                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-50"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" /></svg>
                                </div>
                            )}
                        </div>

                        {/* Content Area */}
                        <div className="flex flex-col flex-1 p-5">
                            <div className="mb-4">
                                <h3 className="text-xl font-bold text-gray-900 truncate" title={store.name}>
                                    {store.name}
                                </h3>
                                <p className="text-sm text-gray-500 font-medium uppercase tracking-wider mt-1 flex items-center gap-1">
                                    <span className={`w-2 h-2 rounded-full ${store.isActive ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                                    {store.modeofstore}
                                </p>
                            </div>

                            <div className="flex gap-3 mt-auto">
                                <Link
                                    href={`/admin/stores/edit/${store._id}`}
                                    className="flex-1 px-4 py-2 text-sm font-semibold text-center text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-black transition-colors shadow-sm"
                                >
                                    Edit Store
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}

                {stores.length === 0 && (
                    <div className="col-span-full flex flex-col items-center justify-center py-16 px-4 text-center border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 text-gray-400 shadow-sm border border-gray-100">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" /><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" /><path d="M2 7h20" /><path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7" /></svg>
                        </div>
                        <p className="text-xl font-semibold text-gray-900">No stores found</p>
                        <p className="mt-2 text-sm text-gray-500 max-w-sm mx-auto">Get started by creating your first store to manage locations and details.</p>
                        <Link
                            href="/admin/stores/add"
                            className="mt-6 px-6 py-2.5 text-sm font-semibold text-white bg-black rounded-lg hover:bg-gray-800 transition-all shadow-sm hover:shadow-md inline-flex items-center gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
                            Add Your First Store
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
