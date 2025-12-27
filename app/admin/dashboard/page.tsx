import Link from "next/link";
import Image from "next/image";
import { connectDB } from "@/src/lib/mongoose";
import { Brand } from "@/src/models/Brand";

export const dynamic = "force-dynamic"; // Ensure fresh data on every visit

export default async function DashboardPage() {
    await connectDB();
    const brands = await Brand.find({}).sort({ createdAt: -1 }).lean();

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Brands</h1>
                    <p className="mt-2 text-gray-500">Manage your brands and their products.</p>
                </div>
                <Link
                    href="/admin/brands/add"
                    className="px-5 py-2.5 text-sm font-semibold text-white bg-black rounded-lg hover:bg-gray-800 transition-all shadow-sm hover:shadow-md"
                >
                    + Add New Brand
                </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {brands.map((brand: any) => (
                    <div
                        key={brand._id.toString()}
                        className="group relative flex flex-col overflow-hidden bg-white border border-gray-200 rounded-2xl shadow-sm transition-all hover:shadow-lg hover:border-gray-300"
                    >
                        {/* Image Area */}
                        <div className="relative flex items-center justify-center w-full h-48 p-6 bg-gray-50 group-hover:bg-gray-100 transition-colors">
                            <div className="relative w-full h-full">
                                <Image
                                    src={brand.logo}
                                    alt={brand.name}
                                    fill
                                    className="object-contain transition-transform duration-300 group-hover:scale-105"
                                />
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="flex flex-col flex-1 p-5">
                            <h3 className="text-xl font-bold text-gray-900 truncate" title={brand.name}>
                                {brand.name}
                            </h3>
                            <div className="mt-4 flex gap-3 mt-auto">
                                <Link
                                    href={`/admin/brands/edit/${brand._id}`}
                                    className="flex-1 px-4 py-2 text-sm font-semibold text-center text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-black transition-colors"
                                >
                                    Edit
                                </Link>
                                <Link
                                    href={`/brands/${brand.slug}`}
                                    target="_blank"
                                    className="flex-1 px-4 py-2 text-sm font-semibold text-center text-[#F40009] bg-red-50 border border-transparent rounded-lg hover:bg-red-100 transition-colors"
                                >
                                    Preview
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}

                {brands.length === 0 && (
                    <div className="col-span-full flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50">
                        <p className="text-lg font-medium text-gray-900">No brands found</p>
                        <p className="mt-1 text-sm text-gray-500">Get started by creating your first brand.</p>
                        <Link
                            href="/admin/brands/add"
                            className="mt-4 px-4 py-2 text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                        >
                            Create Brand &rarr;
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
