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
    flavours: {
        columns: 1 | 2;
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
    flavours,
    features,
    subFeatures
}) => {
    return (
        <section className="relative w-full min-h-[700px] flex items-center justify-center overflow-hidden py-16 bg-black">
            {/* Background */}
            <div className="absolute inset-0 w-full h-full z-0">
                <Image
                    src={backgroundImage}
                    alt="Background"
                    fill
                    className="object-cover opacity-80"
                />
                {/* Gradient Overlay for better readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent z-0"></div>
            </div>

            <div className={`relative z-10 w-full max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center gap-30 ${layout === 'right' ? 'md:flex-row-reverse' : ''}`}>

                {/* Product Image Side */}
                <div className="w-full md:w-1/2 flex justify-center">
                    <div className="relative w-[300px] md:w-[450px] aspect-[3/4] transition-transform duration-500 ">
                        <Image
                            src={productImage}
                            alt={title}
                            fill
                            className="object-contain drop-shadow-2xl"
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
                        {flavours.map((group, groupIndex) => (
                            <div key={groupIndex} className={`grid gap-x-2 gap-y-1 ${group.columns === 2 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                                {group.items.map((item, i) => (
                                    <div
                                        key={i}
                                        className="relative bg-[#a6192e] text-white py-1 px-8 font-bold text-sm hover:bg-[#c41e3a] transition-colors cursor-default flex items-center shadow-sm min-h-[36px]"
                                        style={{
                                            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 15px 50%)",
                                            borderRadius: "0 20px 20px 0"
                                        }}
                                    >
                                        <span className="block drop-shadow-sm ml-2">{item}</span>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>

                    {/* Features & Subfeatures */}
                    <div className="flex flex-col gap-10">
                        {/* Main Features */}
                        <div className="flex gap-16 justify-start">
                            {features.map((feature, i) => (
                                <div key={i} className="flex flex-col items-center text-center gap-3 group">
                                    <div className="w-16 h-16 relative flex items-center justify-center border-2 border-white/20 rounded-xl p-3 bg-black/20 backdrop-blur-sm group-hover:border-[#E51D29] transition-colors">
                                        {typeof feature.icon === 'string' ? (
                                            <Image src={feature.icon} alt={feature.text} fill className="object-contain invert" />
                                        ) : (
                                            <div className="text-white w-full h-full [&>svg]:w-full [&>svg]:h-full">
                                                {feature.icon}
                                            </div>
                                        )}
                                    </div>
                                    <span className="font-bold uppercase text-sm md:text-base max-w-[100px] leading-tight text-shadow-sm">
                                        {feature.text}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Sub Features */}
                        <div className="flex gap-12 border-t border-white/20 pt-8 w-full">
                            {subFeatures.map((sub, i) => (
                                <div key={i} className="flex items-center gap-4 group">
                                    <div className="w-8 h-8 relative text-[#E51D29]">
                                        {typeof sub.icon === 'string' ? (
                                            <Image src={sub.icon} alt={sub.text} fill className="object-contain" />
                                        ) : (
                                            <div className="w-full h-full [&>svg]:w-full [&>svg]:h-full">
                                                {sub.icon}
                                            </div>
                                        )}
                                    </div>
                                    <span className="font-bold uppercase text-sm md:text-base opacity-90 group-hover:opacity-100 transition-opacity">
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
