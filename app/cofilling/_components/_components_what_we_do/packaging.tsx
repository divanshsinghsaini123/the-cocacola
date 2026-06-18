


import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useGetExtraDataQuery } from "@/src/store/slices/api";
import { getStrapiMediaUrl } from "@/src/lib/strapi-media";

interface PackagingProps {
    data?: {
        heading?: string;
        card?: {
            id: number;
            tittle: string;
            image?: { url?: string };
        }[];
    };
}

export default function Packaging({ data: strapiData }: PackagingProps) {
    const { data, error } = useGetExtraDataQuery();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const stickyNav = isMounted ? data?.data?.StickyNavbar : false;
    const cards = strapiData?.card || [];

    return (
        <div className="w-full relative flex flex-col items-center bg-black pb-20">
            {/* Section Background */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <Image
                    src="/assets/Coffiling_page/BG1-4.png"
                    alt="Packaging Background"
                    fill
                    className="object-cover"
                />
            </div>

            {/* Header */}
            <div
                className="w-full bg-[#8B0000] py-3 text-center mb-12 sticky z-30 shadow-md md:shadow-none transition-all duration-300"
                style={{ top: stickyNav ? '80px' : '0px' }}
            >
                <h3 className="text-white text-xl md:text-2xl font-bold uppercase tracking-widest">
                    {strapiData?.heading || "PACKAGING"}
                </h3>
            </div>

            {/* Container for Cards */}
            <div className="w-full max-w-[1200px] mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-white relative z-10">
                {cards.map((card, index) => (
                    <div key={card.id || index} className="w-full border border-[#E51D29] rounded-[24px] bg-gradient-to-b from-black/80 to-[#1a0505]/80 relative overflow-visible flex flex-col pt-12 pb-6 px-4 backdrop-blur-sm min-h-[350px]">
                        {/* Card Header Title */}
                        <div className="absolute -top-4 left-0 right-0 z-20 flex justify-center">
                            <div className="bg-[#E51D29] py-1 px-12 skew-x-[-20deg] shadow-[0_4px_8px_rgba(229,29,41,0.5)]">
                                <h4 className="text-white text-base md:text-lg font-black italic uppercase skew-x-[20deg] tracking-wider whitespace-nowrap">
                                    {card.tittle}
                                </h4>
                            </div>
                        </div>

                        {/* Card Image */}
                        {card.image?.url && (
                            <div className="relative w-full aspect-[4/3] flex justify-center items-center grow mt-4">
                                <Image
                                    src={getStrapiMediaUrl(card.image.url)}
                                    alt={card.tittle}
                                    fill
                                    className="object-contain rounded-2xl"
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Footer Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-12 mb-8 relative z-10 w-full">
                <button
                    onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                    className="px-10 py-3 bg-[#E51D29] text-white text-base font-bold uppercase tracking-wider rounded-2xl transition-colors hover:bg-red-700 min-w-[200px]">
                    GET IN TOUCH
                </button>
                <button
                    onClick={() => window.scrollBy({ top: window.innerHeight, behavior: 'smooth' })}
                    className="px-10 py-3 bg-white text-black text-base font-bold uppercase tracking-wider rounded-2xl transition-colors hover:bg-gray-200 min-w-[200px]">
                    FIND OUT MORE
                </button>
            </div>
        </div>
    );
}