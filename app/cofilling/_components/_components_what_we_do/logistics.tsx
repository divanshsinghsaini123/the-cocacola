
"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import LogisticsCard, { ProductLogisticsCardProps } from "./__components/logistics_compnent";
import { useGetExtraDataQuery } from "@/src/store/slices/api";

interface logisticprops {
    logistics: ProductLogisticsCardProps[];
};

export default function LogisticsSection({ logistics }: logisticprops) {
    const { data, error } = useGetExtraDataQuery();
    const stickyNav = data?.data?.StickyNavbar;
    const [currentIndex, setCurrentIndex] = useState(0);

    // Auto-scroll logic: Move to next item every 5 seconds
    useEffect(() => {
        if (logistics.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentIndex((current) => current + 1);
        }, 5000);

        return () => clearInterval(interval);
    }, [logistics.length]);

    const handlePrev = () => setCurrentIndex(c => c - 1);
    const handleNext = () => setCurrentIndex(c => c + 1);

    const actualActiveIndex = ((currentIndex % logistics.length) + logistics.length) % logistics.length;

    return (
        <div className="w-full flex flex-col items-center justify-center bg-zinc-900 pb-16 overflow-hidden relative min-h-[800px]">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/assets/Coffiling_page/DJI_0145_black-white-1.png"
                    alt="Background"
                    fill
                    className="w-full h-full object-cover"
                />
            </div>

            {/* LOGISTICS Header */}
            <div className={`w-full bg-[#8B0000] py-3 text-center mb-8 sticky md:relative top-0 md:top-0 z-30 shadow-md md:shadow-none`}>
                <h3 className="text-white text-xl md:text-2xl font-bold uppercase tracking-widest">
                    LOGISTICS
                </h3>
            </div>

            {/* Carousel Container */}
            <div className="w-full max-w-[95%] md:max-w-7xl px-2 relative z-10 h-[600px] flex justify-center items-center">

                {/* Navigation Buttons (Static) */}
                {logistics.length > 1 && (
                    <>
                        <button
                            onClick={handlePrev}
                            className="absolute left-[5px] md:left-[40px] top-1/2 -translate-y-1/2 z-50 p-1 md:p-2 hover:bg-white/10 rounded-full transition-colors"
                        >
                            <ChevronLeft className="w-8 h-8 md:w-16 md:h-16 text-white" />
                        </button>
                        <button
                            onClick={handleNext}
                            className="absolute right-[5px] md:right-[40px] top-1/2 -translate-y-1/2 z-50 p-1 md:p-2 hover:bg-white/10 rounded-full transition-colors"
                        >
                            <ChevronRight className="w-8 h-8 md:w-16 md:h-16 text-white" />
                        </button>
                    </>
                )}

                <div className="relative w-full h-full flex justify-center items-center overflow-hidden">
                    {logistics.length === 1 ? (
                        <div className="absolute top-1/2 left-1/2 w-full max-w-[600px] transition-all duration-700 ease-in-out transform opacity-100 scale-100 z-30 -translate-x-1/2 translate-y-[-50%]">
                            <div className="relative w-full">
                                <LogisticsCard title={logistics[0].title} sections={logistics[0].sections} />
                            </div>
                        </div>
                    ) : (
                        [-2, -1, 0, 1, 2].map((offset) => {
                            const vIndex = currentIndex + offset;
                            const dataIndex = ((vIndex % logistics.length) + logistics.length) % logistics.length;
                            const item = logistics[dataIndex];

                            let positionClass = "";
                            if (offset === 0) {
                                positionClass = "opacity-100 scale-100 z-30 -translate-x-1/2 translate-y-[-50%]";
                            } else if (offset === -1) {
                                positionClass = "opacity-40 scale-75 z-20 -translate-x-[160%] translate-y-[-50%] cursor-pointer";
                            } else if (offset === 1) {
                                positionClass = "opacity-40 scale-75 z-20 translate-x-[60%] translate-y-[-50%] cursor-pointer";
                            } else if (offset < -1) {
                                positionClass = "opacity-0 scale-50 z-10 -translate-x-[250%] translate-y-[-50%] pointer-events-none";
                            } else if (offset > 1) {
                                positionClass = "opacity-0 scale-50 z-10 translate-x-[150%] translate-y-[-50%] pointer-events-none";
                            }

                            return (
                                <div
                                    key={vIndex}
                                    onClick={() => {
                                        if (offset === -1) handlePrev();
                                        if (offset === 1) handleNext();
                                    }}
                                    className={`absolute top-1/2 left-1/2 w-full max-w-[600px] transition-all duration-700 ease-in-out transform ${positionClass}`}
                                >
                                    <div className="relative w-full">
                                        <div className={`pointer-events-none md:pointer-events-auto ${offset === 0 ? '' : 'pointer-events-none'}`}>
                                            <LogisticsCard title={item.title} sections={item.sections} />
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Progress Bar */}
            <div className="w-[200px] md:w-[400px] h-2 bg-gray-700/50 relative rounded-full mt-12 overflow-hidden z-10">
                <div
                    className="absolute left-0 top-0 h-full bg-[#E51D29] transition-all duration-500 ease-out"
                    style={{ width: `${((actualActiveIndex + 1) / logistics.length) * 100}%` }}
                ></div>
            </div>
        </div>
    );
}