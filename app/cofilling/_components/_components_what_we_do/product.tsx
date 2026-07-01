"use client";

import React from "react";
import Image from "next/image";
import ProductComponent, { ProductProps } from "./__components/product_componet";
import { productsData } from "../../_data/products_data";
import { getStrapiMediaUrl } from "@/src/lib/strapi-media";

interface ProductSectionProps {
    data?: {
        productcard?: any[];
        productFooter?: {
            title?: string;
            heading?: string;
            item?: { line: string }[];
            backgroundimage?: { url?: string };
        };
    };
}

const Product: React.FC<ProductSectionProps> = ({ data }) => {
    const products: ProductProps[] = data?.productcard && data.productcard.length > 0
        ? data.productcard.map((card: any) => {
            const flavorGroups = [];
            if (card.flavours?.column1?.items?.length > 0) {
                flavorGroups.push({
                    title: card.flavours.column1.tittle || "",
                    columnsNumber: 1 as const,
                    items: card.flavours.column1.items.map((it: any) => it.item)
                });
            }
            if (card.flavours?.column2?.items?.length > 0) {
                flavorGroups.push({
                    title: card.flavours.column2.tittle || "",
                    columnsNumber: 2 as const,
                    items: card.flavours.column2.items.map((it: any) => it.item)
                });
            }

            const layout = (card.layout || "left") as "left" | "right";
            const imageUrl = getStrapiMediaUrl(card.productImage?.url) || "";

            return {
                title: card.title,
                subtitle: card.subtitle || "choose your flavour",
                layout,
                backgroundImage: imageUrl,
                productImage: imageUrl,
                totalColumns: flavorGroups.length === 2 ? 2 : 1,
                flavours: flavorGroups,
                features: card.features ? card.features.map((f: any) => ({ text: f.item })) : [],
                subFeatures: card.subFeatures ? card.subFeatures.map((sf: any) => ({ text: sf.item })) : []
            };
        })
        : (() => {
            return productsData.map((prod) => {
                return {
                    ...prod,
                    backgroundImage: prod.productImage,
                    features: prod.features.map(f => ({ text: f.text })),
                    subFeatures: prod.subFeatures.map(sf => ({ text: sf.text }))
                };
            });
        })();

    const footerData = {
        title: data?.productFooter?.title || "YOU DON'T HAVE A BRAND?",
        heading: data?.productFooter?.heading || "TAKE ONE OF THESE!",
        items: data?.productFooter?.item && data.productFooter.item.length > 0
            ? data.productFooter.item.map((it: any) => it.line)
            : ["ZYGRA", "SLANG", "ROUZED", "PLAGE"],
        backgroundImage: getStrapiMediaUrl(data?.productFooter?.backgroundimage?.url) || "/assets/Coffiling_page/zygra_ENERGY_DRINK_portfolio-1.png"
    };

    return (
        <div className="w-full flex flex-col items-center">
            {/* PRODUCT Header */}
            <div className="w-full bg-[#8B0000] py-3 text-center sticky md:relative z-30 shadow-md md:shadow-none transition-all duration-300">
                <h3 className="text-white text-xl md:text-2xl font-bold uppercase tracking-widest">
                    PRODUCTS
                </h3>
            </div>

            {/* Main Product Display Loop */}
            {products.map((product, index) => (
                <ProductComponent key={index} {...product} />
            ))}

            {/* PRODUCT Footer */}
            <div className="w-full h-[813px] relative flex flex-col items-center justify-center text-center overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src={footerData.backgroundImage}
                        alt="Footer Background"
                        fill
                        className="object-cover"
                    />
                    <div className="absolute inset-0" />
                </div>

                <div className="relative z-10 flex flex-col items-center gap-10 px-4">
                    <div className="flex flex-col gap-3">
                        <h3 className="text-white text-2xl md:text-3xl font-bold italic uppercase tracking-wider">
                            {footerData.title}
                        </h3>
                        <h2 className="text-white text-3xl md:text-5xl font-black italic uppercase tracking-wider">
                            {footerData.heading}
                        </h2>
                    </div>

                    <div className="flex flex-wrap justify-center gap-4 md:gap-12 text-white/80 font-bold text-lg md:text-xl uppercase tracking-widest my-4">
                        {footerData.items.map((item, idx) => (
                            <span key={idx}>{item}</span>
                        ))}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-4">
                        <button
                            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                            className="px-10 py-3 bg-[#E51D29] text-white text-base font-bold uppercase tracking-wider rounded-2xl transition-colors hover:bg-red-700 min-w-[200px]">
                            Get In Touch
                        </button>
                        <button
                            onClick={() => window.scrollBy({ top: window.innerHeight, behavior: 'smooth' })}
                            className="px-10 py-3 bg-white text-black text-base font-bold uppercase tracking-wider rounded-2xl transition-colors hover:bg-gray-200 min-w-[200px]">
                            Find Out More
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Product;

