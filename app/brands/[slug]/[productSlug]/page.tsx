
import Image from "next/image";
import { notFound } from "next/navigation";
import { connectDB } from "@/src/lib/mongoose";
import { Product } from "@/src/models/Product";
import { Brand } from "@/src/models/Brand";
import StoreCarousel from "./_components/StoreCarousel";

interface ProductPageProps {
    params: Promise<{
        slug: string;
        productSlug: string;
    }>;
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
    const { slug, productSlug } = await params;
    await connectDB();

    // 1. Find Brand first to ensure valid URL context
    const brand = await Brand.findOne({ slug, isActive: true }).select("_id name slug logo socialLinks").lean();
    if (!brand) notFound();

    // 2. Find Product matching slug and brand
    const product = await Product.findOne({
        slug: productSlug,
        brand: brand._id,
        isActive: true
    }).populate("stores").lean();

    if (!product) notFound();

    return (
        <main className="min-h-screen bg-[#EEEEEE] pb-20">
            {/* Header / Logo Section */}
            <div className="w-full bg-white py-6 border-b border-gray-100 flex justify-center">
                <div className="relative w-[48px] h-[48px]">
                    <Image
                        src={brand.logo}
                        alt={`${brand.name} logo`}
                        fill
                        className="object-contain"
                        priority
                    />
                </div>
            </div>



            {/* Main Content Container 1120px width */}
            <div className="max-w-[1120px] mx-auto px-4 md:px-0 py-12">
                <h2 className="text-[38px] font-bold text-center mb-8 text-black">Products</h2>

                <div className="flex flex-col lg:flex-row justify-between gap-12 lg:gap-10">

                    {/* Left Column: Image Container 544x544 */}
                    <div className="w-full lg:w-[544px] h-[544px] bg-white rounded-[20px] flex items-center justify-center shadow-sm relative">

                        <div className="relative w-full h-full transition-transform duration-500 hover:scale-105">
                            <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-contain rounded-[20px]"
                                priority
                            />
                        </div>
                    </div>

                    {/* Right Column: Content 480px width */}
                    <div className="w-full lg:w-[450px] flex flex-col pt-2 md:mr-6">
                        <h1 className="text-[30px] font-bold text-black mb-1 leading-tight">
                            {product.name}
                        </h1>

                        <div className="text-base text-gray-800 leading-normal mb-6 space-y-2">
                            <p>{product.description || product.summary}</p>

                            {/* Sizes Section formatted as text */}
                            {product.sizesAvailable && product.sizesAvailable.length > 0 && (
                                <div className="mt-4">
                                    <p className="font-medium mb-1">It comes in following sizes :</p>
                                    <p className="text-gray-700">
                                        {product.sizesAvailable.join(", ")}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Nutrition Accordion */}
                        <div className="border-t-2 border-b-2 border-black">
                            <details className="group">
                                <summary className="flex cursor-pointer list-none items-center justify-between py-4 font-bold text-m text-black">
                                    <span>Show Nutritional Facts</span>
                                    <span className="transition group-open:rotate-180">
                                        <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24">
                                            <path d="M6 9l6 6 6-6"></path>
                                        </svg>
                                    </span>
                                </summary>
                                <div className="text-black p-4 animate-in fade-in slide-in-from-top-1 duration-300 bg-white rounded-b-xl">
                                    {product.nutrition ? (
                                        <div className="space-y-3 pt-2 px-3">
                                            {/* Header */}
                                            <div className="space-y-4">
                                                <h3 className="text-[28px] font-bold leading-tight">Nutritional Information</h3>
                                                <div className="flex justify-between items-end text-sm font-bold">
                                                    <span>Per {product.nutrition.quantity || "100ml"}</span>

                                                </div>
                                                <hr className="border-gray-300 border-[3.2px]" />
                                            </div>

                                            {/* Data Rows */}
                                            <div className="space-y-1 text-[16px]">
                                                {/* Nutrients */}
                                                {product.nutrition.nutritionfacts?.map((fact: any, idx: number) => (
                                                    <div key={idx} className="flex justify-between items-center font-bold">
                                                        <span>{fact.key.name}</span>
                                                        <span className="font-normal">{fact.key.amount}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            <hr className="border-gray-300 border-[1.5px] mt-[-1px]" />

                                            <div className="text-right text-xs font-medium">
                                                * Based on 2000kcal Diet
                                            </div>

                                            <hr className="border-gray-300 border-[1.5px] mt-[-1px]" />
                                            {/* Ingredients */}
                                            {product.nutrition.ingredients && (
                                                <div className="space-y-2">
                                                    <h4 className="text-[17px] font-bold">Ingredients</h4>
                                                    <p className="text-[16px] leading-[1.6] font-normal">
                                                        {product.nutrition.ingredients}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <p className="py-4">No nutritional information available.</p>
                                    )}
                                </div>
                            </details>
                        </div>
                    </div>

                </div>
            </div>
            {/* Available Stores (If any) */}
            {product.stores && product.stores.length > 0 && (
                <StoreCarousel stores={JSON.parse(JSON.stringify(product.stores))} />
            )}

            {/* Follow Section */}
            <div className="max-w-[1120px] mx-auto px-4 md:px-0 mb-20 md:mt-25">
                <div className="w-full bg-black rounded-[15px] py-7 px-8 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
                    <h2 className="text-white text-[28px] md:text-[32px] font-bold tracking-tight">Follow {brand.name}</h2>
                    <div className="flex gap-4">
                        {[
                            { name: 'facebook', path: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z", link: brand.socialLinks?.facebook },
                            { name: 'x', path: "M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z", link: brand.socialLinks?.x },
                            { name: 'instagram', path: "M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z M17.5 6.5h.01 M16 2H8a4 4 0 0 0-4 4v8a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4V6a4 4 0 0 0-4-4z", link: brand.socialLinks?.instagram },
                            { name: 'youtube', path: "M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z M9.75 15.02l5.75-3.27-5.75-3.27z", link: brand.socialLinks?.youtube }
                        ]
                            .filter(icon => icon.link)
                            .map((icon) => (
                                <a
                                    key={icon.name}
                                    href={icon.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-8 h-8 md:w-10 md:h-10 border border-white rounded-full flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill={icon.name === 'youtube' || icon.name === 'x' || icon.name === 'facebook' ? "currentColor" : "none"}
                                        stroke={icon.name === 'youtube' || icon.name === 'x' || icon.name === 'facebook' ? "none" : "currentColor"}
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d={icon.path} />
                                    </svg>
                                </a>
                            ))}
                    </div>
                </div>
                {product.summary && (
                    <p className="mt-12 text-m text-black font-medium uppercase text-center md:text-left leading-relaxed tracking-wide">
                        {product.summary}
                    </p>
                )}
            </div>

        </main >
    );
}

