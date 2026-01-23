import Link from "next/link";
import Image from "next/image";
import { connectDB } from "@/src/lib/mongoose";
import { Brand } from "@/src/models/Brand";

export const dynamic = "force-dynamic";

export default async function BrandsPage() {
    await connectDB();
    const brands = await Brand.find({ isActive: true }).lean();

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
                        {brands.map((brand: any, index: number) => (
                            <Link
                                href={`/brands/${brand.slug}`}
                                key={brand._id ? String(brand._id) : index}
                                className="group bg-white rounded-[14px] lg:rounded-[18px] flex items-center justify-center p-6 h-[160px] lg:h-[230px] md:h-[180px] relative shadow-[0_8px_25px_rgba(0,0,0,0.05)] hover:shadow-[0_15px_35px_rgba(0,0,0,0.1)] transition-all duration-300 hover:scale-105 overflow-hidden block"
                            >
                                <div className="relative w-[100%] h-[100%]">
                                    <Image
                                        src={process.env.NEXT_PUBLIC_GCORE_CDN_URL + "/" + brand.logo}
                                        alt={brand.name}
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
