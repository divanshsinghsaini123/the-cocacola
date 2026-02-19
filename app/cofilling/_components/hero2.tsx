"use client";

import React from "react";
import Image from "next/image";

const Hero2 = () => {
    const cards = [
        {
            image: "/assets/Coffiling_page/HELL_CLASSIC_2024_KV_A0_fekvo_prw-2.png",
            title: "PROVEN BRAND PORTFOLIO",
        },
        {
            image: "/assets/Coffiling_page/DJI_0117.png",
            title: "STATE-OF-THE-ART High-Speed Filling Lines",
        },
        {
            image: "/assets/Coffiling_page/DJI_0141.png",
            title: "Automated Warehousing & Own Logistics Network",
        },
        {
            image: "/assets/Coffiling_page/DJI_0168.png",
            title: "Custom Formulation Support",
        },
    ];

    return (
        <section className="relative w-full min-h-[950px] flex flex-col items-center justify-center py-20 px-4 md:px-8 overflow-hidden">
            {/* Background Texture Overlay */}
            <div className="absolute inset-0 w-full h-full z-0">
                <Image
                    src="/assets/Coffiling_page/annie-spratt-6a3nqQ1YwBw-unsplash-.png"
                    alt="Background Texture"
                    fill
                    className="object-cover"
                    priority
                    quality={90}
                />

            </div>

            {/* Top Text Content */}
            <div className="relative z-10 max-w-3xl mx-auto text-center text-white mb-20 space-y-4">
                <p className="text-base md:text-20px opacity-90">
                    The Cloud9 manufacturing complex is one of the region’s most advanced integrated beverage production facilities. The plant operates on 8 high-speed filling lines with a total annual capacity exceeding 6 billion units. Every product passes through more than 100 automated inspection and quality control checkpoints during production. As active beverage brand owners with established products in the market, Cloud9 operates on infrastructure proven by real commercial demand.
                </p>
            </div>

            {/* Image Grid */}
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-[1400px] w-full mb-20">
                {cards.map((card, index) => (
                    <div key={index} className="flex flex-col group">
                        {/* Image Container */}
                        <div className="relative w-full aspect-square bg-gray-800 overflow-hidden">
                            <Image
                                src={card.image}
                                alt={card.title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                        </div>

                        {/* Red Bar with Triangle */}
                        <div className="relative w-full h-2 bg-[#E51D29] mt-0">
                            <div className="absolute left-8 top-full w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-[#E51D29]"></div>
                        </div>

                        {/* Title */}
                        <h3 className="text-white font-black text-xl uppercase mt-6 leading-tight max-w-[90%]">
                            {card.title}
                        </h3>
                    </div>
                ))}
            </div>

            {/* Bottom Buttons */}
            <div className="relative z-10 flex flex-col sm:flex-row gap-6 justify-center items-center mt-auto">
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
        </section>
    );
};

export default Hero2;
