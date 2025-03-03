"use client";

import React from "react";
import Image from "next/image";
import { Pill, BookOpen, Ban, CandyOff } from "lucide-react"; // Fallback icons

export interface ProductProps {
    title: string;
    subtitle?: string;
    layout: "left" | "right"; // image position
    backgroundImage: string;
    productImage: string;
    totalColumns: 1 | 2;
    flavours: {
        title?: string;
        columnsNumber: 1 | 2;
        items: string[];
    }[];
    features: {
        icon: string | React.ReactNode;
        text: string;
    }[];
    subFeatures: {
        icon: string | React.ReactNode;
        text: string;
    }[];
}

const ProductComponent: React.FC<ProductProps> = ({
    title,
    subtitle = "choose your flavour",
    layout,
    backgroundImage,
    productImage,
    totalColumns,
    flavours,
    features,
    subFeatures
}) => {
    return (
        <section className="relative w-full md:min-h-[750px] flex items-center justify-center overflow-hidden pt-16 pb-10 bg-black">
            {/* Background */}
            <div className={`absolute inset-0 w-full h-full z-0`}>
                <Image
                    src={backgroundImage}
                    alt="Background"
                    fill
                    className="object-cover md:opacity-100 opacity-50"
                />
            </div>

            <div className={`relative z-10 w-full max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center md:gap-30 gap-10 ${layout === 'right' ? 'md:flex-row-reverse' : ''}`}>

                {/* Product Image Side */}
                <div className="w-full md:w-1/2 flex justify-center">
                    <div className="relative w-[300px] md:w-[450px] aspect-[3/4]">
                        <Image
                            src={productImage}
                            alt={title}
                            fill
                            className="object-contain"
                        />
                    </div>
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
                        {/* {flavours.map((group, groupIndex) => ( */}
                        <div className={`grid gap-x-2 gap-y-1 ${totalColumns === 2 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                            {flavours.map((group, groupIndex) => (
                                <div key={groupIndex} className="flex flex-col gap-2">
                                    {group.title && <h4>{group.title}</h4>}
                                    {group.items.map((flavor, flavorIndex) => (

                                        <div
                                            key={flavorIndex}
                                            className="relative bg-[#a6192e] text-white py-1 px-8 font-bold text-sm hover:bg-[#c41e3a] transition-colors cursor-default flex items-center shadow-sm min-h-[36px]"
                                            style={{
                                                clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 15px 50%)",
                                                borderRadius: "0 20px 20px 0"
                                            }}
                                        >
                                            <span className="block drop-shadow-sm ml-2">{flavor}</span>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                        {/* ))} */}
                    </div>

                    {/* Features & Subfeatures */}
                    <div className="flex flex-col gap-10">
                        {/* Main Features */}
                        <div className="flex gap-6 md:gap-12 justify-start flex-wrap">
                            {features.map((feature, i) => (
                                <div key={i} className="flex flex-col items-center text-center md:gap-3 gap-0 group">
                                    <div className="w-16 h-16 relative flex items-center justify-center border-2 border-white/20 rounded-xl p-3 bg-black/20 backdrop-blur-sm group-hover:border-[#E51D29] transition-colors">
                                        {typeof feature.icon === 'string' ? (
                                            <div className="relative md:w-full md:h-full w-[50%] h-[50%]">
                                                <Image src={process.env.NEXT_PUBLIC_STRAPICONTENT_PREFIX + feature.icon} alt={feature.text} fill className="object-contain invert" />
                                            </div>
                                        ) : (
                                            <div className="text-white md:w-full md:h-full w-[70%] h-[70%] [&>svg]:w-full [&>svg]:h-full">
                                                {feature.icon}
                                            </div>
                                        )}
                                    </div>
                                    <span className="font-bold text-[10px] md:text-base max-w-[100px] leading-tight text-shadow-sm">
                                        {feature.text}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Sub Features */}
                        <div className="flex gap-6 md:gap-12 border-t border-white/20 pt-8 w-full flex-wrap">
                            {subFeatures.map((sub, i) => (
                                <div key={i} className="flex items-center gap-4 group">
                                    <div className="w-8 h-8 relative text-[#E51D29]">
                                        {typeof sub.icon === 'string' ? (
                                            <Image src={process.env.NEXT_PUBLIC_STRAPICONTENT_PREFIX + sub.icon} alt={sub.text} fill className="object-contain" />
                                        ) : (
                                            <div className="w-full h-full [&>svg]:w-full [&>svg]:h-full">
                                                {sub.icon}
                                            </div>
                                        )}
                                    </div>
                                    <span className="font-bold uppercase text-xs md:text-base opacity-90 group-hover:opacity-100 transition-opacity">
                                        {sub.text}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProductComponent;
