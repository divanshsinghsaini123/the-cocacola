
import type { Metadata, ResolvingMetadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { connectDB } from "@/src/lib/mongoose";
import { Brand } from "@/src/models/Brand";
import { Product } from "@/src/models/Product";
import Link from "next/link";
import BrandImageCarousel from "./_components/BrandImageCarousel";
import BrandVideoCarousel from "./_components/BrandVideoCarousel";

export const dynamic = "force-dynamic";

interface IProduct {
    _id: string;
    slug: string;
    name: string;
    images: string[];
}

interface BrandPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateMetadata(
    { params }: BrandPageProps,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const { slug } = await params
    await connectDB();

    const brand = await Brand.findOne({ slug, isActive: true }).lean();

    if (!brand) return { title: "Brand Not Found" };

    // optionally access and extend (rather than replace) parent metadata
    const previousImages = (await parent).openGraph?.images || []

    return {
        title: `${brand.name} | Cloud9 Beverages`,
        description: brand.descriptions?.d1 || `Discover details about ${brand.name} from Cloud9 Beverages.`,
        openGraph: {
            images: [process.env.NEXT_PUBLIC_GCORE_CDN_URL + "/" + brand.logo, ...previousImages],
        },
    }
}

export default async function BrandDetailPage({ params }: BrandPageProps) {
    const { slug } = await params;
    await connectDB();

    const brand = await Brand.findOne({ slug, isActive: true }).lean();

    if (!brand) {
        notFound();
    }

    // Fetch related products
    const products = await Product.find({ brand: brand._id, isActive: true }).lean();

    return (
        <main className="min-h-screen bg-[#EEEEEE]">
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



            {/* Hero / Carousel Section */}
            {brand.images && brand.images.length > 0 ? (
                <div className="w-full py-6">
                    <BrandImageCarousel images={brand.images} />
                </div>
            ) : (
                // Fallback if no gallery images
                <div className="w-full h-[300px] bg-gray-900 flex items-center justify-center">
                    <h1 className="text-white text-4xl font-bold">{brand.name}</h1>
                </div>
            )}


            {/* Content Section */}
            <div className="max-w-6xl mx-auto px-6 space-y-12">
                {/* Products Section */}
                {products.length > 0 && (
                    <div className="space-y-6">
                        <h2 className="text-[36px] font-bold text-center tracking-tight">Products</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 justify-center max-w-[800px] mx-auto">
                            {products.map((product: IProduct) => (
                                <Link
                                    href={`/brands/${slug}/${product.slug}`}
                                    key={String(product._id)}
                                    className="group flex flex-col items-center gap-3"
                                >
                                    <div className="w-full bg-white rounded-[20px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] group-hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 group-hover:scale-[1.02] flex flex-col items-center justify-center p-5 aspect-square">
                                        <div className="relative w-full h-full">
                                            <Image
                                                src={process.env.NEXT_PUBLIC_GCORE_CDN_URL + "/" + (product.images?.[0] || "")}
                                                alt={product.name}
                                                fill
                                                className="object-contain rounded-lg"
                                            />
                                        </div>
                                    </div>
                                    <span className="text-lg font-medium text-center text-gray-900 group-hover:text-black transition-colors">{product.name}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Video Carousel Section */}
                {brand.youtubeVideos && brand.youtubeVideos.length > 0 && (
                    <div className="space-y-6">
                        <h2 className="text-[36px] font-bold text-center tracking-tight">Follow the bottle</h2>
                        <BrandVideoCarousel videos={brand.youtubeVideos} />
                    </div>
                )}

                {/* Follow Section (Black Bar) */}
                <div className="w-full bg-black rounded-[20px] py-7 px-8 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
                    <h2 className="text-white text-[20px] md:text-[32px] font-bold tracking-tight">Follow {brand.name}</h2>
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
                                    className="w-8 h-8 md:w-12 md:h-12 border border-white rounded-full flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill={icon.name === 'youtube' || icon.name === 'x' ? "currentColor" : "none"}
                                        stroke={icon.name === 'youtube' || icon.name === 'x' ? "none" : "currentColor"}
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

                {/* Footer Descriptions */}
                {(brand.descriptions?.d1 || brand.descriptions?.d2 || brand.descriptions?.d3) && (
                    <div className="max-w-6xl mx-auto space-y-2 pb-10">
                        {brand.descriptions?.d1 && <p className="text-m font-medium uppercase text-gray-800 leading-relaxed text-center md:text-justify">{brand.descriptions.d1}</p>}
                        {brand.descriptions?.d2 && <p className="text-m font-medium uppercase text-gray-800 leading-relaxed text-center md:text-justify">{brand.descriptions.d2}</p>}
                        {brand.descriptions?.d3 && <p className="text-m font-medium uppercase text-gray-800 leading-relaxed text-center md:text-justify">{brand.descriptions.d3}</p>}
                    </div>
                )}

            </div>



        </main>
    );
}
