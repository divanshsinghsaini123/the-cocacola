"use client";

import React from "react";
import Image from "next/image";

export interface ProductProps {
    title: string;
    subtitle?: string;
    layout: "left" | "right"; // image position
    backgroundImage: string;
    backgroundImageMobile?: string;
    productImage: string;
    totalColumns: 1 | 2;
    flavours: {
        title?: string;
        columnsNumber: 1 | 2;
        items: string[];
    }[];
    features: {
        text: string;
    }[];
    subFeatures: {
        text: string;
    }[];
}

const ProductComponent: React.FC<ProductProps> = ({
    title,
    subtitle = "choose your flavour",
    layout,
    backgroundImage,
    backgroundImageMobile,
    productImage,
    totalColumns,
    flavours,
    features,
    subFeatures
}) => {
    return (
        <section className="relative w-full md:min-h-[750px] flex items-center justify-center overflow-hidden pt-16 pb-10 bg-black">
            {/* Background */}
            <div className="absolute inset-0 w-full h-full z-0">
                {backgroundImage && (
                    <Image
                        src={backgroundImage}
                        alt="Background"
                        fill
                        className="object-cover opacity-100 hidden md:block"
                    />
                )}
                {(backgroundImageMobile || backgroundImage) && (
                    <Image
                        src={backgroundImageMobile || backgroundImage}
                        alt="Background Mobile"
                        fill
                        className="object-cover opacity-100 block md:hidden"
                    />
                )}
                {/* Fade Breakers */}
                <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-black via-black/60 to-transparent pointer-events-none" />
                <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none" />
            </div>

            <div className={`relative z-10 w-full max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center md:gap-30 gap-10 ${layout === 'left' ? 'md:flex-row-reverse' : ''}`}>

                {/* Product Image Side */}
                <div className="w-full md:w-1/2 flex justify-center">
                    {/* <div className="relative w-[300px] md:w-[450px] aspect-[3/4]">
                        {productImage && (
                            <Image
                                src={productImage}
                                alt={title}
                                fill
                                className="object-contain"
                            />
                        )}
                    </div> */}
                </div>

                {/* Content Side */}
                <div className="w-full md:w-1/3 text-white">
                    <div className="mb-8">
                        <h2 className="text-xl md:text-4xl font-black italic uppercase leading-none mb-2 tracking-tighter shadow-black drop-shadow-lg">
                            {title}
                        </h2>
                        <p className="text-lg md:text-lg font-bold opacity-90">
                            {subtitle}
                        </p>
                    </div>

                    {/* Flavours */}
                    <div className="w-full mb-12">
                        <div className={`grid gap-x-2 gap-y-1 ${totalColumns === 2 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                            {flavours.map((group, groupIndex) => (
                                <div key={groupIndex} className="flex flex-col gap-2">
                                    {group.title && <h4 className="font-bold text-xs uppercase tracking-widest text-red-500 mb-1">{group.title}</h4>}
                                    {group.items.map((flavor, flavorIndex) => (
                                        <div
                                            key={flavorIndex}
                                            className="relative bg-black md:bg-[#a6192e] text-white py-1 px-3 pl-1 md:px-8 font-bold text-sm w-fit md:w-full hover:bg-neutral-800 md:hover:bg-[#c41e3a] transition-colors cursor-default flex items-center shadow-sm min-h-[36px] md:[--clip-path:polygon(0%_0%,100%_0%,100%_100%,0%_100%,15px_50%)] md:[--border-radius:0_20px_20px_0]"
                                            style={{
                                                clipPath: "var(--clip-path, none)",
                                                borderRadius: "var(--border-radius, 26px)"
                                            }}
                                        >
                                            <span className="block drop-shadow-sm ml-2">{flavor}</span>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Features & Subfeatures */}
                    <div className="flex flex-col gap-8">
                        {/* Main Features */}
                        {features && features.length > 0 && (
                            <div className="flex flex-wrap gap-3 justify-start">
                                {features.map((feature, i) => (
                                    <div key={i} className="bg-black/40 border border-white/20 hover:border-[#E51D29] px-4 py-2 rounded-2xl flex items-center text-center transition-colors shadow-md backdrop-blur-sm">
                                        <span className="font-bold text-xs md:text-sm uppercase tracking-wide leading-tight">
                                            {feature.text}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Sub Features */}
                        {subFeatures && subFeatures.length > 0 && (
                            <div className="flex gap-x-6 gap-y-4 border-t border-white/20 pt-6 w-full flex-wrap">
                                {subFeatures.map((sub, i) => (
                                    <div key={i} className="flex items-center gap-2 group">
                                        <span className="text-[#E51D29] text-xl font-bold leading-none select-none">•</span>
                                        <span className="font-bold uppercase text-xs md:text-sm opacity-90 group-hover:opacity-100 transition-opacity">
                                            {sub.text}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProductComponent;

