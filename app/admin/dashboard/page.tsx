import Link from "next/link";
import Image from "next/image";
import { connectDB } from "@/src/lib/mongoose";
import { Brand } from "@/src/models/Brand";
import { Product } from "@/src/models/Product";
import DeleteBrandButton from "./DeleteBrandButton";

export const dynamic = "force-dynamic"; // Ensure fresh data on every visit
async function deleteBrand(id: string) {
    try {
        await Brand.deleteOne({ _id: id });
        await Product.deleteMany({ brand: id });
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}
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
                <div className="flex gap-3">
                    <Link
                        href="/admin/stores"
                        className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-black rounded-lg hover:bg-gray-800 transition-all shadow-sm hover:shadow-md"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
                            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                            <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
                            <path d="M2 7h20" />
                            <path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7" />
                        </svg>
                        Stores
                    </Link>

                    <Link
                        href="/admin/brands/add"
                        className="px-5 py-2.5 text-sm font-semibold text-white bg-black rounded-lg hover:bg-gray-800 transition-all shadow-sm hover:shadow-md"
                    >
                        + Add New Brand
                    </Link>

                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {brands.map((brand: any) => (
                    <div
                        key={brand._id.toString()}
                        className="group relative flex flex-col overflow-hidden bg-white border border-gray-200 rounded-2xl shadow-sm transition-all hover:shadow-lg hover:border-gray-300"
                    >
                        {/* Delete Button */}
                        <DeleteBrandButton id={brand._id.toString()} />


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
                                    Edit/Products
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
