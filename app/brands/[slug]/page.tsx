
import Image from "next/image";
import { notFound } from "next/navigation";
import { connectDB } from "@/src/lib/mongoose";
import { Brand } from "@/src/models/Brand";
import { Product } from "@/src/models/Product";
import Link from "next/link";

interface BrandPageProps {
    params: Promise<{
        slug: string;
    }>;
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
        <main className="min-h-screen bg-white">
            {/* Header / Logo Section */}
            <div className="w-full bg-white py-8 border-b border-gray-100 flex justify-center">
                <div className="relative w-40 h-20">
                    <Image
                        src={brand.logo}
                        alt={`${brand.name} logo`}
                        fill
                        className="object-contain"
                        priority
                    />
                </div>
            </div>

            {/* Hero / Carousel Section */}
            {brand.images && brand.images.length > 0 ? (
                <div className="w-full h-[300px] md:h-[500px] relative bg-black">
                    {/* For now displaying the first image as hero, can be improved to a real carousel */}
                    <Image
                        src={brand.images[0]}
                        alt={`${brand.name} banner`}
                        fill
                        className="object-cover opacity-90"
                    />
                    {/* Overlay Text (Optional, based on design) */}
                    {/* <div className="absolute inset-0 flex items-center justify-center">
                        <h1 className="text-white text-4xl font-bold uppercase tracking-wider">{brand.name}</h1>
                     </div> */}
                </div>
            ) : (
                // Fallback if no gallery images
                <div className="w-full h-[300px] bg-gray-900 flex items-center justify-center">
                    <h1 className="text-white text-4xl font-bold">{brand.name}</h1>
                </div>
            )}


            {/* Content Section */}
            <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">

                {/* Descriptions */}
                {(brand.descriptions?.d1 || brand.descriptions?.d2 || brand.descriptions?.d3) && (
                    <div className="max-w-4xl mx-auto text-center space-y-6">
                        {brand.descriptions?.d1 && <p className="text-lg md:text-xl leading-relaxed text-gray-800">{brand.descriptions.d1}</p>}
                        {brand.descriptions?.d2 && <p className="text-base text-gray-600 leading-relaxed">{brand.descriptions.d2}</p>}
                        {brand.descriptions?.d3 && <p className="text-base text-gray-600 leading-relaxed">{brand.descriptions.d3}</p>}
                    </div>
                )}


                {/* Products Section */}
                {products.length > 0 && (
                    <div className="space-y-8">
                        <h2 className="text-3xl font-bold text-center">Our Products</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                            {products.map((product: any) => (
                                <Link href={`/brands/${slug}/${product.slug}`} key={String(product._id)} className="group cursor-pointer">
                                    <div className="bg-[#f4f4f4] rounded-2xl p-6 aspect-square relative mb-4 transition-transform duration-300 group-hover:-translate-y-1">
                                        <Image
                                            src={product.image}
                                            alt={product.name}
                                            fill
                                            className="object-contain p-4 mix-blend-multiply"
                                        />
                                    </div>
                                    <h3 className="font-bold text-lg text-center text-gray-900 group-hover:underline">{product.name}</h3>
                                    {product.sizesAvailable?.length > 0 && (
                                        <p className="text-xs text-center text-gray-500 mt-1">{product.sizesAvailable.join(", ")}</p>
                                    )}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Youtube Videos */}
                {brand.youtubeVideos && brand.youtubeVideos.length > 0 && (
                    <div className="space-y-8">
                        <h2 className="text-3xl font-bold text-center">Featured Videos</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {brand.youtubeVideos.map((video: string, idx: number) => {
                                // Extract Video ID if possible, purely for key. 
                                // Assuming embed URLs are provided as per form placeholder
                                return (
                                    <div key={idx} className="aspect-video rounded-xl overflow-hidden bg-black shadow-lg">
                                        <iframe
                                            src={video}
                                            className="w-full h-full"
                                            allowFullScreen
                                            title={`Brand Video ${idx}`}
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        />
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}

            </div>

            {/* Social Footer for Brand */}
            <div className="bg-black text-white py-12">
                <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-6">
                    <div className="relative w-24 h-12 grayscale brightness-200">
                        <Image src={brand.logo} alt="brand logo footer" fill className="object-contain" />
                    </div>

                    <div className="flex gap-6">
                        {Object.entries(brand.socialLinks || {}).map(([platform, link]) => {
                            if (!link) return null;
                            return (
                                <a
                                    key={platform}
                                    href={link as string}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-400 hover:text-white uppercase text-sm font-bold tracking-widest transition-colors"
                                >
                                    {platform}
                                </a>
                            )
                        })}
                    </div>
                    <p className="text-gray-500 text-xs">© {new Date().getFullYear()} The Coca-Cola Company. All rights reserved.</p>
                </div>
            </div>

        </main>
    );
}
