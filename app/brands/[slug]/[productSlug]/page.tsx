
import Image from "next/image";
import { notFound } from "next/navigation";
import { connectDB } from "@/src/lib/mongoose";
import { Product } from "@/src/models/Product";
import { Brand } from "@/src/models/Brand";
import { Store } from "@/src/models/store";
import StoreCarousel from "./_components/StoreCarousel";

export const dynamic = "force-dynamic";

interface ProductPageProps {
    params: Promise<{
        slug: string;
        productSlug: string;
    }>;
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
    const { slug, productSlug } = await params;
    await connectDB();
    console.log(Store.modelName); // Ensure Store model is registered
    ////////i am facing issue  here again and again , i don;t know why 
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
                        src={process.env.NEXT_PUBLIC_GCORE_CDN_URL + "/" + brand.logo}
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
                    <div className="w-full lg:w-[544px] aspect-square lg:h-[544px] bg-white rounded-[20px] flex items-center justify-center shadow-sm relative">

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
        </main >
    );
}

