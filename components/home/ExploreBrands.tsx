
import Image from "next/image";
import Link from "next/link";
import { connectDB } from "@/src/lib/mongoose";
import { Brand } from "@/src/models/Brand";
interface IBrand {
    _id: string;
    slug: string;
    logo: string;
    name: string;
}

export default async function ExploreBrands() {
    await connectDB();
    const brands = await Brand.find({ isActive: true }).sort({ order: 1, createdAt: -1 }).lean();

    return (
        <section id="brands" className="w-full bg-[var(--background)] py-20 ">
            <div className="max-w-3xl mx-auto px-4 sm:px-6">
                <h2 className="text-[26px] md:text-[32px] font-bold text-center mb-7 text-black">Explore Our Brands</h2>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 mb-6">
                    {brands.map((brand: IBrand, index: number) => (
                        <Link
                            href={`/brands/${brand.slug}`}
                            key={brand._id ? String(brand._id) : index}
                            className="group flex flex-col items-center gap-3 w-full"
                        >
                            <div className="w-full bg-white rounded-[20px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] group-hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 group-hover:scale-[1.02] flex flex-col items-center justify-center p-5 aspect-square">
                                <div className="relative w-full h-full">
                                    <Image
                                        src={process.env.NEXT_PUBLIC_GCORE_CDN_URL + "/" + brand.logo}
                                        alt={brand.name}
                                        fill
                                        className="object-contain rounded-lg"
                                    />
                                </div>
                            </div>
                            <span className="text-[17px] md:text-[20px] font-bold text-center text-black group-hover:text-gray-700 transition-colors duration-300">
                                {brand.name}
                            </span>
                        </Link>
                    ))}
                </div>

                <div className="flex justify-center mt-6">
                    <Link href="/brands" className="px-32 py-2 rounded-full border-2 border-black text-black font-bold text-[15px] hover:bg-black hover:text-white transition-colors duration-300">
                        View All
                    </Link>
                </div>
            </div>
        </section>
    )
}
