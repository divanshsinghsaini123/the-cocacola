import Link from "next/link";
import Image from "next/image";
import { connectDB } from "@/src/lib/mongoose";
import { Brand } from "@/src/models/Brand";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
    await connectDB();
    const topBrands = await Brand.find({ isActive: true }).limit(3).select("name").lean();
    const brandNames = topBrands.map((b: any) => b.name).join(", ");

    return {
        title: "Our Brands | Cloud9 Beverages",
        description: `Explore our portfolio of world-class beverage brands${brandNames ? `, including ${brandNames}, and more` : ''}.`,
    };
}

export const dynamic = "force-dynamic";

interface IBrand {
    _id: string;
    name: string;
    slug: string;
    logo: string;
}

export default async function BrandsPage() {
    await connectDB();
    const brands = await Brand.find({ isActive: true }).sort({ order: 1, createdAt: -1 }).lean();

    return (
        <main className="w-full bg-[#EEEEEE] min-h-screen py-10">
            <div className="max-w-3xl mx-auto px-6 sm:px-6">
                <h1 className="text-[31px] md:text-[38px] font-bold text-center mb-2 text-black">Explore Our Brands</h1>
                <p className="text-center text-gray-600 mb-8 max-w-lg mx-auto">
                    Select a brand to explore its unique products, flavors, and nutritional information.
                </p>

                {brands.length === 0 ? (
                    <div className="text-center text-gray-500 py-12 bg-white rounded-2xl shadow-sm">
                        <p className="text-lg font-medium">No active brands found.</p>
                        <p className="text-sm mt-1">Please check back later.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-6">
                        {brands.map((brand: IBrand, index: number) => (
                            <Link
                                href={`/brands/${brand.slug}`}
                                key={brand._id ? String(brand._id) : index}
                                className="group flex flex-col items-center gap-3"
                            >
                                <div className="w-full bg-white rounded-[14px] lg:rounded-[18px] flex items-center justify-center p-6 h-[160px] lg:h-[230px] md:h-[180px] relative shadow-[0_8px_25px_rgba(0,0,0,0.05)] group-hover:shadow-[0_15px_35px_rgba(0,0,0,0.1)] transition-all duration-300 group-hover:scale-105 overflow-hidden block">
                                    <div className="relative w-[100%] h-[100%]">
                                        <Image
                                            src={process.env.NEXT_PUBLIC_GCORE_CDN_URL + "/" + brand.logo}
                                            alt={brand.name}
                                            fill
                                            className="object-contain"
                                        // unoptimized={true}
                                        />
                                    </div>
                                </div>
                                <span className="text-xl font-bold text-center text-gray-900 group-hover:text-black transition-colors">{brand.name}</span>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
