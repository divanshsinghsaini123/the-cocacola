
import Image from "next/image";
import Link from "next/link";
import { connectDB } from "@/src/lib/mongoose";
import { Brand } from "@/src/models/Brand";
export default async function ExploreBrands() {
    await connectDB();
    const brands = await Brand.find({ isActive: true }).lean();

    return (
        <section className="w-full bg-[#EEEEEE] py-20 ">
            <div className="max-w-3xl mx-auto px-4 sm:px-6">
                <h2 className="text-[26px] md:text-[32px] font-bold text-center mb-7 text-black">Explore Our Brands</h2>

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

                <div className="flex justify-center mt-6">
                    <Link href="/brands" className="px-32 py-2 rounded-full border-2 border-black text-black font-bold text-[15px] hover:bg-black hover:text-white transition-colors duration-300">
                        View All
                    </Link>
                </div>
            </div>
        </section>
    )
}
