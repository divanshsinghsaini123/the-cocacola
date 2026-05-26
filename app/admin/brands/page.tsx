import Link from "next/link";
import { connectDB } from "@/src/lib/mongoose";
import { Brand } from "@/src/models/Brand";
import BrandsList from "./_components/BrandsList";

export const dynamic = "force-dynamic"; // Ensure fresh data on every visit

export default async function BrandsPage() {
    await connectDB();
    const brands = await Brand.find({}).sort({ order: 1, createdAt: -1 }).lean();

    // Serialize _id to string for Client Components
    const serializedBrands = brands.map((brand: any) => ({
        ...brand,
        _id: brand._id.toString(),
    }));

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">Brands</h1>
                    <p className="mt-1 md:mt-2 text-sm md:text-base text-gray-500">Manage your brands and their products.</p>
                </div>
                <div className="flex flex-wrap gap-3">
                    <Link
                        href="/admin/brands/add"
                        className="px-4 py-2 md:px-5 md:py-2.5 text-sm font-semibold text-white bg-black rounded-lg hover:bg-gray-800 transition-all shadow-sm hover:shadow-md"
                    >
                        + Add New Brand
                    </Link>
                </div>
            </div>

            <BrandsList initialBrands={serializedBrands} />
        </div>
    );
}
